'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import type { Dictionary } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/config';

interface DonationFormProps {
  locale: Locale;
  dict: Dictionary;
}

export default function DonationForm({ locale, dict }: DonationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    experience: '',
    additionalInfo: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          {locale === 'ar' ? 'الاسم' : 'Name'}
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          {locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-2">
          {locale === 'ar' ? 'رقم الهاتف' : 'Phone'}
        </label>
        <input
          type="tel"
          id="phone"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="serviceType" className="block text-sm font-medium mb-2">
          {locale === 'ar' ? 'نوع الخدمة' : 'Service Type'}
        </label>
        <select
          id="serviceType"
          required
          value={formData.serviceType}
          onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">
            {locale === 'ar' ? 'اختر نوع الخدمة' : 'Select Service Type'}
          </option>
          <option value="medical">
            {locale === 'ar' ? 'طبية' : 'Medical'}
          </option>
          <option value="educational">
            {locale === 'ar' ? 'تعليمية' : 'Educational'}
          </option>
          <option value="training">
            {locale === 'ar' ? 'تدريب' : 'Training'}
          </option>
          <option value="support">
            {locale === 'ar' ? 'دعم نفسي' : 'Psychological Support'}
          </option>
        </select>
      </div>

      <div>
        <label htmlFor="experience" className="block text-sm font-medium mb-2">
          {locale === 'ar' ? 'الخبرة' : 'Experience'}
        </label>
        <textarea
          id="experience"
          rows={4}
          value={formData.experience}
          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="additionalInfo" className="block text-sm font-medium mb-2">
          {locale === 'ar' ? 'معلومات إضافية' : 'Additional Information'}
        </label>
        <textarea
          id="additionalInfo"
          rows={4}
          value={formData.additionalInfo}
          onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <Button type="submit" variant="primary" className="w-full">
        {dict.donations.register}
      </Button>
    </form>
  );
}
