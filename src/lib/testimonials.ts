/**
 * Client testimonials for the floating card.
 *
 * Portraits are optional and drop in the same way project photography does:
 * put a file at src/assets/testimonials/<id>.webp and it is picked up with no
 * code change. Until one exists the card shows the client's initials, which is
 * honest, rather than a stock face standing in for a real person.
 */
const portraits = import.meta.glob("../assets/testimonials/*.{webp,jpg,jpeg,png}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const byId = new Map<string, string>();
for (const [path, url] of Object.entries(portraits)) {
  const match = /\/testimonials\/([^/.]+)\./.exec(path);
  if (match?.[1]) byId.set(match[1], url);
}

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "harriet-vance",
    quote:
      "They spent two days on site before drawing anything. Everything that followed made sense because of it.",
    name: "Harriet Vance",
    role: "Kiln Yard LLP",
  },
  {
    id: "tomas-lindqvist",
    quote:
      "We asked for offices and got a building the town actually uses. They argued us out of our own brief, politely.",
    name: "Tomas Lindqvist",
    role: "Halden Kommune",
  },
  {
    id: "claire-bennett",
    quote:
      "The detailing held up on site. Nine weeks of frame went in over a summer holiday with no surprises.",
    name: "Claire Bennett",
    role: "Glasgow City Council",
  },
  {
    id: "michael-brandt",
    quote:
      "Our collection has never had light this even. They modelled it against our own conservation limits first.",
    name: "Michael Brandt",
    role: "Museum Rotterdam",
  },
  {
    id: "elena-costa",
    quote:
      "Thirty-one rooms and no guest looks into another. That took setting out nobody else offered to do.",
    name: "Elena Costa",
    role: "Travertine Group",
  },
  {
    id: "margaret-iles",
    quote:
      "They put the reading room in the middle with no view out, and told us it would be the busiest space. It is.",
    name: "Margaret Iles",
    role: "Norfolk Libraries",
  },
  {
    id: "daniel-sato",
    quote:
      "Two listed silos we could not touch, and they found a building in the gap between them.",
    name: "Daniel Sato",
    role: "Granary Quarter Ltd",
  },
  {
    id: "hiroshi-tan",
    quote:
      "The geotechnical report wrote half the plan and they never once pretended otherwise. Straight answers throughout.",
    name: "Hiroshi Tan",
    role: "Quarry Edge Ltd",
  },
];

export function portraitFor(id: string): string | null {
  return byId.get(id) ?? null;
}

export function initialsFor(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}
