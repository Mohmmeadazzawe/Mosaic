'use client';

import { useState, useEffect } from 'react';
import { getHomeStatistics } from '@/lib/api/statistics';
import Loading from '@/components/common/Loading';
import type { Dictionary } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/config';

interface AboutUsSectionProps {
  locale: Locale;
  dict: Dictionary;
}

// Function to convert YouTube URL to embed URL
function getYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  
  // Handle different YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = match && match[2].length === 11 ? match[2] : null;
  
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  return url;
}

export default function AboutUsSection({ locale, dict }: AboutUsSectionProps) {
  const [youtubeUrl, setYoutubeUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideoUrl() {
      try {
        const statsData = await getHomeStatistics(locale);
        setYoutubeUrl(statsData.youtube_url || '');
      } catch (error) {
        console.error('Error fetching video URL:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchVideoUrl();
  }, [locale]);

  const embedUrl = getYouTubeEmbedUrl(youtubeUrl);

  const aboutTextAr = "نحن مجموعة من المتطوعين والعاملين السوريين من شتى شرائح المجتمع، جمعتنا مسيرة العمل الإنساني منذ عام 2011 سعيًا لتحقيق تنمية مجتمعية فاعلة. نطمح لمجتمعٍ يتمتع أفراده بكامل حقوقهم ويعيشون حياةً كريمة، ونسعى لربط العمل الإغاثي بالتنموي؛ لنشر الوعي والثقافة وبناء مستقبل أفضل. لذلك نركّز على تقديم المعونات العاجلة، وتنمية المهارات عبر برامج تدريبية، وتوفير الرعاية الصحية والنفسية، مع نشر ثقافة التسامح بين جميع الأطياف. كما نعمل على إنشاء مشاريع استثمارية خدمية تدعم تمويل برامجنا وتحقق تنمية مجتمعية مستدامة.";

  const aboutTextEn = "We are a group of Syrian volunteers and workers from all segments of society, united by a humanitarian journey since 2011 in pursuit of effective community development. We aspire to a society whose members enjoy all their rights and live a dignified life. We seek to link relief work with development to spread awareness, culture, and build a better future. Therefore, we focus on providing urgent aid, developing skills through training programs, and providing health and psychological care, while promoting a culture of tolerance among all groups. We also work on establishing service investment projects that support the funding of our programs and achieve sustainable community development.";

  if (loading) {
    return (
      <section className="container mx-auto px-[3%] md:px-[4%] py-8 md:py-10">
        <Loading locale={locale} />
      </section>
    );
  }

  return (
    <section className="container mx-auto px-[3%] md:px-[4%] py-8 md:py-10">
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start ${
        locale === 'ar' ? 'md:grid-flow-col-dense' : ''
      }`}>
        {/* Video Section */}
        <div className={`order-1 ${locale === 'ar' ? 'md:order-2' : 'md:order-1'}`}>
          {embedUrl ? (
            <div className="relative w-full rounded-2xl overflow-hidden shadow-xl bg-black" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={embedUrl}
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={dict.about.title}
              />
            </div>
          ) : (
            <div className="relative w-full rounded-2xl overflow-hidden shadow-xl bg-gray-200" style={{ paddingBottom: '56.25%' }}>
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                {locale === 'ar' ? 'لا يوجد فيديو متاح' : 'No video available'}
              </div>
            </div>
          )}
        </div>

        {/* Text Section */}
        <div className={`order-2 ${locale === 'ar' ? 'md:order-1' : 'md:order-2'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-[#25445E] mb-6">
            {dict.about.title}
          </h2>
          <div 
            className={`text-gray-700 text-base md:text-lg leading-relaxed ${
              locale === 'ar' ? 'text-justify' : 'text-left'
            }`}
          >
            {locale === 'ar' ? aboutTextAr : aboutTextEn}
          </div>
        </div>
      </div>
    </section>
  );
}
