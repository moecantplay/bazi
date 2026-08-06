/**
 * The shareable chart card: seal, pillar line, and day-master archetype drawn
 * onto a 1080x1350 canvas in the current theme's colors, then handed to the
 * Web Share sheet — or downloaded where file sharing isn't supported. All
 * local; nothing leaves the device unless the user shares the result.
 *
 * Ported from apps/web/src/lib/share-card.ts as-is (confirmed in Phase 1 and
 * Phase 5 not to be cleanly separable from browser Canvas APIs, so it stays
 * in the app layer rather than presentation) — only the font custom
 * properties changed, to Trail's Bricolage/Figtree pair.
 */

interface ShareCardInput {
  /** The on-screen seal SVG; cloned, its CSS variables resolved, and redrawn. */
  sealSvg: SVGSVGElement;
  /** The gloss pillar line, e.g. "yang wood · horse · ...". */
  pillarLine: string;
  /** The day-master archetype sentence. */
  archetype: string;
}

export type ShareCardResult = "shared" | "downloaded" | "failed";

const WIDTH = 1080;
const HEIGHT = 1350;
const SEAL_SIZE = 380;
const FILENAME = "daymaster-chart.png";

function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** The seal SVG as a standalone image, its var() colors made literal. */
async function sealAsImage(sealSvg: SVGSVGElement): Promise<HTMLImageElement> {
  let markup = sealSvg.outerHTML;
  for (const name of ["--cinnabar", "--seal-paper", "--paper"]) {
    markup = markup.replaceAll(`var(${name})`, cssVar(name));
  }
  // React omits xmlns on inline SVG; a standalone SVG document requires it.
  if (!markup.includes("xmlns=")) {
    markup = markup.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ');
  }
  const blob = new Blob([markup], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  try {
    return await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("seal image failed to decode"));
      image.src = url;
    });
  } finally {
    // Revoke after decode settles; the data is already in the image.
    setTimeout(() => URL.revokeObjectURL(url), 1_000);
  }
}

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current.length > 0 ? `${current} ${word}` : word;
    if (context.measureText(candidate).width > maxWidth && current.length > 0) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current.length > 0) {
    lines.push(current);
  }
  return lines;
}

async function drawCard({ sealSvg, pillarLine, archetype }: ShareCardInput): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext("2d");
  if (context === null) {
    throw new Error("canvas 2d context unavailable");
  }

  const paper = cssVar("--paper") || "#f5f6f4";
  const ink = cssVar("--ink") || "#20242b";
  const inkSoft = cssVar("--ink-soft") || "#5c636e";
  const displayFont = cssVar("--font-bricolage") || "serif";
  const sansFont = cssVar("--font-figtree") || "sans-serif";

  context.fillStyle = paper;
  context.fillRect(0, 0, WIDTH, HEIGHT);

  const seal = await sealAsImage(sealSvg);
  context.drawImage(seal, (WIDTH - SEAL_SIZE) / 2, 140, SEAL_SIZE, SEAL_SIZE);

  context.textAlign = "center";
  context.fillStyle = ink;
  context.font = `500 56px ${sansFont}`;
  context.fillText(pillarLine, WIDTH / 2, 660);

  // Step the archetype's type size down until the block clears the footer.
  const maxTextWidth = WIDTH - 220;
  const blockTop = 790;
  const blockBottom = HEIGHT - 190;
  let fontSize = 62;
  let lines: string[] = [];
  let lineHeight = 0;
  for (; fontSize >= 38; fontSize -= 6) {
    context.font = `800 ${fontSize}px ${displayFont}`;
    lines = wrapText(context, archetype, maxTextWidth);
    lineHeight = Math.round(fontSize * 1.38);
    if (blockTop + lines.length * lineHeight <= blockBottom) {
      break;
    }
  }
  lines.forEach((line, index) => {
    context.fillText(line, WIDTH / 2, blockTop + index * lineHeight);
  });

  context.fillStyle = inkSoft;
  context.font = `400 34px ${sansFont}`;
  context.fillText("Daymaster — a daily reading from your four pillars", WIDTH / 2, HEIGHT - 100);

  return await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("canvas export failed"));
      }
    }, "image/png");
  });
}

/** Render the card and share it, falling back to a straight download. */
export async function shareChartCard(input: ShareCardInput): Promise<ShareCardResult> {
  let blob: Blob;
  try {
    blob = await drawCard(input);
  } catch {
    return "failed";
  }

  const file = new File([blob], FILENAME, { type: "image/png" });
  if (typeof navigator.canShare === "function" && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file] });
      return "shared";
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        // The user dismissed the sheet — that's a completed interaction.
        return "shared";
      }
      // share() unavailable in practice (headless, desktop quirks): download.
    }
  }

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = FILENAME;
  anchor.click();
  URL.revokeObjectURL(url);
  return "downloaded";
}
