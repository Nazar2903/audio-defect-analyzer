import { useMemo, useRef } from 'react'
import { Link, useSearchParams } from 'react-router'
import { DEFECT_TYPE_KEYS } from '../../constants/defects'
import { useSettings } from '../../context/settingsContext'
import { getAudioUrl } from '../../services/audioStore'
import {
  countByType,
  filterDefects,
  getQualityScore,
  parseDefectSort,
  parseDefectType,
  sortDefects,
  type DefectSort,
  type DefectTypeFilter,
} from '../../services/defects'
import type { Analysis, Defect } from '../../types'
import { formatDate } from '../../utils/format'
import EmptyState from '../ui/EmptyState'
import DefectFilters from './DefectFilters'
import DefectSummary from './DefectSummary'
import DefectTable from './DefectTable'
import DefectTimeline from './DefectTimeline'
import ExportButtons from './ExportButtons'
import QualityScore from './QualityScore'
import RecordingInfo from './RecordingInfo'
import WaveformPlayer, { type PlayerHandle } from './WaveformPlayer'
import './ResultCards.css'

export default function AnalysisReport({ analysis }: { analysis: Analysis }) {
  const { settings } = useSettings()
  const [searchParams, setSearchParams] = useSearchParams()
  const playerRef = useRef<PlayerHandle>(null)

  const typeFilter = parseDefectType(searchParams.get('type'))
  const sort = parseDefectSort(searchParams.get('sort'))
  const audioUrl = analysis.audioUrl ?? getAudioUrl(analysis.id)
  const score = getQualityScore(analysis.defects)
  const counts = countByType(analysis.defects)
  const presentTypes = DEFECT_TYPE_KEYS.filter((type) => counts[type])

  const visibleDefects = useMemo(
    () => sortDefects(filterDefects(analysis.defects, typeFilter, settings.minSeverity), sort),
    [analysis.defects, typeFilter, settings.minSeverity, sort],
  )
  const hiddenBySettings = filterDefects(analysis.defects, typeFilter, 'low').length - visibleDefects.length

  const updateParam = (key: string, value: string, defaultValue: string) => {
    setSearchParams(
      (params) => {
        if (value === defaultValue) {
          params.delete(key)
        } else {
          params.set(key, value)
        }
        return params
      },
      { replace: true },
    )
  }

  const handlePlay = (defect: Defect) => {
    playerRef.current?.seekTo(defect.start)
  }

  return (
    <>
      <div className="page-header">
        <div className="report-title">
          <h1>{analysis.fileName}</h1>
          <p>Проаналізовано {formatDate(analysis.createdAt)}</p>
        </div>
        <ExportButtons analysis={analysis} />
      </div>

      <div className="result-grid">
        <RecordingInfo info={analysis.info} />
        <QualityScore score={score} />
        <DefectSummary defects={analysis.defects} />
      </div>

      <section className="card" aria-labelledby="wave-title">
        <h2 id="wave-title">Хвильова форма</h2>
        {audioUrl ? (
          <WaveformPlayer
            key={audioUrl}
            ref={playerRef}
            url={audioUrl}
            duration={analysis.info.duration}
            defects={analysis.defects}
          />
        ) : (
          <DefectTimeline duration={analysis.info.duration} defects={analysis.defects} />
        )}
      </section>

      <section className="card" aria-labelledby="defects-title">
        <h2 id="defects-title">Дефекти та рекомендації</h2>
        {analysis.defects.length === 0 ? (
          <EmptyState
            title="Дефектів не знайдено"
            description="Запис пройшов усі перевірки. Його можна використовувати без додаткової обробки."
            action={
              <Link to="/" className="btn btn-primary">
                Проаналізувати інший файл
              </Link>
            }
          />
        ) : (
          <>
            <DefectFilters
              types={presentTypes}
              type={typeFilter}
              sort={sort}
              onTypeChange={(value: DefectTypeFilter) => updateParam('type', value, 'all')}
              onSortChange={(value: DefectSort) => updateParam('sort', value, 'time')}
            />
            <p className="report-count muted" aria-live="polite">
              Показано {visibleDefects.length} з {analysis.defects.length}
              {hiddenBySettings > 0 && ` · ${hiddenBySettings} приховано через мінімальну серйозність у налаштуваннях`}
            </p>
            {visibleDefects.length > 0 ? (
              <DefectTable defects={visibleDefects} onPlay={audioUrl ? handlePlay : undefined} />
            ) : (
              <p>Немає дефектів, що відповідають обраним фільтрам.</p>
            )}
          </>
        )}
      </section>
    </>
  )
}
