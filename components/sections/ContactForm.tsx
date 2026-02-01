'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import type { Dictionary } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/config';

interface ContactFormProps {
  locale: Locale;
  dict: Dictionary;
}

export default function ContactForm({ locale, dict }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle form submission
    console.log('Form submitted:', formData);
  };

  const nameLabel = locale === 'ar' ? 'الاسم*' : 'Name*';
  const emailLabel = locale === 'ar' ? 'البريد الإلكتروني*' : 'Email*';
  const messageLabel = locale === 'ar' ? 'الرسالة' : 'Message';
  const namePlaceholder = locale === 'ar' ? 'اسمك' : 'Your name';
  const emailPlaceholder = locale === 'ar' ? 'بريدك الإلكتروني' : 'Your email';
  const messagePlaceholder = locale === 'ar' ? 'رسالتك' : 'Your message';
  const submitLabel = locale === 'ar' ? 'إرسال الرسالة' : 'Send Message';

  return (
    <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
      <div>
        <label htmlFor="name" className="block text-gray-800 font-medium mb-2">
          {nameLabel}
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder={namePlaceholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#4DA2DF] focus:border-[#4DA2DF] transition-colors"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-gray-800 font-medium mb-2">
          {emailLabel}
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder={emailPlaceholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#4DA2DF] focus:border-[#4DA2DF] transition-colors"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-gray-800 font-medium mb-2">
          {messageLabel}
        </label>
        <textarea
          id="message"
          required
          rows={6}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder={messagePlaceholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#4DA2DF] focus:border-[#4DA2DF] transition-colors resize-y min-h-[140px]"
        />
      </div>

      <Button type="submit" variant="primary" className="w-full py-3 rounded-xl font-semibold">
        {submitLabel}
      </Button>
    </form>
  );
}
