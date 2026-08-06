/** Onboarding step 3: birth city. Timezone (not exact coordinates) is what matters. */

import { CitySearch } from "@/components/city-search";
import type { StoredCity } from "@/lib/store-types";
import { StepFrame } from "./step-frame";

interface Props {
  city: StoredCity | null;
  onSelect: (city: StoredCity) => void;
  onNext: () => void;
}

export function CityStep({ city, onSelect, onNext }: Props) {
  return (
    <StepFrame
      title="Where were you born?"
      subtitle="Pick the city — its timezone sets your local time."
      primaryLabel="Next"
      onPrimary={onNext}
      primaryDisabled={city === null}
    >
      <CitySearch selected={city} onSelect={onSelect} />
    </StepFrame>
  );
}
