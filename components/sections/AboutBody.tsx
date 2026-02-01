import type { Dictionary } from '@/lib/i18n/dictionary';

interface AboutBodyProps {
  dict: Dictionary;
  youtubeUrl: string;
}

function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  try {
    if (url.includes('youtu.be/')) return url.split('youtu.be/')[1]?.split('?')[0] ?? null;
    if (url.includes('youtube.com/watch')) return new URLSearchParams(url.split('?')[1] ?? '').get('v');
    return null;
  } catch {
    return null;
  }
}

export default function AboutBody({ dict, youtubeUrl }: AboutBodyProps) {
  const videoId = getYouTubeVideoId(youtubeUrl);

  return (
    <div className="container mx-auto px-[3%] md:px-[4%] py-8 md:py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
        {/* Description */}
        <div>
          <p className="text-[#25445E] text-base md:text-lg leading-relaxed">
            {dict.about.description}
          </p>
        </div>
        {/* Video */}
        <div className="w-full aspect-video bg-gray-100 rounded-xl overflow-hidden min-h-[320px] md:min-h-[360px]">
          {videoId ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              {dict.about.loadingVideo}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
