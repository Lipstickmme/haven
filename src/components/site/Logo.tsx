import logoDark from "@/assets/brand/logo-dark.webp";
import logoLight from "@/assets/brand/logo-light.webp";
import markDark from "@/assets/brand/mark-dark.webp";
import markLight from "@/assets/brand/mark-light.webp";

/**
 * The studio lockup. Flat artwork rather than a tinted SVG, because the
 * monogram is a knockout — the building shows through the M — which
 * `currentColor` cannot express.
 *
 * `tone` names the surface, not the ink: "light" is the pale artwork for dark
 * grounds, "dark" the black artwork for pale ones.
 *
 * `variant` is "mark" in the header, where the stacked lockup would squeeze the
 * wordmark to a few illegible pixels, and "full" wherever there is height for it.
 */
export function Logo({
  tone = "dark",
  variant = "full",
}: {
  tone?: "light" | "dark";
  variant?: "mark" | "full";
}) {
  const mark = variant === "mark";
  const src = mark
    ? tone === "light"
      ? markLight
      : markDark
    : tone === "light"
      ? logoLight
      : logoDark;

  return (
    <img
      src={src}
      alt="Meastro Architecture"
      className={mark ? "h-10 w-auto md:h-11" : "h-20 w-auto md:h-24"}
    />
  );
}
