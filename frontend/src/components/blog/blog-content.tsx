import Image from 'next/image';

export type BlogBlock = {
  type: 'paragraph' | 'image' | 'video';
  content?: { type?: string; text?: string }[];
  url?: string;
  caption?: string;
};

export function BlogContent({ blocks }: { blocks: BlogBlock[] }) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  return (
    <div className="prose prose-invert mt-12 max-w-none space-y-8">
      {blocks.map((block, i) => {
        if (block.type === 'image' && block.url) {
          return (
            <figure key={i} className="overflow-hidden rounded-2xl">
              <div className="relative aspect-video w-full">
                <Image
                  src={block.url}
                  alt={block.caption || 'Blog image'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
              {block.caption && (
                <figcaption className="mt-3 text-center text-sm text-surface-gray">{block.caption}</figcaption>
              )}
            </figure>
          );
        }

        if (block.type === 'video' && block.url) {
          const isYoutube = block.url.includes('youtube.com') || block.url.includes('youtu.be');
          const isDirect = block.url.match(/\.(mp4|webm|ogg)(\?|$)/i);

          if (isYoutube) {
            const videoId = block.url.includes('youtu.be')
              ? block.url.split('/').pop()
              : new URL(block.url).searchParams.get('v');
            return (
              <figure key={i} className="overflow-hidden rounded-2xl">
                <div className="relative aspect-video w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={block.caption || 'Blog video'}
                    className="h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                {block.caption && (
                  <figcaption className="mt-3 text-center text-sm text-surface-gray">{block.caption}</figcaption>
                )}
              </figure>
            );
          }

          return (
            <figure key={i} className="overflow-hidden rounded-2xl">
              <video src={block.url} controls className="w-full rounded-2xl" playsInline>
                <track kind="captions" />
              </video>
              {block.caption && (
                <figcaption className="mt-3 text-center text-sm text-surface-gray">{block.caption}</figcaption>
              )}
              {!isDirect && (
                <p className="mt-2 text-center text-xs text-surface-gray">
                  <a href={block.url} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                    Open video
                  </a>
                </p>
              )}
            </figure>
          );
        }

        const text = block.content?.map((c) => c.text).filter(Boolean).join('') || '';
        if (!text) return null;

        return (
          <p key={i} className="text-base leading-relaxed text-surface-gray sm:text-lg">
            {text}
          </p>
        );
      })}
    </div>
  );
}