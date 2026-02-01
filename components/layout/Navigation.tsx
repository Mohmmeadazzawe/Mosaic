'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getDictionary, type Dictionary } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/config';
import DropdownMenu from './DropdownMenu';

interface NavigationProps {
  locale: Locale;
  dict: Dictionary;
}

export default function Navigation({ locale, dict }: NavigationProps) {
  const pathname = usePathname();

  // العناصر الأساسية في النافبار
  const mainNavItems = [
    { key: 'home', href: `/${locale}` },
    { key: 'projects', href: `/${locale}/projects` },
    { key: 'successStories', href: `/${locale}/success-stories` },
    { key: 'activities', href: `/${locale}/activities` },
    { key: 'statistics', href: `/${locale}/statistics` },
    { key: 'about', href: `/${locale}/about` },
  ];

  return (
    <div className="flex items-center gap-0.5">
      {mainNavItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.key}
            href={item.href}
            className={`no-underline text-[#25445E] text-base font-bold transition-all duration-200 py-2 px-4 rounded-[20px] border-s-4 border-transparent ${
              isActive
                ? 'text-[#4DA2DF] bg-[#EDF5FB] border-[#4DA2DF]'
                : 'hover:text-[#4DA2DF] hover:bg-[#EDF5FB] hover:border-[#4DA2DF]'
            }`}
          >
            {dict.nav[item.key as keyof typeof dict.nav]}
          </Link>
        );
      })}
      <DropdownMenu locale={locale} dict={dict} />
    </div>
  );
}
