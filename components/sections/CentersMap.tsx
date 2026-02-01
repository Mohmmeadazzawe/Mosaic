'use client';

import { useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { CenterItem } from '@/lib/api/centers';
import type { Locale } from '@/lib/i18n/config';

const DEFAULT_CENTER: [number, number] = [35.5225, 35.7915];
const DEFAULT_ZOOM = 13;

interface CentersMapProps {
  centers: CenterItem[];
  locale: Locale;
}

export default function CentersMap({ centers, locale }: CentersMapProps) {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const centersWithCoords = useMemo(
    () => centers.filter((c): c is CenterItem & { lat: number; lon: number } => typeof c.lat === 'number' && typeof c.lon === 'number'),
    [centers]
  );

  const viewCenter = useMemo((): [number, number] => {
    if (centersWithCoords.length > 0) {
      return [centersWithCoords[0].lat, centersWithCoords[0].lon];
    }
    return DEFAULT_CENTER;
  }, [centersWithCoords]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapRef.current).setView(viewCenter, DEFAULT_ZOOM);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const icon = L.divIcon({
      className: 'custom-marker',
      html: '<div style="background:#22c55e;width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.3)"></div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    });

    centersWithCoords.forEach((center) => {
      const marker = L.marker([center.lat, center.lon], { icon })
        .bindPopup(`<strong>${escapeHtml(center.name)}</strong><br/>${escapeHtml(center.address ?? '')}`)
        .addTo(map);
      marker.on('click', () => {
        router.push(`/${locale}/centers/${center.id}`);
      });
    });

    mapInstanceRef.current = map;
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [centersWithCoords, viewCenter, locale, router]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[500px] rounded-xl overflow-hidden bg-gray-100"
      style={{ minHeight: 500 }}
    />
  );
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
