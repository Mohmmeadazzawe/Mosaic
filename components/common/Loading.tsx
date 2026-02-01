'use client';

import type { Locale } from '@/lib/i18n/config';

interface LoadingProps {
  locale?: Locale;
  text?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function Loading({ locale = 'ar', text, size = 'medium' }: LoadingProps) {
  const loadingText = text || (locale === 'ar' ? 'جاري التحميل...' : 'Loading...');
  
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-[3px]',
    large: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      {/* Spinner */}
      <div className="relative">
        <div
          className={`${sizeClasses[size]} border-gray-200 border-t-[#4DA2DF] rounded-full animate-spin`}
        />
      </div>
      
      {/* Loading Text */}
      <div className="flex items-center gap-2">
        <span className="text-gray-600 font-medium">{loadingText}</span>
        <div className="flex gap-1">
          <span 
            className="w-1.5 h-1.5 bg-[#4DA2DF] rounded-full animate-bounce" 
            style={{ animationDelay: '0ms', animationDuration: '1.4s' }} 
          />
          <span 
            className="w-1.5 h-1.5 bg-[#4DA2DF] rounded-full animate-bounce" 
            style={{ animationDelay: '200ms', animationDuration: '1.4s' }} 
          />
          <span 
            className="w-1.5 h-1.5 bg-[#4DA2DF] rounded-full animate-bounce" 
            style={{ animationDelay: '400ms', animationDuration: '1.4s' }} 
          />
        </div>
      </div>
    </div>
  );
}
