// ---------------------------------------------------------------------------
// Project record + imagery resolution.
//
// Photography lives at src/assets/projects/<slug>/<role>.<ext> and is picked up
// by the glob below, so dropping a file in wires it up with no code change.
// Roles: cover, before, after, part-1 … part-4.
//
// Anything not yet shot falls back to `legacy` (the studio's existing library)
// and then to a placeholder, so a half-shot project still renders.
// ---------------------------------------------------------------------------

import arc1 from "@/assets/arc1.webp";
import arc2 from "@/assets/arc2.webp";
import arc3 from "@/assets/arc3.webp";
import arc4 from "@/assets/arc4.webp";
import arc5 from "@/assets/arc5.webp";
import arc6 from "@/assets/arc6.webp";
import hero2 from "@/assets/hero-2.jpg";
import project2 from "@/assets/project-2.jpg";
import project5 from "@/assets/project-5.jpg";

const shot = import.meta.glob("../assets/projects/**/*.{webp,jpg,jpeg,png,avif}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

/** `../assets/projects/kiln-yard-housing/before.webp` → `kiln-yard-housing/before` */
const byKey = new Map<string, string>();
for (const [path, url] of Object.entries(shot)) {
  const match = /\/projects\/([^/]+)\/([^/.]+)\.[^.]+$/.exec(path);
  if (match?.[1] && match[2]) byKey.set(`${match[1]}/${match[2]}`, url);
}

export type ImageRole = "cover" | "before" | "after" | "part-1" | "part-2" | "part-3" | "part-4";

export function projectImage(slug: string, role: ImageRole): string | null {
  return byKey.get(`${slug}/${role}`) ?? null;
}

export type Category =
  "Residential" | "Cultural" | "Civic" | "Hospitality" | "Workplace" | "Retail" | "Education";

export type Discipline = "Architecture" | "Interior Design";

export const DISCIPLINES: Discipline[] = ["Architecture", "Interior Design"];

/**
 * Who the building is for, which is a coarser cut than `category`.
 *
 * Stored rather than derived from the category: most of the time a Residential
 * category does mean the residential sector, but not always — a developer's
 * show apartment is a flat that no one lives in, and it belongs with the
 * commercial work.
 */
export type Sector = "Residential" | "Commercial";

export const SECTORS: Sector[] = ["Residential", "Commercial"];

export type Part = { title: string; caption: string };

export type Project = {
  slug: string;
  title: string;
  category: Category;
  /** Which side of the practice led the commission. */
  discipline: Discipline;
  /** Who it is for: a household, or an organisation. */
  sector: Sector;
  place: string;
  year: string;
  status: "Built" | "On site" | "In design";
  size: string;
  client: string;
  /** One line, for the index card. */
  blurb: string;
  /** Standfirst on the profile page. */
  summary: string;
  body: string[];
  beforeCaption: string;
  afterCaption: string;
  parts: Part[];
  /** Existing studio photograph, used until a project-specific cover is shot. */
  legacy?: string;
};

const RAW_PROJECTS: Project[] = [
  {
    slug: "halden-civic-centre",
    title: "Halden Civic Centre",
    category: "Civic",
    discipline: "Architecture",
    sector: "Commercial",
    place: "Oslo",
    year: "2025",
    status: "Built",
    size: "4,200 m²",
    client: "Halden Kommune",
    blurb: "Council chamber, library and public hall under one board-marked concrete roof.",
    summary:
      "A single folded roof gathers three civic functions that had been scattered across four rented floors, and gives the town a room it can actually assemble in.",
    body: [
      "The brief asked for offices. The site, a sloping municipal car park with a view back over the fjord, asked for something more public, so the first drawing we made was of the roof, not the plan. A board-marked concrete plane steps down the slope in three bays, one for each function, and the space it leaves underneath is the hall.",
      "Everything structural is left visible. The shuttering boards were milled from spruce felled during site clearance and reused as formwork, so the grain in the soffit is the grain of the trees that stood here. Services run in an exposed tray below the slab rather than in a ceiling void, which kept the floor-to-floor low enough to stay under the ridge height the planners would accept.",
      "The council chamber sits at the highest bay, glazed on two sides. It was the one room the client wanted opaque; we argued for glass and lost, then won on appeal when the accessibility review pointed out that a visible chamber is a legible one.",
    ],
    beforeCaption:
      "The municipal car park during enabling works, with the site team setting out the first roof bay.",
    afterCaption:
      "The completed room under the roof, looking out across the fjord to the mountains.",
    parts: [
      {
        title: "Board-marked soffit",
        caption: "Spruce shuttering from the cleared site, left in the grain.",
      },
      {
        title: "Public hall",
        caption: "The room under the roof, between the library and the chamber.",
      },
      { title: "Council chamber", caption: "Glazed on two sides; the argument we nearly lost." },
      { title: "West stair", caption: "Cast in one pour against the retaining wall." },
    ],
    legacy: arc2,
  },
  {
    slug: "bastion-arts-foundation",
    title: "Bastion Arts Foundation",
    category: "Cultural",
    discipline: "Architecture",
    sector: "Commercial",
    place: "Antwerp",
    year: "2025",
    status: "Built",
    size: "2,750 m²",
    client: "Bastion Foundation",
    blurb: "A cantilevered gallery box held clear of the street on a rusticated plinth.",
    summary:
      "A private collection opened to the public, with the galleries lifted a full storey so the ground can stay a street rather than a lobby.",
    body: [
      "The foundation owned a corner plot with a nineteenth-century bastion wall running through it, listed, immovable, and exactly where a lobby would want to be. So the lobby went under the wall and the galleries went over it, cantilevered eight metres clear on two concrete blades.",
      "The upper box is deliberately blind. Works in the collection are light-sensitive and the trustees wanted no daylight at all; we gave them a coffered roof carrying north-facing slots that can be shuttered individually, which satisfied the conservator and kept the rooms from feeling like a bunker.",
      "The plinth is new masonry laid in the same coursing as the bastion, but set back forty millimetres so the join reads as a shadow rather than a pretence.",
    ],
    beforeCaption:
      "The bastion wall exposed after demolition, with the conservation architect recording coursing before works began.",
    afterCaption:
      "The gallery box cantilevered clear of the plinth, lit from within after closing.",
    parts: [
      { title: "Bastion join", caption: "New coursing set back forty millimetres from the old." },
      {
        title: "Cantilever blades",
        caption: "Two concrete blades carry the eight-metre overhang.",
      },
      {
        title: "Coffered roof",
        caption: "North slots, individually shuttered for the conservator.",
      },
      { title: "Under-plinth entry", caption: "The lobby that had to go beneath a listed wall." },
    ],
    legacy: arc4,
  },
  {
    slug: "lantern-house",
    title: "Lantern House",
    category: "Residential",
    discipline: "Architecture",
    sector: "Residential",
    place: "Connecticut",
    year: "2024",
    status: "Built",
    size: "410 m²",
    client: "Private",
    blurb: "Two storeys of glass and render that read as a lantern once the light drops.",
    summary:
      "A replacement dwelling on the footprint of a 1960s ranch house, organised around the one thing the old house ignored: the tree line to the west.",
    body: [
      "The existing house sat square to the road and turned its back on four acres of maple. We kept the footprint, planning was far easier that way, and rotated everything inside it fifteen degrees, so every principal room now looks down the slope instead of across it.",
      "The upper floor is a continuous glazed band set between two render planes. At night the reveal disappears and the house reads as a single lit volume, which is where the name came from and which the neighbours, we are told, have mixed feelings about.",
      "Heating is a ground loop under the old driveway. Reusing that excavation paid for roughly half the borehole cost.",
    ],
    beforeCaption:
      "The 1960s ranch house before strip-out, with the project architect and structural engineer checking the retained slab.",
    afterCaption: "The completed house from the maple line, lit through the upper glazed band.",
    parts: [
      { title: "Stair hall", caption: "The one double-height room, top-lit." },
      { title: "Glazed band", caption: "A continuous reveal between two render planes." },
      { title: "Rotated plan", caption: "Fifteen degrees off the old grid, toward the slope." },
      { title: "Entrance court", caption: "Formed by the retained footprint's north edge." },
    ],
    legacy: arc6,
  },
  {
    slug: "carriage-lane-house",
    title: "Carriage Lane House",
    category: "Residential",
    discipline: "Architecture",
    sector: "Residential",
    place: "Rochester",
    year: "2023",
    status: "Built",
    size: "220 m²",
    client: "Private",
    blurb: "Dark brick above, open carport below, on a tight suburban corner plot.",
    summary:
      "A corner infill on a plot two neighbours had already been refused planning on, won by putting the mass where the shadows were least contested.",
    body: [
      "The plot is 9.5 metres at its narrowest. Two previous applications failed on overlooking, so the first move was a shadow study rather than a sketch: the upper volume sits hard against the north boundary, where it casts onto the lane, and the ground floor opens south into a carport that doubles as the entrance court.",
      "Brick is a dark iron-spot laid in stack bond above and stretcher below, a distinction you only notice at about three metres. The change gives the upper volume its weight without a change of material.",
      "Budget was fixed and tight. The stair is a single folded steel plate, made by a fabricator two streets away, and it is the only bespoke item in the house.",
    ],
    beforeCaption:
      "The vacant corner plot with the site architect and contractor setting out the north boundary line.",
    afterCaption: "The finished house from the lane, carport open beneath the brick volume.",
    parts: [
      { title: "Folded steel stair", caption: "One plate, one fabricator, two streets away." },
      {
        title: "Brick face",
        caption: "The upper volume, weighted by bond rather than colour.",
      },
      {
        title: "Stair and wall",
        caption: "The folded plate reading against the brick it is bolted to.",
      },
      { title: "North boundary", caption: "Where the mass had to go for the shadows to work." },
    ],
    legacy: arc5,
  },
  {
    slug: "cliff-terrace-residence",
    title: "Cliff Terrace Residence",
    category: "Residential",
    discipline: "Architecture",
    sector: "Residential",
    place: "Amalfi",
    year: "2023",
    status: "Built",
    size: "340 m²",
    client: "Private",
    blurb: "Four stepped terraces that follow the rock rather than cutting into it.",
    summary:
      "A house that loses eleven metres of height across its plan, built without a single retaining wall over two metres.",
    body: [
      "Everything here was decided by what could be carried down the path. There is no vehicle access below the road, so the structure is a lightweight steel frame on mini-piles, assembled from pieces two people can lift, and the terraces are the pile caps.",
      "Following the rock rather than benching it meant four floor levels in a house with only three bedrooms. That sounds awkward and occasionally is, but it kept the excavation to eighty cubic metres on a site where the geotechnical report advised against anything approaching a cut.",
      "The seaward glazing is fixed. Ventilation comes from louvred flanks on the landward side, which also take the winter storms.",
    ],
    beforeCaption:
      "The terraces under construction on the cliff, with the engineer and site foreman checking the pile positions.",
    afterCaption: "One of the four terraces complete, the sea beyond and the cut rock behind.",
    parts: [
      { title: "Mini-pile terraces", caption: "Pile caps doing double duty as floor plates." },
      { title: "Landward louvres", caption: "All ventilation and all the storm loading." },
      { title: "Carried frame", caption: "Steel in two-person lifts, down the path." },
      { title: "Seaward glazing", caption: "Fixed, because nothing openable would survive." },
    ],
    legacy: project5,
  },
  {
    slug: "fold-museum-annex",
    title: "Fold Museum Annex",
    category: "Cultural",
    discipline: "Architecture",
    sector: "Commercial",
    place: "Rotterdam",
    year: "2024",
    status: "Built",
    size: "1,900 m²",
    client: "Museum Rotterdam",
    blurb: "A folded roof plane that brings even daylight into the print collection below.",
    summary:
      "An annex for works on paper, where the entire architectural problem was delivering north light without delivering ultraviolet.",
    body: [
      "Prints tolerate roughly fifty lux. That is not much, and it has to be flat, a bright patch crossing a sheet over a season does measurable damage. The roof folds accordingly: eleven north-facing facets, each one sized from a daylight model run against the collection's own conservation limits.",
      "Below the folds the plan is almost boringly simple: a single top-lit hall with the study rooms and stores banked along the blind south wall, where the plant also sits.",
      "The folds are precast, which was a cost decision that became an aesthetic one. The joints between units are left open and unfilled, and they do the work a shadow gap usually has to be invented for.",
    ],
    beforeCaption:
      "The folded roof under construction on the wharf, with the conservation team and contractor reviewing the first bays.",
    afterCaption: "The completed folded roof over the print hall, seen from the adjacent canal.",
    parts: [
      { title: "Eleven folds", caption: "Each facet sized from the conservation daylight model." },
      {
        title: "Folds going up",
        caption: "The eleven facets cast and struck, before the glazing went in.",
      },
      { title: "Print hall", caption: "One top-lit room at fifty lux, flat across the year." },
      { title: "Open joints", caption: "Precast tolerance turned into a shadow gap." },
    ],
    legacy: project2,
  },
  {
    slug: "solstice-penthouse",
    title: "Solstice Penthouse",
    category: "Residential",
    discipline: "Interior Design",
    sector: "Residential",
    place: "New York",
    year: "2025",
    status: "Built",
    size: "310 m²",
    client: "Private",
    blurb: "A double-height apartment reorganised around a single north-facing window wall.",
    summary:
      "A top-floor conversion where removing one floor plate did more than any amount of replanning could have.",
    body: [
      "The apartment came to us as eleven rooms with a corridor. The only thing worth keeping was the north window wall, so we took out a third of the upper floor plate and let the living space run the full height against that glass.",
      "Structurally this was less dramatic than it sounds, the removed area was never load-bearing in the primary direction, but it required a transfer beam that had to arrive up the goods lift in three pieces and be welded in place over a weekend.",
      "The remaining upper level is a single long gallery. It holds the study and the guest room and, mostly, it holds the view.",
    ],
    beforeCaption:
      "The original eleven-room plan mid strip-out, with the architect and structural engineer marking the slab opening.",
    afterCaption: "The double-height living space against the retained north window wall.",
    parts: [
      { title: "Slab opening", caption: "A third of the upper plate, removed." },
      { title: "North glazing", caption: "The one element worth keeping." },
      { title: "Transfer beam", caption: "Three pieces, one goods lift, one weekend." },
      { title: "Upper gallery", caption: "Study, guest room, and the view." },
    ],
    legacy: arc1,
  },
  {
    slug: "travertine-house-hotel",
    title: "Travertine House Hotel",
    category: "Hospitality",
    discipline: "Architecture",
    sector: "Commercial",
    place: "Lisbon",
    year: "2024",
    status: "Built",
    size: "3,100 m²",
    client: "Travertine Group",
    blurb: "Thirty-one rooms cut into a hillside, each with its own shaded loggia.",
    summary:
      "A hotel where no room looks into another, achieved by turning every loggia four degrees off the one below.",
    body: [
      "Stacking rooms on a slope usually means everyone looks onto their neighbour's terrace. The plan rotates each floor slightly against the one beneath, so the loggias fan out and no sightline repeats. It costs a little structure and a lot of setting-out, and it is the reason the hotel works.",
      "Travertine is local and was specified partly because it weathers. The client wanted a stone that would look the same in ten years; we persuaded them toward one that would not.",
      "Back of house is buried in the hill behind, which keeps service circulation entirely out of the guest experience and, incidentally, out of the summer heat.",
    ],
    beforeCaption:
      "The terraces under construction on the hillside, with the site architects checking the setting out of the first loggia.",
    afterCaption: "The completed loggias fanning across the hillside in late afternoon light.",
    parts: [
      { title: "Fanned loggias", caption: "Four degrees per floor, so no sightline repeats." },
      {
        title: "Terracing the slope",
        caption: "Cutting the benches each loggia sits on, from the access road down.",
      },
      { title: "Travertine skin", caption: "Chosen because it weathers, not despite it." },
      { title: "Arrival court", caption: "The only place the hotel presents a front." },
    ],
    legacy: arc3,
  },
  {
    slug: "ironworks-studio",
    title: "Ironworks Studio",
    category: "Workplace",
    discipline: "Interior Design",
    sector: "Commercial",
    place: "Rochester",
    year: "2023",
    status: "Built",
    size: "1,450 m²",
    client: "Ironworks Collective",
    blurb: "A former foundry reworked into forty studio desks and a shared making floor.",
    summary:
      "An adaptive reuse where the cheapest possible intervention, cleaning and glazing, turned out to be the right one.",
    body: [
      "The foundry had a steel frame in better condition than the survey suggested and a roof that was beyond saving. We replaced the roof, glazed the north slope, cleaned everything else, and stopped.",
      "The desks sit on a raised deck that floats clear of the original floor, because the original floor is oil-soaked and could not be made good within the budget. Leaving it visible under the deck was a decision the collective made, not us, and it is better than what we proposed.",
      "The making floor stays as it was: full height, full width, no partitions, one crane rail.",
    ],
    beforeCaption:
      "The disused foundry under scaffolding, with the project team surveying the retained shed from the yard.",
    afterCaption: "The finished shed from the same corner of the yard, north slope reglazed.",
    parts: [
      { title: "North glazing", caption: "The one slope worth opening up." },
      { title: "Crane rail", caption: "Kept, and still used." },
      { title: "Retained frame", caption: "Better than the survey suggested." },
      { title: "Floating deck", caption: "Desks above an oil-soaked floor left on show." },
    ],
    legacy: hero2,
  },
  {
    slug: "marble-line-flagship",
    title: "Marble Line Flagship",
    category: "Retail",
    discipline: "Interior Design",
    sector: "Commercial",
    place: "Milan",
    year: "2022",
    status: "Built",
    size: "520 m²",
    client: "Marble Line",
    blurb: "A single slab of Carrara drawn through the shop as counter, stair and sill.",
    summary:
      "One continuous stone element does every job the shopfitting would normally be asked to do.",
    body: [
      "The brief wanted flexibility, which usually produces a room full of movable nothing. Instead we fixed one thing absolutely, a Carrara element that begins as the window sill, becomes the counter, turns and becomes the stair, and left everything else loose.",
      "It was cut from a single block so the veining runs continuously through all three functions. This is the sort of decision that is either the whole project or an expensive indulgence, and we spent a long time being unsure which.",
      "Lighting is entirely indirect, washing the vaulted ceiling of the existing building. No fitting is visible anywhere in the shop.",
    ],
    beforeCaption:
      "The stripped retail unit with the vaults exposed, and the architect setting out the stone run in chalk.",
    afterCaption: "The finished Carrara element running from sill to counter to stair.",
    parts: [
      { title: "Continuous veining", caption: "One block, cut so the grain runs through." },
      { title: "The turn", caption: "Where counter becomes stair." },
      { title: "Washed vaults", caption: "Indirect light only; no visible fitting." },
      {
        title: "Fixing the slab",
        caption: "The counter worked in place, before the shop was fitted out around it.",
      },
    ],
  },
  // --- newly added ----------------------------------------------------------
  {
    slug: "kiln-yard-housing",
    title: "Kiln Yard Housing",
    category: "Residential",
    discipline: "Architecture",
    sector: "Residential",
    place: "Manchester",
    year: "2026",
    status: "On site",
    size: "6,800 m²",
    client: "Kiln Yard LLP",
    blurb: "Sixty-two homes around a brick yard on the footprint of a demolished pottery.",
    summary:
      "A perimeter block that keeps the pottery's kiln and builds the housing around it rather than over it.",
    body: [
      "The kiln is the only listed thing on the site and for two years it was treated as an obstruction. Our first submission made it the centre of the courtyard instead, which cost eleven units and won the planning committee unanimously.",
      "Homes are dual aspect without exception, a standard we set at the outset and the only one we refused to trade during value engineering. It drove the block depth, which drove the yard dimension, which is why the courtyard is as generous as it is.",
      "Brick is reclaimed from the demolished sheds where it could be, matched new where it could not. The two are not blended; the new work is laid in clearly defined panels.",
    ],
    beforeCaption:
      "The perimeter block going up around the retained kiln, with the architects and the conservation officer checking the setting out.",
    afterCaption:
      "The completed perimeter block enclosing the retained kiln, from the yard entrance.",
    parts: [
      { title: "Retained kiln", caption: "Eleven units traded for the centre of the courtyard." },
      { title: "Yard threshold", caption: "Where the public route crosses into the block." },
      {
        title: "The block going up",
        caption: "The perimeter rising around the kiln, which stayed standing throughout.",
      },
      { title: "Dual aspect", caption: "Every home, without exception, including the corners." },
    ],
  },
  {
    slug: "calder-street-school",
    title: "Calder Street School",
    category: "Education",
    discipline: "Architecture",
    sector: "Commercial",
    place: "Glasgow",
    year: "2025",
    status: "Built",
    size: "5,400 m²",
    client: "Glasgow City Council",
    blurb: "A primary school planned as a street, with every classroom opening onto it.",
    summary:
      "Circulation treated as the main room rather than the leftover, so a tight urban site still gets somewhere to gather indoors.",
    body: [
      "The site could not fit a hall and a corridor. So there is no corridor: the circulation widens and narrows along its length, and at its widest it is the hall, with the stage against the gable.",
      "Every classroom opens directly onto this street through a deep threshold that holds coats, storage and a window seat. Teachers told us the thresholds get used more than the classrooms on either side of them, which we choose to take as a compliment.",
      "Structure is cross-laminated timber, left exposed throughout. The acoustic strategy depended on it, and so did the programme, the frame went up in nine weeks over a summer holiday.",
    ],
    beforeCaption:
      "The cleared school site with the design team and site manager walking the setting-out in high-vis.",
    afterCaption:
      "The finished school from Calder Street, the timber upper floor turning the corner.",
    parts: [
      { title: "The street", caption: "Circulation that widens into the hall." },
      {
        title: "Classroom thresholds",
        caption: "Coats, storage and a window seat in every doorway.",
      },
      { title: "Gable stage", caption: "At the far end, where the street is widest." },
      { title: "Exposed CLT", caption: "Nine weeks of frame over one summer holiday." },
    ],
  },
  {
    slug: "rookery-lane-library",
    title: "Rookery Lane Library",
    category: "Civic",
    discipline: "Interior Design",
    sector: "Commercial",
    place: "Norwich",
    year: "2025",
    status: "Built",
    size: "1,150 m²",
    client: "Norfolk Libraries",
    blurb: "A reading room lit entirely from above, wrapped by a lending floor at the perimeter.",
    summary:
      "The quietest part of the building is at the centre, which is the opposite of how libraries are usually planned.",
    body: [
      "Convention puts the reading room on the window wall and the stacks in the dark. We inverted it: lending, returns and the children's floor take the perimeter and all the street noise, while the reading room sits in the middle under a clerestory, with no view out and nothing to look at.",
      "It is the most-used room in the building by a considerable margin. The librarians predicted this and we did not entirely believe them.",
      "The clerestory is deep enough to exclude direct sun at every hour, so there is no blind, no glare, and nothing to maintain.",
    ],
    beforeCaption:
      "The 1970s branch library before strip-out, with the architects and librarians marking up the existing plan.",
    afterCaption: "The central reading room under its clerestory, mid-afternoon.",
    parts: [
      { title: "Deep clerestory", caption: "No direct sun at any hour, so no blinds at all." },
      {
        title: "Perimeter lending",
        caption: "Returns, children's floor and all the street noise.",
      },
      { title: "Central reading room", caption: "No view out, and the most-used room here." },
      { title: "Entrance corner", caption: "The one place the two zones meet." },
    ],
  },
  {
    slug: "saltworks-pavilion",
    title: "Saltworks Pavilion",
    category: "Cultural",
    discipline: "Architecture",
    sector: "Commercial",
    place: "Gdańsk",
    year: "2026",
    status: "On site",
    size: "680 m²",
    client: "Pomeranian Heritage",
    blurb: "A timber pavilion over the excavated floor of a mediaeval salt house.",
    summary:
      "A shelter, not a building: the archaeology is the exhibit and everything above it is demountable.",
    body: [
      "The excavated floor cannot be built on, loaded, or permanently enclosed. Everything above it therefore lands on eight points outside the archaeological boundary and spans across, a glulam grid carrying a standing-seam roof and nothing else.",
      "There are no walls. Weather protection is the roof overhang plus a perimeter of retractable fabric that is drawn only in winter, which the heritage body preferred to any glazed option.",
      "Every connection is bolted. If the assessment changes in twenty years, the pavilion comes apart in the order it went together.",
    ],
    beforeCaption:
      "The open excavation with archaeologists and the project architect recording the salt house floor.",
    afterCaption: "The glulam grid landed clear of the dig, roof complete, fabric drawn back.",
    parts: [
      { title: "Eight landings", caption: "Every load point outside the archaeological boundary." },
      { title: "Glulam grid", caption: "Spanning the whole dig without touching it." },
      { title: "Retractable perimeter", caption: "Fabric in winter; open the rest of the year." },
      { title: "Bolted joints", caption: "It comes apart in the order it went together." },
    ],
  },
  {
    slug: "wharfside-market-hall",
    title: "Wharfside Market Hall",
    category: "Retail",
    discipline: "Architecture",
    sector: "Commercial",
    place: "Bristol",
    year: "2024",
    status: "Built",
    size: "2,300 m²",
    client: "Wharfside Traders",
    blurb: "Forty trading bays under a reglazed Victorian train shed.",
    summary:
      "The shed was already the architecture. The work was making forty independent tenancies fit inside it without cluttering the span.",
    body: [
      "Nothing new touches the trusses. Every bay is a freestanding steel table with its own services dropping from a perimeter ring, so the span reads clear from end to end and any bay can be removed on a Sunday.",
      "The glazing was the expensive part: the original patent glazing was long gone and the replacement had to satisfy both conservation and current thermal standards, which took four rounds of mock-ups on site.",
      "Floor is a single power-floated slab with the old rail lines left in place and filled flush. They are the only trace of the shed's first use and they set the bay grid.",
    ],
    beforeCaption:
      "The derelict train shed with the structural engineer and conservation architect inspecting the truss connections.",
    afterCaption: "The finished hall under the reglazed roof, before the forty bays opened.",
    parts: [
      { title: "Freestanding bays", caption: "Steel tables; nothing new touches the trusses." },
      { title: "Reglazed roof", caption: "Four rounds of mock-up to satisfy both standards." },
      { title: "Filled rail lines", caption: "Flush in the slab, and they set the bay grid." },
      {
        title: "Perimeter services ring",
        caption: "Every drop comes from the edge, never the span.",
      },
    ],
  },
  {
    slug: "ferrous-house",
    title: "Ferrous House",
    category: "Residential",
    discipline: "Architecture",
    sector: "Residential",
    place: "Vermont",
    year: "2024",
    status: "Built",
    size: "280 m²",
    client: "Private",
    blurb: "A weathering steel box on a stone base, sited for one particular winter view.",
    summary: "A house positioned by standing in the snow for a weekend before any line was drawn.",
    body: [
      "The clients had owned the land for nine years and had a view in mind that existed only between December and March, when the birches lose their leaves. We staked the plan in February and moved it twice.",
      "Cladding is weathering steel on a stone base taken from the site's own field walls. The steel was a maintenance decision as much as an aesthetic one: the house is unoccupied for months at a time and nothing here needs painting.",
      "Inside, the entire north wall is storage and services, which lets the south wall be glass without the plan ever needing a corridor.",
    ],
    beforeCaption:
      "The steel volume going up on its stone base in deep snow, with the architects and client on site.",
    afterCaption: "The completed steel volume on its stone base, birches bare, mid-winter.",
    parts: [
      { title: "Field-wall base", caption: "Stone taken from the site's own walls." },
      { title: "Weathering steel", caption: "Nothing to paint in a house left empty for months." },
      { title: "North service wall", caption: "All storage, so the south wall can be glass." },
      { title: "Winter view", caption: "The reason the plan moved twice in February." },
    ],
  },
  {
    slug: "granary-quarter-offices",
    title: "Granary Quarter Offices",
    category: "Workplace",
    discipline: "Architecture",
    sector: "Commercial",
    place: "Dublin",
    year: "2026",
    status: "In design",
    size: "8,900 m²",
    client: "Granary Quarter Ltd",
    blurb: "Two retained grain silos threaded with a new floorplate that never touches them.",
    summary: "A workplace built between two listed silos, structurally independent of both.",
    body: [
      "The silos cannot carry load and cannot be pierced. The new building therefore sits between them on its own frame, close enough to read as one thing and detailed so that it demonstrably is not, a hundred-millimetre gap runs the full height on both sides.",
      "That gap is the building's best room. It is glazed top and bottom and used as breakout space on every floor, and it is the only place you can put your hand on the original concrete.",
      "The design is currently at stage three. The silo interiors remain undecided and we have argued, so far unsuccessfully, for leaving them empty.",
    ],
    beforeCaption:
      "The disused silos with the design team and structural engineer taking measurements from a cherry picker.",
    afterCaption: "Visualisation of the completed floorplate threaded between the retained silos.",
    parts: [
      {
        title: "The hundred-millimetre gap",
        caption: "Full height, both sides, structurally honest.",
      },
      { title: "Independent frame", caption: "Nothing new bears on the listed concrete." },
      { title: "Breakout void", caption: "The gap, glazed top and bottom, on every floor." },
      { title: "Silo interiors", caption: "Still undecided; we are arguing for empty." },
    ],
  },
  {
    slug: "pinewood-chapel",
    title: "Pinewood Chapel",
    category: "Civic",
    discipline: "Architecture",
    sector: "Commercial",
    place: "Oregon",
    year: "2023",
    status: "Built",
    size: "190 m²",
    client: "Pinewood Trust",
    blurb: "A non-denominational chapel of stacked timber, lit by a single slot to the east.",
    summary:
      "One room, one opening, and a great deal of argument about where the opening should go.",
    body: [
      "The trust wanted a space that belonged to no particular faith, which in practice meant removing every symbol until only orientation was left. The chapel therefore has one aperture, a full-height slot on the east wall, and the building is turned so that the slot catches sunrise at the equinox.",
      "Walls are stacked timber. Douglas fir sections laid flat and pinned, no frame, no lining. The thickness is structural, thermal and acoustic at once, and it is the only material in the room.",
      "It seats fifty and has been used for funerals, two weddings and, most weeks, for nothing at all, which the trust considers the point.",
    ],
    beforeCaption:
      "The forest clearing before construction, with the architect and carpenter setting out the east slot's orientation.",
    afterCaption: "The finished chapel at equinox sunrise, light entering the east slot.",
    parts: [
      {
        title: "Stacked timber wall",
        caption: "Douglas fir laid flat and pinned; no frame, no lining.",
      },
      { title: "East slot", caption: "One aperture, aligned to the equinox sunrise." },
      { title: "The room", caption: "Fifty seats, and most weeks nobody at all." },
      { title: "Clearing approach", caption: "The walk in, which is half the building." },
    ],
  },
  {
    slug: "quarry-edge-hotel",
    title: "Quarry Edge Hotel",
    category: "Hospitality",
    discipline: "Architecture",
    sector: "Commercial",
    place: "Cape Town",
    year: "2026",
    status: "On site",
    size: "4,600 m²",
    client: "Quarry Edge Ltd",
    blurb: "Rooms cut back into a worked-out granite face, with the quarry floor as the court.",
    summary:
      "A hotel that occupies the cut rather than sitting on it, using the quarry's own geometry as the plan.",
    body: [
      "The face was left in benches by a century of extraction. Those benches are the building: rooms sit in the cut at three levels, the quarry floor becomes the arrival court, and almost nothing projects beyond the original profile.",
      "Rock stability governed everything. A third of the programme is where it is because that was the only place the geotechnical report permitted anchoring, and the restaurant moved three times before it found ground that would take it.",
      "Water is the other constraint. The site has none, so the roof of every bench harvests to a tank cut into the face behind reception.",
    ],
    beforeCaption:
      "The rooms going into the quarry face, with the geotechnical engineer and architects assessing bench stability.",
    afterCaption: "The completed rooms occupying the cut, arrival court on the quarry floor below.",
    parts: [
      { title: "Bench rooms", caption: "Three levels, all within the original cut profile." },
      { title: "Quarry floor court", caption: "Arrival on the ground the extraction left." },
      { title: "Anchor zones", caption: "The geotechnical report wrote a third of the plan." },
      {
        title: "Harvest tank",
        caption: "Cut into the face behind reception; the site has no water.",
      },
    ],
  },
  {
    slug: "alder-court-almshouses",
    title: "Alder Court Almshouses",
    category: "Residential",
    discipline: "Architecture",
    sector: "Residential",
    place: "Suffolk",
    year: "2025",
    status: "Built",
    size: "1,320 m²",
    client: "Alder Court Foundation",
    blurb: "Eighteen single-storey homes around a cloistered green, replacing a 1970s block.",
    summary:
      "A four-hundred-year-old institution rehoused, with the cloister doing the work the old corridor could not.",
    body: [
      "The foundation has housed people since 1614 and had spent fifty years in a deck-access block that isolated everyone in it. The replacement is single storey, and every front door opens onto a covered cloister facing the green.",
      "The cloister is the entire social argument of the project. It is wide enough to sit in, sheltered enough to use in February, and it means nobody has to decide whether to go out in order to see someone.",
      "Homes are built to be adapted: level thresholds, structural provision for hoists in every bedroom, and a bathroom that can be reconfigured without touching drainage.",
    ],
    beforeCaption:
      "The replacement almshouses under scaffolding, with the architects and foundation trustees walking the new cloister line.",
    afterCaption: "The completed cloister facing the green, late afternoon in autumn.",
    parts: [
      { title: "The cloister", caption: "Wide enough to sit in, sheltered enough for February." },
      { title: "The green", caption: "What the cloister is for." },
      { title: "Adaptable bathroom", caption: "Reconfigurable without touching drainage." },
      { title: "Single-storey homes", caption: "Eighteen front doors, all onto the same walk." },
    ],
  },
  {
    slug: "harbourgate-show-residence",
    title: "Harbourgate Show Residence",
    category: "Residential",
    discipline: "Interior Design",
    sector: "Commercial",
    place: "Richmond",
    year: "2026",
    status: "Built",
    size: "165 m²",
    client: "Harbourgate Developments",
    blurb: "A show apartment detailed to survive being walked through, not just photographed.",
    summary:
      "The first finished flat in a 240-home block, fitted out as the room every buyer walks through, and specified for eighteen months of that traffic rather than one afternoon of it.",
    body: [
      "A show flat is a commercial instrument that happens to look like a home, which is why it sits under our commercial work rather than our residential work. Nobody lives here. Six thousand people walked through it in the first year, most of them in outdoor shoes, and the brief we wrote back to the developer was about wear before it was about taste.",
      "So the floor is engineered oak with a 6 mm wear layer rather than the 2.5 mm the contractor priced, the sofa is upholstered in a wool the manufacturer sells to airports, and every internal corner below waist height has a hardwood nosing set flush into the plaster. None of it is visible in a photograph. All of it is the reason the flat still looked new when the last unit sold.",
      "The one indulgence is the kitchen island, cut from a single slab of Canadian marble with a fault running through it that the supplier offered at a discount and expected us to refuse. It is the thing people photograph, and it is the thing they remember, and it cost less than the joinery either side of it.",
    ],
    beforeCaption:
      "The concrete shell on handover from the main contractor, with two of our interior architects setting out the kitchen run against the drawings.",
    afterCaption:
      "The completed living room looking back towards the island, mid-morning, with the river light coming across the balcony.",
    parts: [
      {
        title: "Marble island",
        caption: "One slab, fault and all, bought at a discount and kept for the fault.",
      },
      {
        title: "Oak floor",
        caption: "A 6 mm wear layer, specified for six thousand pairs of outdoor shoes.",
      },
      {
        title: "Bedroom joinery",
        caption: "Full height, flush, with the handles cut into the door edge.",
      },
    ],
  },
  {
    slug: "basswood-family-house",
    title: "Basswood Family House",
    category: "Residential",
    discipline: "Interior Design",
    sector: "Residential",
    place: "Rochester",
    year: "2025",
    status: "Built",
    size: "240 m²",
    client: "Private",
    blurb: "A 1962 split-level opened up around one removed wall and one kept staircase.",
    summary:
      "Everything the family disliked about the house came down to a single spine wall, and everything they loved came down to the staircase behind it. We took one out and left the other exactly where it was.",
    body: [
      "The house was sound, warm and unloved. Four bedrooms, a good garden, and a load-bearing spine wall that cut the ground floor into three rooms nobody used at the same time. The obvious move was to take it out, which we did, with a flitch beam deep enough to need the ceiling dropped by 140 mm across the span.",
      "The staircase was the argument. It is original, terrazzo-treaded, with a steel balustrade that would fail every current guidance on gap widths, and the family expected us to replace it. We kept it, added a secondary rail at the height the regulations want, and left the original visible behind it. The compromise reads as deliberate because it was.",
      "The rest is quiet. Lime plaster left unpainted in the hall, a kitchen in oiled ash that will mark and is meant to, and the same clay tile running from the back door out onto the terrace so the garden feels like the end of the room rather than the other side of a threshold.",
    ],
    beforeCaption:
      "The ground floor with the spine wall still standing, propped, while the architects and the structural engineer mark up the beam position on the plaster.",
    afterCaption:
      "The opened ground floor from the garden door, with the original staircase visible at the far end.",
    parts: [
      {
        title: "The kept staircase",
        caption: "Original terrazzo, with the new rail set in front of the old one.",
      },
      {
        title: "Ash kitchen",
        caption: "Oiled rather than lacquered, so it marks and then settles.",
      },
      {
        title: "Lime plaster hall",
        caption: "Left unpainted; it moves with the weather and we let it.",
      },
    ],
  },
  {
    slug: "ortolan-dining-rooms",
    title: "Ortolan Dining Rooms",
    category: "Hospitality",
    discipline: "Interior Design",
    sector: "Commercial",
    place: "Jacksonville",
    year: "2025",
    status: "Built",
    size: "410 m²",
    client: "Ortolan Hospitality",
    blurb: "A 1924 banking hall turned restaurant, where the real problem was the echo.",
    summary:
      "A marble banking hall makes a spectacular dining room and an unusable one. Most of this project is acoustic, and almost none of it is visible.",
    body: [
      "The room was built in 1924 to make people lower their voices, and it worked: plaster vault, marble dado, terrazzo floor, and a reverberation time of 2.4 seconds when we first measured it. At that figure a full restaurant is not loud, it is incoherent. You cannot hear the person opposite you.",
      "Everything that fixed it is hidden. Perforated plaster panels in the vault coffers, cut to the coffer module so the ceiling still reads as one surface. Felt bonded to the back of the banquette joinery. A carpet under the central tables only, which took the room to 1.1 seconds, and a second, quieter measurement once the upholstery arrived.",
      "What is visible we barely touched. The teller counter is now the bar, cut once to let staff through and otherwise left with its original grille and its original scratches. The safe door is still on its hinges at the back of the room, open, because the client wanted it closed and the fire officer did not.",
    ],
    beforeCaption:
      "The disused banking hall before strip-out, with the design team taking acoustic readings from the middle of the floor.",
    afterCaption:
      "The dining room in service, with the old teller counter working as the bar along the left-hand wall.",
    parts: [
      {
        title: "Teller counter bar",
        caption: "Cut once for staff access, otherwise left with its scratches.",
      },
      {
        title: "Coffer panels",
        caption: "Perforated plaster on the coffer module; the ceiling still reads as one surface.",
      },
      {
        title: "Banquette run",
        caption: "Felt bonded behind the joinery, which nobody will ever see.",
      },
    ],
  },
  {
    slug: "fernbank-clinic",
    title: "Fernbank Clinic",
    category: "Workplace",
    discipline: "Interior Design",
    sector: "Commercial",
    place: "Toronto",
    year: "2026",
    status: "On site",
    size: "620 m²",
    client: "Fernbank Health",
    blurb: "Fourteen consulting rooms arranged so nobody sits in a corridor waiting to be called.",
    summary:
      "A clinic fit-out where the plan does the pastoral work: two circulation routes, so a patient never walks back past the room they have just left, and nobody waits in a line of chairs facing a door.",
    body: [
      "The client asked for an interior that did not feel clinical, which usually means a request for softer colours. The colours were never the problem. The problem is the standard clinic plan, where one corridor serves every room and the waiting area is a row of chairs pointed at the door you are dreading.",
      "So there are two routes. Patients arrive into a daylit room with seating in small groups, are collected rather than called, and leave by a second corridor that does not pass the waiting area. It costs about forty square metres of lettable area, which the client agreed to lose after sitting in the mock-up for an afternoon.",
      "Materially it is restrained and hard-wearing: linoleum in a warm grey, oak veneer to door linings and handrails, and acoustic plaster in the consulting rooms tested to 45 dB between rooms, which is higher than the guidance asks for and the only figure the clinicians cared about.",
    ],
    beforeCaption:
      "The vacant second floor before partitioning, with the project architects setting out the two corridor runs in tape on the slab.",
    afterCaption:
      "The completed arrival room, with seating grouped rather than lined up and daylight from the south elevation.",
    parts: [
      {
        title: "Arrival room",
        caption: "Grouped seating, no row of chairs facing a door.",
      },
      {
        title: "Consulting room",
        caption: "Acoustic plaster tested to 45 dB, which is the number that mattered.",
      },
      {
        title: "Second corridor",
        caption: "Forty square metres of lettable area, given up on purpose.",
      },
    ],
  },
  {
    slug: "juniper-loft",
    title: "Juniper Loft",
    category: "Residential",
    discipline: "Interior Design",
    sector: "Residential",
    place: "Montreal",
    year: "2024",
    status: "Built",
    size: "130 m²",
    client: "Private",
    blurb: "A garment-factory floor divided by furniture rather than walls.",
    summary:
      "One room, four uses, and a client who had lived in the shell for two years and knew exactly which parts of it she did not want divided.",
    body: [
      "She had been camping in it since the building was converted, which is the best possible brief. She knew the light moved off the west windows at four, that the freight lift was loud on weekday mornings, and that the only thing she genuinely needed enclosed was the bedroom.",
      "So there is one wall, and everything else is joinery: a 2.1 m oak volume holding the kitchen on one face, storage on the second and the bathroom door on the third, standing free of the ceiling so the original steel beams run over the top of it uninterrupted.",
      "The floor is the existing maple, sanded once and left with the oil stains where the machines stood. We argued to keep them and she agreed faster than we expected. They are the only evidence left that anyone worked here.",
    ],
    beforeCaption:
      "The bare factory floor with services capped off, the architects pacing out the joinery volume against the column grid.",
    afterCaption:
      "The finished loft looking west at four in the afternoon, the oak volume standing clear of the beams.",
    parts: [
      {
        title: "The oak volume",
        caption: "Kitchen, storage and a bathroom door, stopped short of the ceiling.",
      },
      {
        title: "Maple floor",
        caption: "Sanded once, with the machine oil left where it fell.",
      },
    ],
  },
];

export const PART_ROLES: ImageRole[] = ["part-1", "part-2", "part-3", "part-4"];

/** Only the parts that actually have a photograph. */
export function partsWithImages(
  project: Project,
): Array<{ title: string; caption: string; src: string }> {
  const out: Array<{ title: string; caption: string; src: string }> = [];
  project.parts.forEach((part, i) => {
    const role = PART_ROLES[i];
    const src = role ? projectImage(project.slug, role) : null;
    if (src) out.push({ ...part, src });
  });
  return out;
}

/** How much photography a project has. Drives running order: the best-shot
 *  projects lead the index and the homepage, the thin ones fall to the end. */
export function imageCount(project: Project): number {
  const roles: ImageRole[] = ["cover", "before", "after", ...PART_ROLES];
  const shot = roles.filter((role) => projectImage(project.slug, role)).length;
  return shot + (shot === 0 && project.legacy ? 1 : 0);
}

/**
 * Richest first. Array.prototype.sort is stable, so projects with the same
 * number of frames keep their authored order.
 */
export const PROJECTS: Project[] = [...RAW_PROJECTS].sort((a, b) => imageCount(b) - imageCount(a));

export const CATEGORIES = [
  "All",
  "Residential",
  "Cultural",
  "Civic",
  "Education",
  "Hospitality",
  "Workplace",
  "Retail",
] as const;

/**
 * The labels printed under a card and in the profile hero.
 *
 * Deduplicated: for most residential work the sector and the category are the
 * same word, and "Residential · Residential · Connecticut" reads like a bug.
 */
export function projectLabels(project: Project): string[] {
  const labels = [project.discipline, project.sector, project.category, project.place];
  return labels.filter((label, i) => labels.indexOf(label) === i);
}

/** The categories actually present in a filtered set, so no chip is a dead end. */
export function categoriesIn(projects: Project[]): Category[] {
  const present = new Set(projects.map((p) => p.category));
  return CATEGORIES.filter((c): c is Category => c !== "All" && present.has(c as Category));
}

export function projectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

/** Cover for the index card: shot cover → shot after → legacy → none. */
export function coverFor(project: Project): string | null {
  return (
    projectImage(project.slug, "cover") ??
    projectImage(project.slug, "after") ??
    project.legacy ??
    null
  );
}
