'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DROPDOWN_NAV_ITEMS } from '@/lib/constants';
import type { Dictionary } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/config';

interface DropdownMenuProps {
  locale: Locale;
  dict: Dictionary;
}

export default function DropdownMenu({ locale, dict }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const dropdownItems = DROPDOWN_NAV_ITEMS.map((item) => ({
    key: item.key,
    href: `/${locale}/${item.hrefSegment}`,
  }));

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="flex items-center gap-2 py-2 px-4 bg-[#4DA2DF] text-white cursor-pointer text-base font-bold relative overflow-hidden border-2 border-[#4da2df] rounded-lg transition-all duration-200 hover:bg-[#3993d4] hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(77,162,223,0.2)] active:translate-y-0"
      >
        <span>{dict.nav.more}..</span>
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 448 512"
          className={`text-[0.8rem] mt-0.5 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path>
        </svg>
      </button>

      {isOpen && (
        <div
          className={`absolute top-[calc(100%+10px)] ${
            locale === 'ar' ? 'right-0' : 'left-0'
          } bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] min-w-[240px] z-[1000] py-3 px-0 opacity-100 visible translate-y-0 transition-all duration-300 border border-[rgba(77,162,223,0.1)]`}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {dropdownItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center py-3 px-6 text-[15px] font-bold no-underline transition-all duration-200 border-s-4 border-transparent ${
                  isActive
                    ? 'text-[#4DA2DF] bg-[#EDF5FB] border-[#4DA2DF]'
                    : 'text-[#333] hover:text-[#4DA2DF] hover:bg-[#EDF5FB] hover:border-[#4DA2DF]'
                }`}
              >
                {dict.nav[item.key as keyof typeof dict.nav]}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
