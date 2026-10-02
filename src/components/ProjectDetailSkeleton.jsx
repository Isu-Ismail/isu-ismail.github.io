const Block = ({ className = '' }) => <div className={`bg-bg-tertiary rounded ${className}`} />;

// Mirrors ProjectDetail.jsx's actual layout (header, hero, metrics grid,
// carousel, narratives + sidebar) so there's no layout shift when the real
// content swaps in.
export const ProjectDetailSkeleton = () => (
  <div className="max-w-6xl mx-auto px-6 md:px-16 py-24 text-left w-full animate-pulse">
    <div className="flex justify-between items-center mb-12 pb-4 border-b border-border-color">
      <Block className="h-5 w-40" />
      <Block className="h-9 w-28 rounded-full" />
    </div>

    <header className="mb-12 space-y-4">
      <div className="flex justify-between items-start flex-wrap gap-6">
        <div className="space-y-3">
          <div className="flex gap-2">
            <Block className="h-5 w-24 rounded" />
            <Block className="h-5 w-32 rounded" />
          </div>
          <Block className="h-10 w-80" />
        </div>
      </div>
      <Block className="h-4 w-full max-w-2xl" />
      <Block className="h-4 w-3/4 max-w-xl" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Block key={i} className="h-6 w-20 rounded-full" />
        ))}
      </div>
    </header>

    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-bg-secondary border border-border-color p-6 rounded-2xl text-center space-y-2">
          <Block className="h-8 w-16 mx-auto" />
          <Block className="h-3 w-20 mx-auto" />
        </div>
      ))}
    </section>

    <Block className="h-[300px] md:h-[480px] rounded-3xl mb-16" />

    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-16 items-start">
      <div className="space-y-12">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Block className="h-7 w-56" />
            <Block className="h-4 w-full" />
            <Block className="h-4 w-full" />
            <Block className="h-4 w-5/6" />
          </div>
        ))}
      </div>

      <div className="space-y-8">
        <div className="bg-bg-secondary border border-border-color rounded-2xl p-8 space-y-4">
          <Block className="h-5 w-48 mx-auto" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Block key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
        <div className="bg-bg-secondary border border-border-color rounded-2xl p-8 space-y-3">
          <Block className="h-5 w-48" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Block key={i} className="h-5 w-full" />
          ))}
        </div>
      </div>
    </div>
  </div>
);
