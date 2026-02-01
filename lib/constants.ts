export const IMAGE_BASE_URL = 'https://mosaic-hrd.org';

/** عناصر قائمة "المزيد" في النافبار - مصدر واحد لسطح المكتب والموبايل */
export const DROPDOWN_NAV_ITEMS = [
  { key: 'reports', hrefSegment: 'reports' },
  { key: 'donations', hrefSegment: 'donations' },
  { key: 'joinus', hrefSegment: 'joinus' },
  { key: 'contact', hrefSegment: 'contact' },
] as const;

export const IMAGES = {
  hero: `${IMAGE_BASE_URL}/images/hero.jpg`,
  logo: `${IMAGE_BASE_URL}/images/logo.png`,
  // سيتم إضافة المزيد من الصور عند الحاجة
};

/** إحداثيات المقر الرئيسي للجمعية - اللاذقية */
export const SITE_HEADQUARTERS_COORDS: [number, number] = [35.5225, 35.7915];

export const SITE_CONFIG = {
  name: 'Mosaic HRD',
  nameAr: 'موزاييك للإغاثة والتنمية الإنسانية',
  email: 'contact@mosaic-hrd.org',
  address: {
    ar: 'اللاذقية - شارع بغداد - مقابل مديرية الصحة',
    en: 'Latakia - Baghdad Street - Opposite the Health Directorate',
  },
  bankAccounts: {
    albaraka: {
      name: 'بنك البركة سورية',
      accountName: 'موزاييك للإغاثة والتنمية الإنسانية',
      accountNumber: '7001732',
    },
    sib: {
      name: 'بنك سورية الدولي الإسلامي',
      accountName: 'موزاييك للإغاثة والتنمية الإنسانية',
      accountNumber: '202358',
    },
  },
};
