'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SITE_CONFIG, SITE_HEADQUARTERS_COORDS } from '@/lib/constants';
import type { Locale } from '@/lib/i18n/config';

const ZOOM = 15;

interface ContactMapProps {
  locale: Locale;
}

export default function ContactMap({ locale }: ContactMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapRef.current).setView(SITE_HEADQUARTERS_COORDS, ZOOM);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const associationName = locale === 'ar' ? SITE_CONFIG.nameAr : SITE_CONFIG.name;
    const address = SITE_CONFIG.address[locale];

    const icon = L.divIcon({
      className: 'contact-marker',
      html: '<div style="background:#4DA2DF;width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14],
    });

    L.marker(SITE_HEADQUARTERS_COORDS, { icon })
      .bindPopup(`<strong>${escapeHtml(associationName)}</strong><br/>${escapeHtml(address)}`)
      .addTo(map)
      .openPopup();

    mapInstanceRef.current = map;
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locale]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[400px] rounded-xl overflow-hidden bg-gray-100"
      style={{ minHeight: 400 }}
    />
  );
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
