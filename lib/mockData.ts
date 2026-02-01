import { IMAGE_BASE_URL } from './constants';

export interface Project {
  id: number;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  image: string;
  category: string;
  date: string;
  location: string;
  details?: string;
  detailsEn?: string;
}

export interface Activity {
  id: number;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  image: string;
  date: string;
  location: string;
  type: string;
}

export interface SuccessStory {
  id: number;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  image: string;
  date: string;
  category: string;
}

export interface Statistic {
  id: number;
  label: string;
  labelEn: string;
  value: number;
  icon?: string;
}

export interface Partner {
  id: number;
  name: string;
  logo: string;
  website?: string;
}

export interface Report {
  id: number;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  fileUrl: string;
  date: string;
  type: string;
}

export const mockProjects: Project[] = [
  {
    id: 1,
    title: 'مشروع الدعم التعليمي',
    titleEn: 'Educational Support Project',
    description: 'مشروع يهدف لدعم التعليم في المناطق المحتاجة',
    descriptionEn: 'A project aimed at supporting education in needy areas',
    image: `${IMAGE_BASE_URL}/images/project1.jpg`,
    category: 'تعليم',
    date: '2024-01-15',
    location: 'اللاذقية',
  },
  {
    id: 2,
    title: 'مشروع الإغاثة الطارئة',
    titleEn: 'Emergency Relief Project',
    description: 'تقديم المساعدات العاجلة للمتضررين',
    descriptionEn: 'Providing urgent assistance to those affected',
    image: `${IMAGE_BASE_URL}/images/project2.jpg`,
    category: 'إغاثة',
    date: '2024-02-20',
    location: 'دمشق',
  },
  {
    id: 3,
    title: 'مشروع التمكين الاقتصادي',
    titleEn: 'Economic Empowerment Project',
    description: 'دعم المشاريع الصغيرة والمتوسطة',
    descriptionEn: 'Supporting small and medium enterprises',
    image: `${IMAGE_BASE_URL}/images/project3.jpg`,
    category: 'تنمية',
    date: '2024-03-10',
    location: 'حلب',
  },
];

export const mockActivities: Activity[] = [
  {
    id: 1,
    title: 'ورشة عمل حول المهارات الحياتية',
    titleEn: 'Life Skills Workshop',
    description: 'ورشة عمل لتعليم المهارات الحياتية الأساسية',
    descriptionEn: 'Workshop to teach basic life skills',
    image: `${IMAGE_BASE_URL}/images/activity1.jpg`,
    date: '2024-04-05',
    location: 'اللاذقية',
    type: 'تدريب',
  },
  {
    id: 2,
    title: 'حملة توعية صحية',
    titleEn: 'Health Awareness Campaign',
    description: 'حملة توعية حول الصحة العامة والنظافة',
    descriptionEn: 'Awareness campaign about public health and hygiene',
    image: `${IMAGE_BASE_URL}/images/activity2.jpg`,
    date: '2024-04-15',
    location: 'دمشق',
    type: 'توعية',
  },
];

export const mockSuccessStories: SuccessStory[] = [
  {
    id: 1,
    title: 'قصة نجاح أحمد',
    titleEn: 'Ahmed\'s Success Story',
    description: 'كيف ساعدنا أحمد في بدء مشروعه الصغير',
    descriptionEn: 'How we helped Ahmed start his small business',
    image: `${IMAGE_BASE_URL}/images/story1.jpg`,
    date: '2024-01-20',
    category: 'تمكين اقتصادي',
  },
  {
    id: 2,
    title: 'قصة نجاح فاطمة',
    titleEn: 'Fatima\'s Success Story',
    description: 'رحلة فاطمة في التعليم والتمكين',
    descriptionEn: 'Fatima\'s journey in education and empowerment',
    image: `${IMAGE_BASE_URL}/images/story2.jpg`,
    date: '2024-02-10',
    category: 'تعليم',
  },
];

export const mockStatistics: Statistic[] = [
  {
    id: 1,
    label: 'مشروع منفذ',
    labelEn: 'Completed Projects',
    value: 150,
  },
  {
    id: 2,
    label: 'مستفيد',
    labelEn: 'Beneficiaries',
    value: 5000,
  },
  {
    id: 3,
    label: 'نشاط',
    labelEn: 'Activities',
    value: 300,
  },
  {
    id: 4,
    label: 'متطوع',
    labelEn: 'Volunteers',
    value: 200,
  },
];

export const mockPartners: Partner[] = [
  {
    id: 1,
    name: 'شريك 1',
    logo: `${IMAGE_BASE_URL}/images/partner1.png`,
  },
  {
    id: 2,
    name: 'شريك 2',
    logo: `${IMAGE_BASE_URL}/images/partner2.png`,
  },
];

export const mockReports: Report[] = [
  {
    id: 1,
    title: 'التقرير السنوي 2023',
    titleEn: 'Annual Report 2023',
    description: 'تقرير شامل عن أنشطة المؤسسة لعام 2023',
    descriptionEn: 'Comprehensive report on the organization\'s activities for 2023',
    fileUrl: `${IMAGE_BASE_URL}/reports/report2023.pdf`,
    date: '2024-01-01',
    type: 'سنوي',
  },
  {
    id: 2,
    title: 'تقرير المشاريع',
    titleEn: 'Projects Report',
    description: 'تقرير عن المشاريع المنفذة',
    descriptionEn: 'Report on implemented projects',
    fileUrl: `${IMAGE_BASE_URL}/reports/projects.pdf`,
    date: '2024-03-15',
    type: 'مشاريع',
  },
];
