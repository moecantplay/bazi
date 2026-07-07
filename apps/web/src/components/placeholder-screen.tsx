/**
 * Calm placeholder body for screens whose content lands in a later milestone.
 * Renders one quiet line and never any fabricated chart data.
 */

interface Props {
  note: string;
}

export function PlaceholderScreen({ note }: Props) {
  return (
    <div className="flex flex-1 items-center justify-center py-16 text-center">
      <p className="max-w-xs text-[15px] leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}
