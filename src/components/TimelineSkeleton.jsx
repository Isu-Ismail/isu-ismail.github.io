const Block = ({ className = '' }) => <div className={`bg-bg-tertiary rounded ${className}`} />;

export const TimelineSkeleton = ({ rows = 2 }) => (
  <div className="animate-pulse">
    <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
      <Block className="h-9 w-48 mx-auto" />
      <Block className="h-4 w-64 mx-auto" />
    </div>
    <div className="relative max-w-2xl mx-auto pl-8 border-l border-border-color space-y-12">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Block className="h-4 w-28 rounded-full" />
          <Block className="h-6 w-64" />
          <Block className="h-4 w-48" />
          <Block className="h-3 w-full" />
        </div>
      ))}
    </div>
  </div>
);
