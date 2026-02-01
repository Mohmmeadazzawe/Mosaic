'use client';

import { useState, useRef } from 'react';
import Button from '@/components/ui/Button';
import type { Dictionary } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/config';

const ACCEPTED_TYPES = '.pdf,.doc,.docx';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const PHONE_REGEX = /^09\d{8}$/; // يبدأ بـ 09 و 10 خانات
const API_BASE = 'https://app.mosaic-hrd.org/api';
const JOB_REQUEST_URL = `${API_BASE}/job-request`;

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  field?: string;
  additionalInfo?: string;
  cv?: string;
}

interface JoinUsFormProps {
  locale: Locale;
  dict: Dictionary;
}

export default function JoinUsForm({ locale, dict }: JoinUsFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    field: '',
    additionalInfo: '',
    cv: null as File | null,
  });

  const allowOnlyDigits = (value: string) => value.replace(/\D/g, '');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = allowOnlyDigits(e.target.value);
    const limited = digitsOnly.slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: limited }));
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
  };

  const validateFile = (file: File): string | null => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext || '')) {
      return locale === 'ar'
        ? 'يرجى رفع ملف PDF أو Word فقط'
        : 'Please upload PDF or Word file only';
    }
    if (file.size > MAX_FILE_SIZE) {
      return locale === 'ar'
        ? 'الحد الأقصى لحجم الملف 5 ميجابايت'
        : 'Maximum file size is 5MB';
    }
    return null;
  };

  const setCvFile = (file: File | null) => {
    setFileError(null);
    setErrors((prev) => (prev.cv ? { ...prev, cv: undefined } : prev));
    if (file) {
      const error = validateFile(file);
      if (error) {
        setFileError(error);
        return;
      }
    }
    setFormData((prev) => ({ ...prev, cv: file }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setCvFile(file);
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, cv: null }));
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const nameTrimmed = formData.name.trim();
    if (!nameTrimmed) {
      newErrors.name = locale === 'ar' ? 'الاسم مطلوب' : 'Name is required';
    }
    if (!PHONE_REGEX.test(formData.phone)) {
      if (!formData.phone) {
        newErrors.phone = locale === 'ar' ? 'رقم الهاتف مطلوب' : 'Phone number is required';
      } else if (!formData.phone.startsWith('09')) {
        newErrors.phone = locale === 'ar' ? 'رقم الهاتف يجب أن يبدأ بـ 09' : 'Phone number must start with 09';
      } else if (formData.phone.length !== 10) {
        newErrors.phone = locale === 'ar' ? 'رقم الهاتف يجب أن يكون 10 خانات' : 'Phone number must be 10 digits';
      } else {
        newErrors.phone = locale === 'ar' ? 'رقم هاتف غير صالح' : 'Invalid phone number';
      }
    }
    const emailTrimmed = formData.email.trim();
    if (!emailTrimmed) {
      newErrors.email = locale === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required';
    }
    const fieldTrimmed = formData.field.trim();
    if (!fieldTrimmed) {
      newErrors.field = locale === 'ar' ? 'مجال الدراسة أو الخبرة مطلوب' : 'Field of study or experience is required';
    }
    const additionalTrimmed = formData.additionalInfo.trim();
    if (!additionalTrimmed) {
      newErrors.additionalInfo = locale === 'ar' ? 'معلومات إضافية مطلوبة' : 'Additional information is required';
    }
    if (!formData.cv) {
      newErrors.cv = locale === 'ar' ? 'رفع السيرة الذاتية مطلوب' : 'CV upload is required';
    }
    setErrors(newErrors);
    if (newErrors.cv) setFileError(newErrors.cv);
    else if (Object.keys(newErrors).length === 0) setFileError(null);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      field: '',
      additionalInfo: '',
      cv: null,
    });
    setErrors({});
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');
    try {
      const body = new FormData();
      body.append('name', formData.name.trim());
      body.append('email', formData.email);
      body.append('phone', formData.phone);
      body.append('expertise', formData.field);
      body.append('bio', formData.additionalInfo);
      if (formData.cv) body.append('cv', formData.cv);

      const res = await fetch(JOB_REQUEST_URL, { method: 'POST', body });
      const data = (await res.json()) as { status?: string; message?: string };
      if (res.ok && data.status !== 'Error') {
        setSubmitStatus('success');
        resetForm();
      } else {
        setSubmitStatus('error');
        setSubmitMessage(
          data.message ||
            (locale === 'ar' ? 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.' : 'An error occurred while submitting. Please try again.')
        );
      }
    } catch {
      setSubmitStatus('error');
      setSubmitMessage(locale === 'ar' ? 'حدث خطأ في الاتصال بالخادم' : 'Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const successText = locale === 'ar' ? 'تم إرسال طلبك بنجاح. سنتواصل معك قريباً.' : 'Your application was submitted successfully. We will contact you soon.';
  const sendingText = locale === 'ar' ? 'جاري الإرسال...' : 'Sending...';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitStatus === 'success' && (
        <div
          className="rounded-lg border border-[#c3e6cb] bg-[#d4edda] p-4 text-[#155724]"
          role="alert"
        >
          {successText}
        </div>
      )}
      {submitStatus === 'error' && (
        <div
          className="rounded-lg border border-[#f5c6cb] bg-[#f8d7da] p-4 text-[#721c24]"
          role="alert"
        >
          {submitMessage}
        </div>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          {locale === 'ar' ? 'الاسم' : 'Name'} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, name: e.target.value }));
            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          disabled={isSubmitting}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-red-600 mt-1 flex items-center gap-1" role="alert">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-2">
          {locale === 'ar' ? 'رقم الهاتف' : 'Phone Number'} <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          inputMode="numeric"
          autoComplete="tel"
          maxLength={10}
          value={formData.phone}
          onChange={handlePhoneChange}
          disabled={isSubmitting}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60 ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="09XXXXXXXX"
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
        />
        <p className="text-xs text-gray-500 mt-1">
          {locale === 'ar' ? 'يبدأ بـ 09 — 10 خانات' : 'Starts with 09 — 10 digits'}
        </p>
        {errors.phone && (
          <p id="phone-error" className="text-sm text-red-600 mt-1 flex items-center gap-1" role="alert">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.phone}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          {locale === 'ar' ? 'البريد الإلكتروني' : 'Email'} <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, email: e.target.value }));
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          disabled={isSubmitting}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-red-600 mt-1 flex items-center gap-1" role="alert">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="field" className="block text-sm font-medium mb-2">
          {locale === 'ar' ? 'مجال الدراسة أو الخبرة' : 'Field of Study or Experience'} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="field"
          value={formData.field}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, field: e.target.value }));
            if (errors.field) setErrors((prev) => ({ ...prev, field: undefined }));
          }}
          disabled={isSubmitting}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60 ${
            errors.field ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder={locale === 'ar' ? 'مثال: هندسة، طب، تعليم...' : 'Example: Engineering, Medicine, Education...'}
          aria-invalid={!!errors.field}
          aria-describedby={errors.field ? 'field-error' : undefined}
        />
        {errors.field && (
          <p id="field-error" className="text-sm text-red-600 mt-1 flex items-center gap-1" role="alert">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.field}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="additionalInfo" className="block text-sm font-medium mb-2">
          {locale === 'ar' ? 'معلومات إضافية' : 'Additional Information'} <span className="text-red-500">*</span>
        </label>
        <textarea
          id="additionalInfo"
          rows={4}
          value={formData.additionalInfo}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, additionalInfo: e.target.value }));
            if (errors.additionalInfo) setErrors((prev) => ({ ...prev, additionalInfo: undefined }));
          }}
          disabled={isSubmitting}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60 ${
            errors.additionalInfo ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder={locale === 'ar' ? 'أخبرنا المزيد عن نفسك...' : 'Tell us more about yourself...'}
          aria-invalid={!!errors.additionalInfo}
          aria-describedby={errors.additionalInfo ? 'additionalInfo-error' : undefined}
        />
        {errors.additionalInfo && (
          <p id="additionalInfo-error" className="text-sm text-red-600 mt-1 flex items-center gap-1" role="alert">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.additionalInfo}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="cv" className="block text-sm font-medium mb-2 text-gray-700">
          {locale === 'ar' ? 'رفع السيرة الذاتية' : 'Upload CV'} <span className="text-red-500">*</span>
        </label>
        <input
          ref={fileInputRef}
          type="file"
          id="cv"
          accept={ACCEPTED_TYPES}
          onChange={handleFileChange}
          disabled={isSubmitting}
          className="sr-only"
          aria-required
          aria-describedby={fileError ? 'cv-error' : undefined}
          aria-invalid={!!errors.cv}
        />
        {!formData.cv ? (
          <div
            role="button"
            tabIndex={isSubmitting ? -1 : 0}
            onClick={() => {
              if (isSubmitting) return;
              fileInputRef.current?.click();
              if (errors.cv) setErrors((prev) => ({ ...prev, cv: undefined }));
            }}
            onKeyDown={(e) => {
              if (isSubmitting) return;
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInputRef.current?.click();
                if (errors.cv) setErrors((prev) => ({ ...prev, cv: undefined }));
              }
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative flex flex-col items-center justify-center min-h-[160px] px-6 py-8 rounded-xl border-2 border-dashed transition-all duration-200 ease-out
              ${isSubmitting ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
              ${errors.cv
                ? 'border-red-500 bg-red-50/50 hover:border-red-600'
                : isDragging
                  ? 'border-[#4DA2DF] bg-[#EDF5FB] scale-[1.01]'
                  : 'border-gray-300 bg-gray-50/80 hover:border-[#4DA2DF] hover:bg-[#EDF5FB]/60'
              }
            `}
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-full bg-[#4DA2DF]/15 flex items-center justify-center">
                <svg className="w-7 h-7 text-[#4DA2DF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-base font-medium text-gray-700">
                  {locale === 'ar' ? 'اسحب الملف هنا أو انقر للاختيار' : 'Drag file here or click to choose'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  PDF, DOC, DOCX {locale === 'ar' ? '(حد أقصى 5 ميجابايت)' : '(max 5MB)'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-[#4DA2DF]/30 bg-[#EDF5FB]">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#4DA2DF]/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#4DA2DF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 truncate" title={formData.cv.name}>
                {formData.cv.name}
              </p>
              <p className="text-sm text-gray-500">{formatFileSize(formData.cv.size)}</p>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              disabled={isSubmitting}
              className="flex-shrink-0 p-2 rounded-lg text-gray-500 hover:bg-[#4DA2DF]/15 hover:text-[#4DA2DF] transition-colors disabled:opacity-60 disabled:pointer-events-none"
              title={locale === 'ar' ? 'إزالة الملف' : 'Remove file'}
              aria-label={locale === 'ar' ? 'إزالة الملف' : 'Remove file'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
        {fileError && (
          <p id="cv-error" className="text-sm text-red-600 mt-2 flex items-center gap-1" role="alert">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {fileError}
          </p>
        )}
      </div>

      <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? sendingText : dict.common.submit}
      </Button>
    </form>
  );
}
