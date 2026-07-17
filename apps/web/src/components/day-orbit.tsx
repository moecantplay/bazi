/**
 * The Today hero's line-art centerpiece: the day stem at the center of a
 * fine orbit ring, the branch riding the ring in a scalloped paper badge,
 * and the two elements as node dots. Pure line art in the current ink —
 * decorative strokes and nodes are aria-hidden; the glyphs themselves are
 * the day pillar, so the group carries a label naming it.
 *
 * With Han characters off, the glyphs swap for their glosses like all copy
 * (the seal is the only artwork exempt from the toggle).
 */

interface Props {
  stemCharacter: string;
  branchCharacter: string;
  stemGloss: string;
  branchGloss: string;
  stemElement: string;
  branchElement: string;
  showHanCharacters: boolean;
}

/** M3-style 12-scallop path in a 200×200 box, used as the branch badge. */
const SCALLOP =
  "M100 4 C110 4 118 12 127 15 C136 18 147 15 155 21 C163 27 164 38 170 46 " +
  "C176 54 187 58 190 68 C193 78 187 87 187 97 C187 107 194 116 191 126 " +
  "C188 136 177 140 171 148 C165 156 165 167 157 173 C149 179 138 176 129 179 " +
  "C120 182 112 191 102 191 C92 191 84 183 75 180 C66 177 55 180 47 174 " +
  "C39 168 38 157 32 149 C26 141 15 137 12 127 C9 117 15 108 15 98 " +
  "C15 88 8 79 11 69 C14 59 25 55 31 47 C37 39 37 28 45 22 " +
  "C53 16 64 19 73 16 C82 13 90 4 100 4 Z";

export function DayOrbit({
  stemCharacter,
  branchCharacter,
  stemGloss,
  branchGloss,
  stemElement,
  branchElement,
  showHanCharacters
}: Props) {
  const [stemWordA, stemWordB] = stemGloss.split(" ");

  return (
    <svg
      className="mx-auto block"
      width="230"
      height="230"
      viewBox="0 0 230 230"
      role="img"
      aria-label={`Day pillar: ${stemGloss} over ${branchGloss}`}
    >
      <g aria-hidden="true" fill="none" stroke="var(--ink)" strokeOpacity="0.34" strokeWidth="1">
        <circle cx="115" cy="115" r="106" />
        <circle cx="115" cy="115" r="72" strokeDasharray="1 5" />
      </g>
      <g aria-hidden="true" stroke="var(--ink)" strokeOpacity="0.3" strokeWidth="1">
        <line x1="115" y1="7" x2="115" y2="14" />
        <line x1="115" y1="216" x2="115" y2="223" />
        <line x1="7" y1="115" x2="14" y2="115" />
        <line x1="216" y1="115" x2="223" y2="115" />
      </g>

      {showHanCharacters ? (
        <text
          x="115"
          y="134"
          textAnchor="middle"
          fontSize="64"
          fill="var(--ink)"
          className="font-han"
        >
          {stemCharacter}
        </text>
      ) : (
        <text x="115" y="108" textAnchor="middle" fontSize="21" fontWeight="600" fill="var(--ink)">
          {stemWordA}
          <tspan x="115" dy="26">
            {stemWordB}
          </tspan>
        </text>
      )}

      <g transform="translate(190, 41) scale(0.31) translate(-100, -100)">
        <path aria-hidden="true" fill="var(--paper)" d={SCALLOP} />
        {showHanCharacters ? (
          <text
            x="100"
            y="130"
            textAnchor="middle"
            fontSize="86"
            fill="var(--ink)"
            className="font-han"
          >
            {branchCharacter}
          </text>
        ) : (
          <text x="100" y="112" textAnchor="middle" fontSize="34" fontWeight="600" fill="var(--ink)">
            {branchGloss}
          </text>
        )}
      </g>

      <g aria-hidden="true">
        <circle cx="40" cy="189" r="4.5" fill={`var(--element-${stemElement})`} />
        <circle cx="24" cy="76" r="4.5" fill={`var(--element-${branchElement})`} />
      </g>
    </svg>
  );
}
