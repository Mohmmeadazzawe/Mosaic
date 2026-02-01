import type { Dictionary } from '@/lib/i18n/dictionary';

interface AboutBannerProps {
  dict: Dictionary;
}

export default function AboutBanner({ dict }: AboutBannerProps) {
  return (
    <section className="w-full bg-gradient-to-r from-[#25445E] to-[#4DA2DF] py-12 md:py-16">
      <div className="container mx-auto px-[3%] md:px-[4%]">
        <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
          {dict.about.title}
        </h1>
      </div>
    </section>
  );
}
