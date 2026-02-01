import type { Locale } from './config';
import arMessages from './messages/ar.json';
import enMessages from './messages/en.json';

const dictionaries = {
  ar: arMessages,
  en: enMessages,
} as const;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

export type Dictionary = typeof arMessages;
