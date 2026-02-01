'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSuccessStories, type SuccessStoryItem } from '@/lib/api/successStories';
import Loading from '@/components/common/Loading';
import type { Dictionary } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/config';

interface SuccessStoriesProps {
  locale: Locale;
  dict: Dictionary;
}

export default function SuccessStories({ locale, dict }: SuccessStoriesProps) {
  const [stories, setStories] = useState<SuccessStoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStories() {
      setLoading(true);
      try {
        const data = await getSuccessStories('', '', '', locale);
        // عرض أول 6 قصص
        setStories(data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching success stories:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStories();
  }, [locale]);

  if (loading) {
    return (
      <section className="container mx-auto px-[3%] md:px-[4%] py-8 md:py-10">
        <Loading locale={locale} />
      </section>
    );
  }

  if (stories.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-[3%] md:px-[4%] py-8 md:py-10">
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-[#25445E] mb-8 md:mb-12 text-center">
        {dict.nav.successStories}
      </h2>

      {/* Stories Grid - 2 rows, 3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
        {stories.map((story) => (
          <Link
            key={story.id}
            href={`/${locale}/success-stories/${story.id}`}
            className="group relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            {/* Story Image */}
            <div className="relative h-64 md:h-80 w-full">
              <Image
                src={story.image}
                alt={story.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Story Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <h3 className="text-white text-lg md:text-xl font-bold line-clamp-2">
                  {story.name}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Stories Button */}
      <div className="text-center">
        <Link
          href={`/${locale}/success-stories`}
          className="inline-block bg-[#4DA2DF] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#3993d4] transition-colors duration-200"
        >
          {dict.home.viewAllStories}
        </Link>
      </div>
    </section>
  );
}
