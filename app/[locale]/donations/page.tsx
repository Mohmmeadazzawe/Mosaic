import Image from 'next/image';
import { getDictionary } from '@/lib/i18n/dictionary';
import { SITE_CONFIG } from '@/lib/constants';
import type { Locale } from '@/lib/i18n/config';

function InfoCard({
  children,
  locale,
  className = '',
}: {
  children: React.ReactNode;
  locale: Locale;
  className?: string;
}) {
  return (
    <div
      className={`p-4 rounded-lg border-[#4DA2DF] bg-[#EDF5FB] ${
        locale === 'ar' ? 'border-r-4' : 'border-l-4'
      } ${className}`}
    >
      {children}
    </div>
  );
}

function DonationColumn({
  imageSrc,
  title,
  description,
  centerTitle,
  centerInfo,
  contactTitle,
  contactInfo,
  email,
  locale,
}: {
  imageSrc: string;
  title: string;
  description: string;
  centerTitle: string;
  centerInfo: string;
  contactTitle: string;
  contactInfo: string;
  email: string;
  locale: Locale;
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
      <div className="relative w-full aspect-[4/3] bg-gray-200">
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h2 className="text-xl md:text-2xl font-bold text-[#25445E] mb-3">
          {title}
        </h2>
        <p className="text-gray-700 mb-6 leading-relaxed">{description}</p>

        <h3 className="text-lg font-semibold text-[#25445E] mb-3">
          {centerTitle}
        </h3>
        <InfoCard locale={locale}>
          <p className="text-gray-700 text-sm leading-relaxed">{centerInfo}</p>
        </InfoCard>

        <h3 className="text-lg font-semibold text-[#25445E] mt-6 mb-3">
          {contactTitle}
        </h3>
        <InfoCard locale={locale}>
          <p className="text-gray-700 text-sm leading-relaxed mb-2">
            {contactInfo}
          </p>
          <a
            href={`mailto:${email}`}
            className="text-[#4DA2DF] font-semibold hover:text-[#3993d4] break-all"
          >
            {email}
          </a>
        </InfoCard>
      </div>
    </div>
  );
}

const TIME_DONATION_FORM_URL =
  'https://docs.google.com/forms/d/1opIu4U5tasqHh529nuPbmEb-4OM3zzb9aPB81E3GkPo/viewform?pli=1&pli=1&edit_requested=true';

function TimeDonationColumn({
  locale,
  dict,
}: {
  locale: Locale;
  dict: ReturnType<typeof getDictionary>;
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
      <div className="relative w-full aspect-[4/3] bg-gray-200">
        <Image
          src="/images/donation/time-donation.jpg"
          alt={dict.donations.time}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h2 className="text-xl md:text-2xl font-bold text-[#25445E] mb-3">
          {dict.donations.time}
        </h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          {dict.donations.timeDesc}
        </p>

        <h3 className="text-lg font-semibold text-[#4DA2DF] mb-3 text-center">
          {dict.donations.registrationInfo}
        </h3>
        <InfoCard locale={locale}>
          <p className="text-[#4DA2DF] text-sm leading-relaxed text-center">
            {dict.donations.timeCenterInfo}
          </p>
        </InfoCard>

        <div className="mt-6 space-y-4">
          <div>
            <h4 className="text-base font-bold text-[#4DA2DF] mb-1">
              {dict.donations.serviceProvision}
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              {dict.donations.serviceProvisionDesc}
            </p>
          </div>
          <div>
            <h4 className="text-base font-bold text-[#4DA2DF] mb-1">
              {dict.donations.trainingWorkshops}
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              {dict.donations.trainingWorkshopsDesc}
            </p>
          </div>
          <div>
            <h4 className="text-base font-bold text-[#4DA2DF] mb-1">
              {dict.donations.psychoSocialSupport}
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              {dict.donations.psychoSocialSupportDesc}
            </p>
          </div>
          <div>
            <h4 className="text-base font-bold text-[#4DA2DF] mb-1">
              {dict.donations.educationalCultural}
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              {dict.donations.educationalCulturalDesc}
            </p>
          </div>
        </div>

        <a
          href={TIME_DONATION_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex justify-center items-center px-6 py-3 bg-[#4DA2DF] text-white font-bold rounded-lg hover:bg-[#3993d4] transition-colors text-center"
        >
          {dict.donations.registerFormButton}
        </a>
      </div>
    </div>
  );
}

function MonetaryDonationColumn({
  locale,
  dict,
}: {
  locale: Locale;
  dict: ReturnType<typeof getDictionary>;
}) {
  const { bankAccounts } = SITE_CONFIG;
  const accountHolder =
    locale === 'ar' ? SITE_CONFIG.nameAr : SITE_CONFIG.name;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
      <div className="relative w-full aspect-[4/3] bg-gray-200">
        <Image
          src="/images/donation/money-donation.jpg"
          alt={dict.donations.monetary}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h2 className="text-xl md:text-2xl font-bold text-[#25445E] mb-3">
          {dict.donations.monetary}
        </h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          {dict.donations.monetaryDesc}
        </p>

        <h3 className="text-lg font-semibold text-[#25445E] mb-3">
          {dict.donations.bankAccountsTitle}
        </h3>
        <InfoCard locale={locale}>
          <p className="font-semibold text-[#25445E] mb-1">
            {dict.donations.bankAlBaraka}
          </p>
          <p className="text-gray-700 text-sm mb-1">{accountHolder}</p>
          <p className="text-gray-700 text-sm">
            {dict.donations.accountNumberLabel}:{' '}
            {bankAccounts.albaraka.accountNumber}
          </p>
        </InfoCard>
        <InfoCard locale={locale} className="mt-3">
          <p className="font-semibold text-[#25445E] mb-1">
            {dict.donations.bankSib}
          </p>
          <p className="text-gray-700 text-sm mb-1">{accountHolder}</p>
          <p className="text-gray-700 text-sm">
            {dict.donations.accountNumberLabel}: {bankAccounts.sib.accountNumber}
          </p>
        </InfoCard>

        <div className="mt-6 space-y-4">
          <div>
            <h4 className="text-base font-bold text-[#4DA2DF] mb-1">
              {dict.donations.directSupport}
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              {dict.donations.directSupportDesc}
            </p>
          </div>
          <div>
            <h4 className="text-base font-bold text-[#4DA2DF] mb-1">
              {dict.donations.sponsorships}
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              {dict.donations.sponsorshipsDesc}
            </p>
          </div>
          <div>
            <h4 className="text-base font-bold text-[#4DA2DF] mb-1">
              {dict.donations.developmentProjects}
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              {dict.donations.developmentProjectsDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DonationsPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-[3%] md:px-[4%] py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#25445E] mb-8 md:mb-12 text-center">
          {dict.donations.title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <DonationColumn
            imageSrc="/images/donation/in-kind-donation.jpg"
            title={dict.donations.inKind}
            description={dict.donations.inKindDesc}
            centerTitle={dict.donations.donationCenter}
            centerInfo={dict.donations.inKindCenterInfo}
            contactTitle={dict.donations.contactInfo}
            contactInfo={dict.donations.inKindContactInfo}
            email={SITE_CONFIG.email}
            locale={locale}
          />
          <MonetaryDonationColumn locale={locale} dict={dict} />
          <TimeDonationColumn locale={locale} dict={dict} />
        </div>
      </div>
    </div>
  );
}
