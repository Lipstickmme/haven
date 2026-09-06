export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const stroke = tone === "dark" ? "currentColor" : "currentColor";
  return (
    <span className="flex items-center gap-3">
      <svg
        width="26"
        height="30"
        viewBox="0 0 26 30"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <path d="M1 29V6l6-4v27" fill={stroke} />
        <path d="M9 29V4l7 4v21" fill={stroke} opacity="0.65" />
        <path d="M18 29V10l7 5v14" fill={stroke} opacity="0.35" />
      </svg>
      <span className="leading-none">
        <span className="block text-[0.8rem] font-semibold tracking-[0.14em]">BLUEPRINT HAVEN</span>
        <span className="mt-1 block eyebrow opacity-70">Architects</span>
      </span>
    </span>
  );
}
