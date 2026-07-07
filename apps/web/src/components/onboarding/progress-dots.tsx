/** Progress indicator for onboarding: one dot per gathering step, current filled. */

interface Props {
  total: number;
  current: number;
}

export function ProgressDots({ total, current }: Props) {
  return (
    <div className="flex items-center gap-2" role="presentation">
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={`h-1.5 rounded-full transition-all duration-150 ${
            index === current ? "w-5 bg-ink" : "w-1.5 bg-hairline"
          }`}
        />
      ))}
    </div>
  );
}
