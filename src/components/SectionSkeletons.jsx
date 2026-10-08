const Block = ({ className = '' }) => <div className={`bg-bg-tertiary rounded ${className}`} />;

const Heading = () => (
  <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
    <Block className="h-9 w-48 mx-auto" />
    <Block className="h-4 w-64 mx-auto" />
  </div>
);

export const CertificatesSkeleton = () => (
  <div className="animate-pulse">
    <Heading />
    <div className="flex flex-wrap justify-center gap-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)] bg-bg-secondary border border-border-color rounded-2xl overflow-hidden p-7 space-y-3">
          <Block className="h-4 w-32" />
          <Block className="h-5 w-full" />
          <Block className="h-3 w-full" />
          <Block className="h-3 w-5/6" />
          <Block className="h-9 w-36 rounded-full mt-3" />
        </div>
      ))}
    </div>
  </div>
);

export const SkillsSkeleton = () => (
  <div className="animate-pulse">
    <Heading />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-bg-secondary border border-border-color rounded-lg p-7 space-y-4">
          <Block className="h-6 w-40" />
          <div className="flex flex-wrap gap-2.5">
            {Array.from({ length: 6 }).map((_, j) => (
              <Block key={j} className="h-7 w-20 rounded-md" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ContactSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start animate-pulse">
    <div className="space-y-6">
      <Block className="h-10 w-72" />
      <Block className="h-4 w-full" />
      <Block className="h-4 w-5/6" />
      <div className="flex flex-col gap-6 pt-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-5">
            <Block className="w-12 h-12 rounded-full flex-shrink-0" />
            <Block className="h-5 w-48" />
          </div>
        ))}
      </div>
    </div>
    <Block className="rounded-3xl h-[420px] w-full" />
  </div>
);
