import { useState } from 'react'
import type { MiracleImage } from '../../hooks/useMiracles'

interface Props { images: MiracleImage[]; title: string }

export function MiracleGallery({ images, title }: Props) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  if (!images.length) return (
    <div className="mg-empty">
      <span>🖼</span><span>Nessuna immagine disponibile</span>
    </div>
  )

  return (
    <div className="mg-wrap">
      {/* Immagine principale */}
      <div className="mg-main" onClick={() => setLightbox(true)}>
        <img src={images[active].url} alt={images[active].altText ?? title} className="mg-main-img" />
        <div className="mg-main-overlay">🔍 Ingrandisci</div>
        {images[active].credit && (
          <div className="mg-credit">© {images[active].credit}</div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mg-thumbs">
          {images.map((img, i) => (
            <div key={img.id} className={`mg-thumb ${i === active ? 'mg-thumb-active' : ''}`}
              onClick={() => setActive(i)}>
              <img src={img.url} alt={img.altText ?? `${title} ${i + 1}`} />
            </div>
          ))}
        </div>
      )}

      {/* Caption */}
      {images[active].caption && (
        <div className="mg-caption">{images[active].caption}</div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="mg-lightbox" onClick={() => setLightbox(false)}>
          <div className="mg-lb-inner" onClick={e => e.stopPropagation()}>
            <img src={images[active].url} alt={images[active].altText ?? title} className="mg-lb-img" />
            <button className="mg-lb-close" onClick={() => setLightbox(false)}>✕</button>
            {images.length > 1 && (
              <>
                <button className="mg-lb-prev" onClick={() => setActive(p => Math.max(0, p - 1))}>‹</button>
                <button className="mg-lb-next" onClick={() => setActive(p => Math.min(images.length - 1, p + 1))}>›</button>
              </>
            )}
            {images[active].caption && <div className="mg-lb-caption">{images[active].caption}</div>}
          </div>
        </div>
      )}
    </div>
  )
}
