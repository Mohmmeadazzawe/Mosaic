'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getPartners, type PartnerItem } from '@/lib/api/partners';
import Loading from '@/components/common/Loading';
import type { Dictionary } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/config';

interface PartnersProps {
  locale: Locale;
  dict: Dictionary;
}

export default function Partners({ locale, dict }: PartnersProps) {
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const partnersPerSlide = 5;

  useEffect(() => {
    async function fetchPartners() {
      setLoading(true);
      try {
        const data = await getPartners(locale);
        setPartners(data);
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPartners();
  }, [locale]);

  // Auto-slide functionality
  useEffect(() => {
    if (partners.length === 0) return;

    const totalSlides = Math.ceil(partners.length / partnersPerSlide);
    if (totalSlides <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [partners.length]);

  if (loading) {
    return (
      <section className="container mx-auto px-[3%] md:px-[4%] py-8 md:py-10 bg-gray-50">
        <Loading locale={locale} />
      </section>
    );
  }

  if (partners.length === 0) {
    return null;
  }

  const totalSlides = Math.ceil(partners.length / partnersPerSlide);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  // Build slides: each slide is an array of partnersPerSlide partners
  const slides = Array.from({ length: totalSlides }, (_, i) =>
    partners.slice(i * partnersPerSlide, (i + 1) * partnersPerSlide)
  );

  return (
    <section className="w-full py-8 md:py-10 bg-gray-50">
      <div className="container mx-auto px-[3%] md:px-[4%]">
        <h2 className="text-3xl md:text-4xl font-bold text-[#25445E] text-center mb-8 md:mb-12">
          {locale === 'ar' ? 'شركاؤنا' : 'Our Partners'}
        </h2>
        
        {/* Carousel Container - overflow hidden for slide effect */}
        <div className="relative w-full overflow-hidden min-h-[280px]">
          {/* Sliding track: each slide = 100% of container width */}
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              width: `${totalSlides * 100}%`,
              transform:
                locale === 'ar'
                  ? `translateX(${currentSlide * (100 / totalSlides)}%)`
                  : `translateX(-${currentSlide * (100 / totalSlides)}%)`,
            }}
          >
            {slides.map((slidePartners, slideIndex) => (
              <div
                key={slideIndex}
                className="flex-shrink-0 flex justify-center items-start"
                style={{ width: `${100 / totalSlides}%`, minWidth: `${100 / totalSlides}%` }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 mb-6 w-full max-w-5xl mx-auto">
                  {slidePartners.map((partner) => (
                    <div
                      key={partner.id}
                      className="flex items-center justify-center group w-full aspect-square max-w-[250px] mx-auto"
                    >
                      <Image
                        src={partner.image}
                        alt={partner.name || 'Partner Logo'}
                        width={250}
                        height={250}
                        className="object-contain w-full h-full transition-opacity duration-300 group-hover:opacity-70"
                        onError={() => {
                          console.error('Failed to load partner image:', partner.image);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className={`absolute top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all ${
                  locale === 'ar' ? 'right-0' : 'left-0'
                }`}
                aria-label="Previous"
              >
                <svg
                  className="w-6 h-6 text-[#25445E]"
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
                className={`absolute top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all ${
                  locale === 'ar' ? 'left-0' : 'right-0'
                }`}
                aria-label="Next"
              >
                <svg
                  className="w-6 h-6 text-[#25445E]"
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
          {totalSlides > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-[#4DA2DF] w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
