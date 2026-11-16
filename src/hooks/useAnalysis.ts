import { useCallback, useEffect, useReducer, useRef } from 'react'
import { useNavigate } from 'react-router'
import { analyzeAudio } from '../services/analyzer'
import { decodeAudio, getAudioInfo } from '../services/audioDecoder'
import { rememberAudio } from '../services/audioStore'
import { validateAudioFile } from '../services/fileValidation'
import type { Analysis, DemoRecording } from '../types'
import { useHistory } from '../context/historyContext'
import { useToast } from '../context/toastContext'

export type AnalysisState =
  | { status: 'idle' }
  | { status: 'validating'; fileName: string }
  | { status: 'analyzing'; fileName: string; progress: number; stage: string }
  | { status: 'error'; message: string }

type AnalysisAction =
  | { type: 'start'; fileName: string }
  | { type: 'progress'; progress: number; stage: string }
  | { type: 'fail'; message: string }
  | { type: 'reset' }

function analysisReducer(state: AnalysisState, action: AnalysisAction): AnalysisState {
  switch (action.type) {
    case 'start':
      return { status: 'validating', fileName: action.fileName }
    case 'progress':
      if (state.status !== 'validating' && state.status !== 'analyzing') {
        return state
      }
      return { status: 'analyzing', fileName: state.fileName, progress: action.progress, stage: action.stage }
    case 'fail':
      return { status: 'error', message: action.message }
    case 'reset':
      return { status: 'idle' }
  }
}

export function useAnalysis() {
  const [state, dispatch] = useReducer(analysisReducer, { status: 'idle' })
  const controllerRef = useRef<AbortController | null>(null)
  const navigate = useNavigate()
  const { addAnalysis } = useHistory()
  const { showToast } = useToast()

  useEffect(() => () => controllerRef.current?.abort(), [])

  const analyzeFile = useCallback(
    async (file: File, persistentUrl?: string) => {
      controllerRef.current?.abort()
      const controller = new AbortController()
      controllerRef.current = controller
      dispatch({ type: 'start', fileName: file.name })

      try {
        await validateAudioFile(file)
        const buffer = await decodeAudio(file)
        controller.signal.throwIfAborted()
        const info = getAudioInfo(file, buffer)
        const defects = await analyzeAudio(
          { fileName: file.name, size: file.size, duration: info.duration },
          (progress, stage) => dispatch({ type: 'progress', progress, stage }),
          controller.signal,
        )
        const analysis: Analysis = {
          id: crypto.randomUUID(),
          fileName: file.name,
          createdAt: new Date().toISOString(),
          info,
          defects,
          audioUrl: persistentUrl,
        }
        if (!persistentUrl) {
          rememberAudio(analysis.id, file)
        }
        addAnalysis(analysis)
        showToast('success', `Аналіз «${file.name}» завершено`)
        navigate(`/result/${analysis.id}`)
      } catch (error) {
        if (controller.signal.aborted) {
          dispatch({ type: 'reset' })
          return
        }
        dispatch({ type: 'fail', message: error instanceof Error ? error.message : 'Сталася невідома помилка.' })
      }
    },
    [addAnalysis, navigate, showToast],
  )

  const analyzeDemo = useCallback(
    async (demo: DemoRecording) => {
      const url = `${import.meta.env.BASE_URL}demo/${demo.file}`
      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error()
        }
        const blob = await response.blob()
        await analyzeFile(new File([blob], demo.file, { type: blob.type }), url)
      } catch {
        dispatch({ type: 'fail', message: 'Не вдалося завантажити демонстраційний запис.' })
      }
    },
    [analyzeFile],
  )

  const cancel = useCallback(() => {
    controllerRef.current?.abort()
    showToast('info', 'Аналіз скасовано')
  }, [showToast])

  const reset = useCallback(() => dispatch({ type: 'reset' }), [])

  return { state, analyzeFile, analyzeDemo, cancel, reset }
}
