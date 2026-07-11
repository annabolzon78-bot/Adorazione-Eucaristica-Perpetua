import { useEffect, useRef } from 'react'

interface Props { lat: number; lng: number; title: string; isVisitable?: boolean }

export function MiracleMap({ lat, lng, title, isVisitable }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    let map: any = null

    const init = async () => {
      const L = await import('leaflet')
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })
      map = L.map(ref.current!, { center: [lat, lng], zoom: 13, zoomControl: true, scrollWheelZoom: false })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors', maxZoom: 19,
      }).addTo(map)
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:18px;height:18px;background:#8b1a2a;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4)"></div>`,
        iconSize: [18, 18], iconAnchor: [9, 9],
      })
      L.marker([lat, lng], { icon }).addTo(map).bindPopup(
        `<b>${title}</b>${isVisitable ? '<br><span style="color:#166534">📍 Visitabile</span>' : ''}`
      ).openPopup()
    }
    init()
    return () => { map?.remove() }
  }, [lat, lng, title, isVisitable])

  const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
  const osmUrl    = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=14`

  return (
    <div className="mm-wrap">
      <div ref={ref} className="mm-map" />
      <div className="mm-nav-row">
        <a href={googleUrl} target="_blank" rel="noopener noreferrer" className="mm-nav-btn mm-nav-google">📍 Google Maps</a>
        <a href={osmUrl}    target="_blank" rel="noopener noreferrer" className="mm-nav-btn mm-nav-osm">🗺️ OpenStreetMap</a>
      </div>
    </div>
  )
}
