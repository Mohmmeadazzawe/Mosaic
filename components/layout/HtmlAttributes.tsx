'use client';

import { useEffect } from 'react';

interface HtmlAttributesProps {
  lang: string;
  dir: 'rtl' | 'ltr';
}

export default function HtmlAttributes({ lang, dir }: HtmlAttributesProps) {
  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', dir);
  }, [lang, dir]);

  return null;
}
