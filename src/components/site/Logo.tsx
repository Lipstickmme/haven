export function Logo() {
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
        <path d="M1 29V6l6-4v27" fill="currentColor" />
        <path d="M9 29V4l7 4v21" fill="currentColor" opacity="0.65" />
        <path d="M18 29V10l7 5v14" fill="currentColor" opacity="0.35" />
      </svg>
      <span className="leading-none">
        <span className="block text-[0.8rem] font-semibold tracking-[0.14em]">MEASTRO</span>
        <span className="eyebrow mt-1 block opacity-70">Architecture</span>
      </span>
    </span>
  );
}
