import { useState, type ChangeEvent, type DragEvent } from 'react'
import { ACCEPT_ATTRIBUTE, ACCEPTED_EXTENSIONS, MAX_FILE_SIZE } from '../../constants/app'
import { formatSize } from '../../utils/format'
import './DropZone.css'

interface Props {
  error?: string
  onFileSelect: (file: File) => void
}

export default function DropZone({ error, onFileSelect }: Props) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsDragging(false)
    }
  }

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files[0]
    if (file) {
      onFileSelect(file)
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
    event.target.value = ''
  }

  const className = ['dropzone', isDragging && 'is-dragging', error && 'has-error'].filter(Boolean).join(' ')

  return (
    <div>
      <label className={className} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
        <input
          type="file"
          className="visually-hidden"
          accept={ACCEPT_ATTRIBUTE}
          aria-describedby="dropzone-hint dropzone-error"
          onChange={handleChange}
        />
        <svg className="dropzone-icon" width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
          <path d="M24 32V12m0 0-8 8m8-8 8 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 30v6a4 4 0 0 0 4 4h24a4 4 0 0 0 4-4v-6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <span className="dropzone-title">{isDragging ? 'Відпустіть файл тут' : 'Перетягніть аудіофайл сюди'}</span>
        <span className="dropzone-or">або</span>
        <span className="btn btn-primary">Обрати файл</span>
        <span id="dropzone-hint" className="dropzone-hint">
          {ACCEPTED_EXTENSIONS.join(', ').toUpperCase()} · до {formatSize(MAX_FILE_SIZE)}
        </span>
      </label>
      {error && (
        <p id="dropzone-error" className="dropzone-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
