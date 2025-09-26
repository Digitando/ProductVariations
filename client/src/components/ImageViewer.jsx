import { useEffect, useState } from 'react'

export default function ImageViewer({ isOpen, src, alt, onClose }) {
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setZoom(1)
    const { style } = document.body
    const previousOverflow = style.overflow
    style.overflow = 'hidden'

    return () => {
      style.overflow = previousOverflow
    }
  }, [isOpen])

  if (!isOpen || !src) {
    return null
  }

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  const increaseZoom = () => setZoom((value) => Math.min(3, Number((value + 0.25).toFixed(2))))
  const decreaseZoom = () => setZoom((value) => Math.max(0.5, Number((value - 0.25).toFixed(2))))

  return (
    <div className="image-viewer__backdrop" role="presentation" onClick={handleBackdropClick}>
      <div className="image-viewer" role="dialog" aria-modal="true" aria-label="Generated image preview">
        <header className="image-viewer__header">
          <div>
            <p className="image-viewer__filename" title={alt || 'Generated variation'}>
              {alt || 'Generated variation'}
            </p>
            <p className="image-viewer__meta">Zoom {Math.round(zoom * 100)}%</p>
          </div>
          <div className="image-viewer__actions">
            <button type="button" className="icon-button" onClick={decreaseZoom} aria-label="Zoom out">
              −
            </button>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              aria-label="Zoom level"
            />
            <button type="button" className="icon-button" onClick={increaseZoom} aria-label="Zoom in">
              +
            </button>
            <a className="secondary" href={src} target="_blank" rel="noreferrer">
              Open original
            </a>
            <button type="button" className="secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </header>
        <div className="image-viewer__canvas">
          <img src={src} alt={alt || 'Generated variation'} style={{ transform: `scale(${zoom})` }} />
        </div>
      </div>
    </div>
  )
}
