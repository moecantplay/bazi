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
          className={`h-2 rounded-full transition-all duration-150 ${
            index === current ? "w-6 bg-ink" : "w-2 bg-hairline"
          }`}
        />
      ))}
    </div>
  );
}
