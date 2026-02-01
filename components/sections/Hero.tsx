'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getHeroes, type HeroItem } from '@/lib/api/heroes';
import { getHomeStatistics, type StatisticItem } from '@/lib/api/statistics';
import Loading from '@/components/common/Loading';
import type { Dictionary } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/config';

interface HeroProps {
  locale: Locale;
  dict: Dictionary;
}

export default function Hero({ locale, dict }: HeroProps) {
  const [heroes, setHeroes] = useState<HeroItem[]>([]);
  const [statistics, setStatistics] = useState<StatisticItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [heroesData, statsData] = await Promise.all([
        getHeroes(locale),
        getHomeStatistics(locale),
      ]);
      setHeroes(heroesData);
      setStatistics(statsData.statistics);
      setLoading(false);
    }
    fetchData();
  }, [locale]);

  // Auto-slide functionality
  useEffect(() => {
    if (heroes.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroes.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [heroes.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + heroes.length) % heroes.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % heroes.length);
  };

  if (loading) {
    return (
      <section className="relative h-[600px] md:h-[750px] flex items-center justify-center bg-gray-200">
        <Loading locale={locale} />
      </section>
    );
  }

  if (heroes.length === 0) {
    return (
      <section className="relative h-[500px] md:h-[600px] flex items-center justify-center bg-gray-200">
        <div className="text-center text-gray-500">
          <p>{locale === 'ar' ? 'لا توجد صور متاحة' : 'No images available'}</p>
        </div>
      </section>
    );
  }

  const currentHero = heroes[currentIndex] || heroes[0];

  return (
    <section className="relative -mt-[126px]">
      {/* Hero Carousel Section */}
      <div className="relative h-[600px] md:h-[750px] px-[3%] md:px-[4%] pt-[130px] pb-0">
        {currentHero && (
          <>
            <div className="relative h-full rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={currentHero.image}
                alt={currentHero.title || dict.home.title}
                fill
                sizes="100vw"
                className="object-cover transition-opacity duration-500"
                priority={currentIndex === 0}
              />
              <div className="absolute inset-0 bg-black bg-opacity-40" />

              {/* Navigation Arrows */}
              {heroes.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className={`absolute top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-3 hover:bg-opacity-30 transition-all text-white shadow-lg ${
                      locale === 'ar' ? 'right-4' : 'left-4'
                    }`}
                    aria-label="Previous"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={locale === 'ar' ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'}
                      />
                    </svg>
                  </button>
                  <button
                    onClick={goToNext}
                    className={`absolute top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-3 hover:bg-opacity-30 transition-all text-white shadow-lg ${
                      locale === 'ar' ? 'left-4' : 'right-4'
                    }`}
                    aria-label="Next"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={locale === 'ar' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
                      />
                    </svg>
                  </button>
                </>
              )}

              {/* Pagination Dots */}
              {heroes.length > 1 && (
                <div className={`absolute bottom-6 md:bottom-8 z-20 flex flex-col gap-2 ${
                  locale === 'ar' ? 'right-4' : 'right-4'
                }`}>
                  {heroes.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? 'bg-blue-500 h-8'
                          : 'bg-white bg-opacity-50 hover:bg-opacity-75 h-2'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Statistics Section - Overlapping with Hero */}
      {statistics.length > 0 && (
        <div className="relative z-30 px-[15%] md:px-[20%]">
          <div className="bg-blue-600 text-white rounded-2xl shadow-xl py-3 md:py-4 -mt-[30px] md:-mt-[40px]">
            <div className="px-4 md:px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {statistics.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xl md:text-2xl lg:text-3xl font-bold mb-1">
                      {stat.number}
                    </div>
                    <div className="text-xs md:text-sm opacity-90">
                      {stat.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
