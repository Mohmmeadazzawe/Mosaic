'use client';

import { usePathname, useRouter } from 'next/navigation';
import type { Locale } from '@/lib/i18n/config';

export default function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = () => {
    const newLocale: Locale = currentLocale === 'ar' ? 'en' : 'ar';
    const newPathname = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  // عرض اللغة المعاكسة (إذا عربي يعرض English والعكس)
  const displayText = currentLocale === 'ar' ? 'English' : 'العربية';
  const displayIcon = currentLocale === 'ar' ? '🌐' : '🌐';

  return (
    <button
      onClick={switchLocale}
      className="flex items-center gap-2 py-2 px-4 border-2 border-[#4da2df] rounded-lg bg-[#4DA2DF] text-white cursor-pointer text-base transition-all duration-200 font-bold hover:bg-[#4DA2DF] hover:border-[#4DA2DF]"
    >
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 496 512"
        className="text-[1.2rem]"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z"></path>
      </svg>
      <span>{displayText}</span>
    </button>
  );
}
