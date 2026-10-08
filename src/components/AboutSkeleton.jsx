const Block = ({ className = '' }) => <div className={`bg-bg-tertiary rounded ${className}`} />;

export const AboutSkeleton = () => (
  <div className="max-w-6xl mx-auto px-6 md:px-16 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-16 items-center w-full animate-pulse">
    <Block className="aspect-[4/5] rounded-3xl w-full" />
    <div className="text-left space-y-6">
      <Block className="h-9 w-40" />
      <div className="space-y-2">
        <Block className="h-4 w-full" />
        <Block className="h-4 w-full" />
        <Block className="h-4 w-5/6" />
        <Block className="h-4 w-3/4" />
      </div>
      <div className="grid grid-cols-2 gap-6 mt-4">
        <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 text-center space-y-2">
          <Block className="h-8 w-16 mx-auto" />
          <Block className="h-3 w-20 mx-auto" />
        </div>
        <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 text-center space-y-2">
          <Block className="h-8 w-16 mx-auto" />
          <Block className="h-3 w-20 mx-auto" />
        </div>
      </div>
    </div>
  </div>
);
