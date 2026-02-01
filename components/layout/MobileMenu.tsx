'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getDictionary, type Dictionary } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/config';
import DropdownMenu from './DropdownMenu';
import LanguageSwitcher from './LanguageSwitcher';

interface MobileMenuProps {
  locale: Locale;
  dict: Dictionary;
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ locale, dict, isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  const mainNavItems = [
    { key: 'home', href: `/${locale}` },
    { key: 'projects', href: `/${locale}/projects` },
    { key: 'successStories', href: `/${locale}/success-stories` },
    { key: 'activities', href: `/${locale}/activities` },
    { key: 'statistics', href: `/${locale}/statistics` },
    { key: 'about', href: `/${locale}/about` },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // لا نمنع scroll على الصفحة
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose}>
      <div
        className={`fixed top-[126px] ${locale === 'ar' ? 'right-0' : 'left-0'} h-[calc(100vh-126px)] w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto`}
        ref={menuRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-4 p-4">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={onClose}
              className={`no-underline text-base font-bold py-3 px-4 rounded-lg transition-all duration-200 border-s-4 border-transparent ${
                isActive
                  ? 'text-[#4DA2DF] bg-[#EDF5FB] border-[#4DA2DF]'
                  : 'text-[#333] hover:text-[#4DA2DF] hover:bg-[#EDF5FB] hover:border-[#4DA2DF]'
              }`}
            >
              {dict.nav[item.key as keyof typeof dict.nav]}
            </Link>
          );
        })}
        {/* Dropdown في Mobile */}
        <div className="w-full">
          <DropdownMenu locale={locale} dict={dict} />
        </div>
          {/* Language Button في Mobile */}
          <div className="w-full">
            <LanguageSwitcher currentLocale={locale} />
          </div>
        </div>
      </div>
    </div>
  );
}
