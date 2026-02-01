'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from './Navigation';
import LanguageSwitcher from './LanguageSwitcher';
import MobileMenu from './MobileMenu';
import { getDictionary } from '@/lib/i18n/dictionary';
import { SITE_CONFIG } from '@/lib/constants';
import type { Locale } from '@/lib/i18n/config';

interface HeaderProps {
  locale: Locale;
}

export default function Header({ locale }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dict = getDictionary(locale);

  return (
    <header className="bg-white fixed top-0 left-0 w-full z-[1000] shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
      <nav className="flex justify-between items-center p-4 lg:px-8">
        {/* Logo Section - على الطرف حسب اتجاه اللغة */}
        <div className="flex items-center">
          <Link href={`/${locale}`} className="flex items-center hover:opacity-80 transition-opacity">
            <Image
              alt="Logo"
              width={60}
              height={60}
              src="/logo.png"
              className="object-contain"
              style={{ width: 'auto', height: 'auto' }}
              priority
            />
          </Link>
        </div>

        {/* Desktop Navigation - في الوسط */}
        <div className="hidden lg:flex items-center gap-24 flex-1 justify-center">
          <Navigation locale={locale} dict={dict} />
        </div>

        {/* Language Switcher and Mobile Menu - على الطرف الآخر */}
        <div className="flex items-center gap-4">
          {/* Desktop Language Switcher */}
          <div className="hidden lg:flex items-center">
            <LanguageSwitcher currentLocale={locale} />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden bg-none border-none text-[#333] cursor-pointer p-2"
            aria-label="Menu"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 20 20"
              height="24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </nav>
      {/* Mobile Menu */}
      <MobileMenu
        locale={locale}
        dict={dict}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
}
