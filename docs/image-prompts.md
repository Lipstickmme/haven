# Project photography — prompts and descriptions

Generated from `src/lib/projects.ts`. Twenty projects, six frames each: one
`before`, one `after`, and four parts of the building.

## Where the files go

```
src/assets/projects/<slug>/before.webp
src/assets/projects/<slug>/after.webp
src/assets/projects/<slug>/part-1.webp   … part-4.webp
src/assets/projects/<slug>/cover.webp    (optional; falls back to after.webp)
```

Nothing else to change — `src/lib/projects.ts` globs that directory, so a file
appears on the site as soon as it is committed. Frames that do not exist yet
render as a hatched panel labelled with the part name, not a broken image.

**Export as WebP, quality 82, 1600×1200 for parts and covers, 1920×1080 for
before/after pairs.** Shoot each before/after pair from as close to the same
position and focal length as you can — the site cross-fades them under a
drag handle, and a matched viewpoint is what makes that read.

## Adding a photograph

1. Create the folder if it does not exist: `src/assets/projects/<slug>/`
2. Drop the file in, named by role: `before`, `after`, `part-1` … `part-4`,
   or `cover`.
3. Commit and push. Vercel rebuilds and the frame replaces its placeholder.

`.webp`, `.jpg`, `.jpeg`, `.png` and `.avif` all work. WebP at quality 82 is
what the existing imagery uses.

**The glob runs at build time, not in the browser.** Copying a file onto the
server does nothing on its own — the image has to be committed and the site
rebuilt, which a push does automatically. Run `npm run dev` to preview locally
before pushing.

You do not need to touch `src/lib/projects.ts`. Nothing lists the files; the
directory is the manifest.

## House style — append to every prompt

```
documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

### Negative prompt

```
glossy stock-photo look, HDR, over-saturated sky, lens flare, plastic sheen, mirror-perfect surfaces, showroom gloss, CGI render look, fisheye distortion, leaning verticals, watermark, text, logos, cartoon, illustration, oversharpened, heavy vignette
```

### The two rules that matter most

1. **Every `before` frame has architects working on site.** Two or three people
   in hi-vis vests and hard hats, holding drawings, a tape or a level — mid-task
   and unaware of the camera. Never posed, never looking at the lens.
2. **Realistic, not shiny.** These should look like a photographer was sent to a
   real building on an ordinary day. Overcast beats golden hour. Dust, site mud,
   scaffold, weather staining and reflections in imperfect glass are all wanted.

---

## 1. Halden Civic Centre

`halden-civic-centre` · Civic · Oslo · 2025 · Built

**`before.webp`**

> The municipal car park during enabling works, with the site team setting out the first roof bay.

```
Construction-stage photograph of board-marked concrete civic building stepping down a grassy slope above a fjord, low horizontal massing, deep roof overhangs, before completion — structure exposed, scaffolding and site hoarding in place, ground churned and muddy. Two or three architects in hi-vis vests and hard hats stand mid-conversation over unrolled drawings, one pointing at the structure, none looking at the camera. cool Nordic overcast, blue hour. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`after.webp`**

> The completed roof stepping down the slope, seen from the fjord path at dusk.

```
Completed photograph of board-marked concrete civic building stepping down a grassy slope above a fjord, low horizontal massing, deep roof overhangs, finished and in use, no construction equipment, no people or at most one distant figure for scale. Same viewpoint and focal length as the before frame. cool Nordic overcast, blue hour. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-1.webp` — Board-marked soffit**

> Spruce shuttering from the cleared site, left in the grain.

```
Architectural detail photograph: board-marked soffit of board-marked concrete civic building stepping down a grassy slope above a fjord, low horizontal massing, deep roof overhangs. Spruce shuttering from the cleared site, left in the grain. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. cool Nordic overcast, blue hour. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-2.webp` — Public hall**

> The room under the roof, between the library and the chamber.

```
Architectural detail photograph: public hall of board-marked concrete civic building stepping down a grassy slope above a fjord, low horizontal massing, deep roof overhangs. The room under the roof, between the library and the chamber. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. cool Nordic overcast, blue hour. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-3.webp` — Council chamber**

> Glazed on two sides; the argument we nearly lost.

```
Architectural detail photograph: council chamber of board-marked concrete civic building stepping down a grassy slope above a fjord, low horizontal massing, deep roof overhangs. Glazed on two sides; the argument we nearly lost. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. cool Nordic overcast, blue hour. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-4.webp` — West stair**

> Cast in one pour against the retaining wall.

```
Architectural detail photograph: west stair of board-marked concrete civic building stepping down a grassy slope above a fjord, low horizontal massing, deep roof overhangs. Cast in one pour against the retaining wall. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. cool Nordic overcast, blue hour. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

---

## 2. Bastion Arts Foundation

`bastion-arts-foundation` · Cultural · Antwerp · 2025 · Built

**`before.webp`**

> The bastion wall exposed after demolition, with the conservation architect recording coursing before works began.

```
Construction-stage photograph of blind concrete gallery box cantilevered over a nineteenth-century brick bastion wall, narrow European street, before completion — structure exposed, scaffolding and site hoarding in place, ground churned and muddy. Two or three architects in hi-vis vests and hard hats stand mid-conversation over unrolled drawings, one pointing at the structure, none looking at the camera. flat grey daylight, wet cobbles. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`after.webp`**

> The gallery box cantilevered clear of the plinth, lit from within after closing.

```
Completed photograph of blind concrete gallery box cantilevered over a nineteenth-century brick bastion wall, narrow European street, finished and in use, no construction equipment, no people or at most one distant figure for scale. Same viewpoint and focal length as the before frame. flat grey daylight, wet cobbles. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-1.webp` — Cantilever blades**

> Two concrete blades carry the eight-metre overhang.

```
Architectural detail photograph: cantilever blades of blind concrete gallery box cantilevered over a nineteenth-century brick bastion wall, narrow European street. Two concrete blades carry the eight-metre overhang. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. flat grey daylight, wet cobbles. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-2.webp` — Coffered roof**

> North slots, individually shuttered for the conservator.

```
Architectural detail photograph: coffered roof of blind concrete gallery box cantilevered over a nineteenth-century brick bastion wall, narrow European street. North slots, individually shuttered for the conservator. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. flat grey daylight, wet cobbles. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-3.webp` — Bastion join**

> New coursing set back forty millimetres from the old.

```
Architectural detail photograph: bastion join of blind concrete gallery box cantilevered over a nineteenth-century brick bastion wall, narrow European street. New coursing set back forty millimetres from the old. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. flat grey daylight, wet cobbles. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-4.webp` — Under-plinth entry**

> The lobby that had to go beneath a listed wall.

```
Architectural detail photograph: under-plinth entry of blind concrete gallery box cantilevered over a nineteenth-century brick bastion wall, narrow European street. The lobby that had to go beneath a listed wall. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. flat grey daylight, wet cobbles. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

---

## 3. Lantern House

`lantern-house` · Residential · Connecticut · 2024 · Built

**`before.webp`**

> The 1960s ranch house before strip-out, with the project architect and structural engineer checking the retained slab.

```
Construction-stage photograph of two-storey house, white render planes with a continuous glazed band, mature maple woodland, before completion — structure exposed, scaffolding and site hoarding in place, ground churned and muddy. Two or three architects in hi-vis vests and hard hats stand mid-conversation over unrolled drawings, one pointing at the structure, none looking at the camera. dusk, warm interior light against cool sky. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`after.webp`**

> The completed house from the maple line, lit through the upper glazed band.

```
Completed photograph of two-storey house, white render planes with a continuous glazed band, mature maple woodland, finished and in use, no construction equipment, no people or at most one distant figure for scale. Same viewpoint and focal length as the before frame. dusk, warm interior light against cool sky. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-1.webp` — Glazed band**

> A continuous reveal between two render planes.

```
Architectural detail photograph: glazed band of two-storey house, white render planes with a continuous glazed band, mature maple woodland. A continuous reveal between two render planes. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. dusk, warm interior light against cool sky. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-2.webp` — Rotated plan**

> Fifteen degrees off the old grid, toward the slope.

```
Architectural detail photograph: rotated plan of two-storey house, white render planes with a continuous glazed band, mature maple woodland. Fifteen degrees off the old grid, toward the slope. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. dusk, warm interior light against cool sky. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-3.webp` — Entrance court**

> Formed by the retained footprint's north edge.

```
Architectural detail photograph: entrance court of two-storey house, white render planes with a continuous glazed band, mature maple woodland. Formed by the retained footprint's north edge. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. dusk, warm interior light against cool sky. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-4.webp` — Stair hall**

> The one double-height room, top-lit.

```
Architectural detail photograph: stair hall of two-storey house, white render planes with a continuous glazed band, mature maple woodland. The one double-height room, top-lit. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. dusk, warm interior light against cool sky. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

---

## 4. Carriage Lane House

`carriage-lane-house` · Residential · Rochester · 2023 · Built

**`before.webp`**

> The vacant corner plot with the site architect and contractor setting out the north boundary line.

```
Construction-stage photograph of dark iron-spot brick house on a tight suburban corner, open carport beneath, before completion — structure exposed, scaffolding and site hoarding in place, ground churned and muddy. Two or three architects in hi-vis vests and hard hats stand mid-conversation over unrolled drawings, one pointing at the structure, none looking at the camera. overcast late afternoon. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`after.webp`**

> The finished house from the lane, carport open beneath the brick volume.

```
Completed photograph of dark iron-spot brick house on a tight suburban corner, open carport beneath, finished and in use, no construction equipment, no people or at most one distant figure for scale. Same viewpoint and focal length as the before frame. overcast late afternoon. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-1.webp` — Stack-bond brick**

> The upper volume, weighted by bond rather than colour.

```
Architectural detail photograph: stack-bond brick of dark iron-spot brick house on a tight suburban corner, open carport beneath. The upper volume, weighted by bond rather than colour. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. overcast late afternoon. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-2.webp` — Carport court**

> Parking and entrance in the same south-facing room.

```
Architectural detail photograph: carport court of dark iron-spot brick house on a tight suburban corner, open carport beneath. Parking and entrance in the same south-facing room. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. overcast late afternoon. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-3.webp` — Folded steel stair**

> One plate, one fabricator, two streets away.

```
Architectural detail photograph: folded steel stair of dark iron-spot brick house on a tight suburban corner, open carport beneath. One plate, one fabricator, two streets away. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. overcast late afternoon. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-4.webp` — North boundary**

> Where the mass had to go for the shadows to work.

```
Architectural detail photograph: north boundary of dark iron-spot brick house on a tight suburban corner, open carport beneath. Where the mass had to go for the shadows to work. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. overcast late afternoon. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

---

## 5. Cliff Terrace Residence

`cliff-terrace-residence` · Residential · Amalfi · 2023 · Built

**`before.webp`**

> The cliff path before works, with the engineer and site foreman surveying the pile positions by hand.

```
Construction-stage photograph of four stepped terraces of a lightweight house pinned to an Amalfi cliff face above the sea, before completion — structure exposed, scaffolding and site hoarding in place, ground churned and muddy. Two or three architects in hi-vis vests and hard hats stand mid-conversation over unrolled drawings, one pointing at the structure, none looking at the camera. first light, soft sea haze. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`after.webp`**

> The four terraces stepping seaward, photographed from the water at first light.

```
Completed photograph of four stepped terraces of a lightweight house pinned to an Amalfi cliff face above the sea, finished and in use, no construction equipment, no people or at most one distant figure for scale. Same viewpoint and focal length as the before frame. first light, soft sea haze. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-1.webp` — Mini-pile terraces**

> Pile caps doing double duty as floor plates.

```
Architectural detail photograph: mini-pile terraces of four stepped terraces of a lightweight house pinned to an Amalfi cliff face above the sea. Pile caps doing double duty as floor plates. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. first light, soft sea haze. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-2.webp` — Landward louvres**

> All ventilation and all the storm loading.

```
Architectural detail photograph: landward louvres of four stepped terraces of a lightweight house pinned to an Amalfi cliff face above the sea. All ventilation and all the storm loading. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. first light, soft sea haze. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-3.webp` — Carried frame**

> Steel in two-person lifts, down the path.

```
Architectural detail photograph: carried frame of four stepped terraces of a lightweight house pinned to an Amalfi cliff face above the sea. Steel in two-person lifts, down the path. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. first light, soft sea haze. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-4.webp` — Seaward glazing**

> Fixed, because nothing openable would survive.

```
Architectural detail photograph: seaward glazing of four stepped terraces of a lightweight house pinned to an Amalfi cliff face above the sea. Fixed, because nothing openable would survive. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. first light, soft sea haze. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

---

## 6. Fold Museum Annex

`fold-museum-annex` · Cultural · Rotterdam · 2024 · Built

**`before.webp`**

> The former depot roof opened up, with the conservation team and contractor reviewing the existing structure.

```
Construction-stage photograph of precast concrete folded-plate roof with eleven north-facing facets, beside a Rotterdam canal, before completion — structure exposed, scaffolding and site hoarding in place, ground churned and muddy. Two or three architects in hi-vis vests and hard hats stand mid-conversation over unrolled drawings, one pointing at the structure, none looking at the camera. flat northern daylight. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`after.webp`**

> The completed folded roof over the print hall, seen from the adjacent canal.

```
Completed photograph of precast concrete folded-plate roof with eleven north-facing facets, beside a Rotterdam canal, finished and in use, no construction equipment, no people or at most one distant figure for scale. Same viewpoint and focal length as the before frame. flat northern daylight. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-1.webp` — Eleven folds**

> Each facet sized from the conservation daylight model.

```
Architectural detail photograph: eleven folds of precast concrete folded-plate roof with eleven north-facing facets, beside a Rotterdam canal. Each facet sized from the conservation daylight model. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. flat northern daylight. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-2.webp` — Print hall**

> One top-lit room at fifty lux, flat across the year.

```
Architectural detail photograph: print hall of precast concrete folded-plate roof with eleven north-facing facets, beside a Rotterdam canal. One top-lit room at fifty lux, flat across the year. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. flat northern daylight. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-3.webp` — Open joints**

> Precast tolerance turned into a shadow gap.

```
Architectural detail photograph: open joints of precast concrete folded-plate roof with eleven north-facing facets, beside a Rotterdam canal. Precast tolerance turned into a shadow gap. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. flat northern daylight. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-4.webp` — Blind south wall**

> Stores, study rooms and plant, all in the dark side.

```
Architectural detail photograph: blind south wall of precast concrete folded-plate roof with eleven north-facing facets, beside a Rotterdam canal. Stores, study rooms and plant, all in the dark side. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. flat northern daylight. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

---

## 7. Solstice Penthouse

`solstice-penthouse` · Residential · New York · 2025 · Built

**`before.webp`**

> The original eleven-room plan mid strip-out, with the architect and structural engineer marking the slab opening.

```
Construction-stage photograph of top-floor apartment behind a full-height north window wall, Manhattan skyline beyond, before completion — structure exposed, scaffolding and site hoarding in place, ground churned and muddy. Two or three architects in hi-vis vests and hard hats stand mid-conversation over unrolled drawings, one pointing at the structure, none looking at the camera. cool overcast, high floor. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`after.webp`**

> The double-height living space against the retained north window wall.

```
Completed photograph of top-floor apartment behind a full-height north window wall, Manhattan skyline beyond, finished and in use, no construction equipment, no people or at most one distant figure for scale. Same viewpoint and focal length as the before frame. cool overcast, high floor. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-1.webp` — Slab opening**

> A third of the upper plate, removed.

```
Architectural detail photograph: slab opening of top-floor apartment behind a full-height north window wall, Manhattan skyline beyond. A third of the upper plate, removed. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. cool overcast, high floor. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-2.webp` — Transfer beam**

> Three pieces, one goods lift, one weekend.

```
Architectural detail photograph: transfer beam of top-floor apartment behind a full-height north window wall, Manhattan skyline beyond. Three pieces, one goods lift, one weekend. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. cool overcast, high floor. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-3.webp` — Upper gallery**

> Study, guest room, and the view.

```
Architectural detail photograph: upper gallery of top-floor apartment behind a full-height north window wall, Manhattan skyline beyond. Study, guest room, and the view. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. cool overcast, high floor. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-4.webp` — North glazing**

> The one element worth keeping.

```
Architectural detail photograph: north glazing of top-floor apartment behind a full-height north window wall, Manhattan skyline beyond. The one element worth keeping. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. cool overcast, high floor. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

---

## 8. Travertine House Hotel

`travertine-house-hotel` · Hospitality · Lisbon · 2024 · Built

**`before.webp`**

> The terraced hillside during excavation, with the site architects checking the setting-out of the first loggia.

```
Construction-stage photograph of travertine-clad hotel terraced into a Lisbon hillside, stacked loggias fanned at slight angles, before completion — structure exposed, scaffolding and site hoarding in place, ground churned and muddy. Two or three architects in hi-vis vests and hard hats stand mid-conversation over unrolled drawings, one pointing at the structure, none looking at the camera. warm late-afternoon sun, long shadows. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`after.webp`**

> The completed loggias fanning across the hillside in late afternoon light.

```
Completed photograph of travertine-clad hotel terraced into a Lisbon hillside, stacked loggias fanned at slight angles, finished and in use, no construction equipment, no people or at most one distant figure for scale. Same viewpoint and focal length as the before frame. warm late-afternoon sun, long shadows. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-1.webp` — Fanned loggias**

> Four degrees per floor, so no sightline repeats.

```
Architectural detail photograph: fanned loggias of travertine-clad hotel terraced into a Lisbon hillside, stacked loggias fanned at slight angles. Four degrees per floor, so no sightline repeats. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. warm late-afternoon sun, long shadows. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-2.webp` — Travertine skin**

> Chosen because it weathers, not despite it.

```
Architectural detail photograph: travertine skin of travertine-clad hotel terraced into a Lisbon hillside, stacked loggias fanned at slight angles. Chosen because it weathers, not despite it. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. warm late-afternoon sun, long shadows. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-3.webp` — Buried back of house**

> Service circulation inside the hill.

```
Architectural detail photograph: buried back of house of travertine-clad hotel terraced into a Lisbon hillside, stacked loggias fanned at slight angles. Service circulation inside the hill. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. warm late-afternoon sun, long shadows. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-4.webp` — Arrival court**

> The only place the hotel presents a front.

```
Architectural detail photograph: arrival court of travertine-clad hotel terraced into a Lisbon hillside, stacked loggias fanned at slight angles. The only place the hotel presents a front. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. warm late-afternoon sun, long shadows. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

---

## 9. Ironworks Studio

`ironworks-studio` · Workplace · Rochester · 2023 · Built

**`before.webp`**

> The disused foundry floor, with the project team surveying the retained steel frame under temporary lighting.

```
Construction-stage photograph of brick and steel former foundry with a reglazed north roof slope, industrial yard, before completion — structure exposed, scaffolding and site hoarding in place, ground churned and muddy. Two or three architects in hi-vis vests and hard hats stand mid-conversation over unrolled drawings, one pointing at the structure, none looking at the camera. bright overcast. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`after.webp`**

> The finished making floor beneath the reglazed north roof slope.

```
Completed photograph of brick and steel former foundry with a reglazed north roof slope, industrial yard, finished and in use, no construction equipment, no people or at most one distant figure for scale. Same viewpoint and focal length as the before frame. bright overcast. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-1.webp` — Retained frame**

> Better than the survey suggested.

```
Architectural detail photograph: retained frame of brick and steel former foundry with a reglazed north roof slope, industrial yard. Better than the survey suggested. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. bright overcast. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-2.webp` — North glazing**

> The one slope worth opening up.

```
Architectural detail photograph: north glazing of brick and steel former foundry with a reglazed north roof slope, industrial yard. The one slope worth opening up. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. bright overcast. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-3.webp` — Floating deck**

> Desks above an oil-soaked floor left on show.

```
Architectural detail photograph: floating deck of brick and steel former foundry with a reglazed north roof slope, industrial yard. Desks above an oil-soaked floor left on show. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. bright overcast. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-4.webp` — Crane rail**

> Kept, and still used.

```
Architectural detail photograph: crane rail of brick and steel former foundry with a reglazed north roof slope, industrial yard. Kept, and still used. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. bright overcast. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

---

## 10. Marble Line Flagship

`marble-line-flagship` · Retail · Milan · 2022 · Built

**`before.webp`**

> The stripped retail unit with the vaults exposed, and the architect setting out the stone run in chalk.

```
Construction-stage photograph of small Milanese shopfront under masonry vaults, one continuous Carrara element inside, before completion — structure exposed, scaffolding and site hoarding in place, ground churned and muddy. Two or three architects in hi-vis vests and hard hats stand mid-conversation over unrolled drawings, one pointing at the structure, none looking at the camera. even indirect light. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`after.webp`**

> The finished Carrara element running from sill to counter to stair.

```
Completed photograph of small Milanese shopfront under masonry vaults, one continuous Carrara element inside, finished and in use, no construction equipment, no people or at most one distant figure for scale. Same viewpoint and focal length as the before frame. even indirect light. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-1.webp` — Continuous veining**

> One block, cut so the grain runs through.

```
Architectural detail photograph: continuous veining of small Milanese shopfront under masonry vaults, one continuous Carrara element inside. One block, cut so the grain runs through. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. even indirect light. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-2.webp` — The turn**

> Where counter becomes stair.

```
Architectural detail photograph: the turn of small Milanese shopfront under masonry vaults, one continuous Carrara element inside. Where counter becomes stair. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. even indirect light. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-3.webp` — Washed vaults**

> Indirect light only; no visible fitting.

```
Architectural detail photograph: washed vaults of small Milanese shopfront under masonry vaults, one continuous Carrara element inside. Indirect light only; no visible fitting. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. even indirect light. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-4.webp` — Window sill**

> Where the stone begins.

```
Architectural detail photograph: window sill of small Milanese shopfront under masonry vaults, one continuous Carrara element inside. Where the stone begins. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. even indirect light. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

---

## 11. Kiln Yard Housing

`kiln-yard-housing` · Residential · Manchester · 2026 · On site

**`before.webp`**

> The pottery yard before demolition, with architects and the conservation officer recording the kiln structure.

```
Construction-stage photograph of red-brick perimeter housing block around a courtyard containing a retained conical pottery kiln, Manchester, before completion — structure exposed, scaffolding and site hoarding in place, ground churned and muddy. Two or three architects in hi-vis vests and hard hats stand mid-conversation over unrolled drawings, one pointing at the structure, none looking at the camera. soft grey daylight, damp brick. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`after.webp`**

> The completed perimeter block enclosing the retained kiln at dusk.

```
Completed photograph of red-brick perimeter housing block around a courtyard containing a retained conical pottery kiln, Manchester, finished and in use, no construction equipment, no people or at most one distant figure for scale. Same viewpoint and focal length as the before frame. soft grey daylight, damp brick. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-1.webp` — Retained kiln**

> Eleven units traded for the centre of the courtyard.

```
Architectural detail photograph: retained kiln of red-brick perimeter housing block around a courtyard containing a retained conical pottery kiln, Manchester. Eleven units traded for the centre of the courtyard. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. soft grey daylight, damp brick. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-2.webp` — Dual aspect**

> Every home, without exception, including the corners.

```
Architectural detail photograph: dual aspect of red-brick perimeter housing block around a courtyard containing a retained conical pottery kiln, Manchester. Every home, without exception, including the corners. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. soft grey daylight, damp brick. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-3.webp` — Reclaimed brick**

> Old and new laid in declared panels, never blended.

```
Architectural detail photograph: reclaimed brick of red-brick perimeter housing block around a courtyard containing a retained conical pottery kiln, Manchester. Old and new laid in declared panels, never blended. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. soft grey daylight, damp brick. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-4.webp` — Yard threshold**

> Where the public route crosses into the block.

```
Architectural detail photograph: yard threshold of red-brick perimeter housing block around a courtyard containing a retained conical pottery kiln, Manchester. Where the public route crosses into the block. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. soft grey daylight, damp brick. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

---

## 12. Calder Street School

`calder-street-school` · Education · Glasgow · 2025 · Built

**`before.webp`**

> The cleared school site with the design team and site manager walking the setting-out in high-vis.

```
Construction-stage photograph of cross-laminated timber primary school, exposed spruce structure, tight Glasgow urban site, before completion — structure exposed, scaffolding and site hoarding in place, ground churned and muddy. Two or three architects in hi-vis vests and hard hats stand mid-conversation over unrolled drawings, one pointing at the structure, none looking at the camera. bright overcast, honest daylight. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`after.webp`**

> The finished timber street at its widest point, set for assembly.

```
Completed photograph of cross-laminated timber primary school, exposed spruce structure, tight Glasgow urban site, finished and in use, no construction equipment, no people or at most one distant figure for scale. Same viewpoint and focal length as the before frame. bright overcast, honest daylight. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-1.webp` — The street**

> Circulation that widens into the hall.

```
Architectural detail photograph: the street of cross-laminated timber primary school, exposed spruce structure, tight Glasgow urban site. Circulation that widens into the hall. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. bright overcast, honest daylight. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-2.webp` — Classroom thresholds**

> Coats, storage and a window seat in every doorway.

```
Architectural detail photograph: classroom thresholds of cross-laminated timber primary school, exposed spruce structure, tight Glasgow urban site. Coats, storage and a window seat in every doorway. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. bright overcast, honest daylight. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-3.webp` — Exposed CLT**

> Nine weeks of frame over one summer holiday.

```
Architectural detail photograph: exposed clt of cross-laminated timber primary school, exposed spruce structure, tight Glasgow urban site. Nine weeks of frame over one summer holiday. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. bright overcast, honest daylight. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-4.webp` — Gable stage**

> At the far end, where the street is widest.

```
Architectural detail photograph: gable stage of cross-laminated timber primary school, exposed spruce structure, tight Glasgow urban site. At the far end, where the street is widest. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. bright overcast, honest daylight. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

---

## 13. Rookery Lane Library

`rookery-lane-library` · Civic · Norwich · 2025 · Built

**`before.webp`**

> The 1970s branch library before strip-out, with the architects and librarians marking up the existing plan.

```
Construction-stage photograph of brick civic library with a deep clerestory lantern over a central reading room, Norwich, before completion — structure exposed, scaffolding and site hoarding in place, ground churned and muddy. Two or three architects in hi-vis vests and hard hats stand mid-conversation over unrolled drawings, one pointing at the structure, none looking at the camera. mid-afternoon overcast. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`after.webp`**

> The central reading room under its clerestory, mid-afternoon.

```
Completed photograph of brick civic library with a deep clerestory lantern over a central reading room, Norwich, finished and in use, no construction equipment, no people or at most one distant figure for scale. Same viewpoint and focal length as the before frame. mid-afternoon overcast. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-1.webp` — Central reading room**

> No view out, and the most-used room here.

```
Architectural detail photograph: central reading room of brick civic library with a deep clerestory lantern over a central reading room, Norwich. No view out, and the most-used room here. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. mid-afternoon overcast. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-2.webp` — Deep clerestory**

> No direct sun at any hour, so no blinds at all.

```
Architectural detail photograph: deep clerestory of brick civic library with a deep clerestory lantern over a central reading room, Norwich. No direct sun at any hour, so no blinds at all. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. mid-afternoon overcast. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-3.webp` — Perimeter lending**

> Returns, children's floor and all the street noise.

```
Architectural detail photograph: perimeter lending of brick civic library with a deep clerestory lantern over a central reading room, Norwich. Returns, children's floor and all the street noise. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. mid-afternoon overcast. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-4.webp` — Entrance corner**

> The one place the two zones meet.

```
Architectural detail photograph: entrance corner of brick civic library with a deep clerestory lantern over a central reading room, Norwich. The one place the two zones meet. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. mid-afternoon overcast. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

---

## 14. Saltworks Pavilion

`saltworks-pavilion` · Cultural · Gdańsk · 2026 · On site

**`before.webp`**

> The open excavation with archaeologists and the project architect recording the salt house floor.

```
Construction-stage photograph of glulam timber grid pavilion on eight slender points spanning an open archaeological excavation, Gdansk, before completion — structure exposed, scaffolding and site hoarding in place, ground churned and muddy. Two or three architects in hi-vis vests and hard hats stand mid-conversation over unrolled drawings, one pointing at the structure, none looking at the camera. cold northern light, low sun. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`after.webp`**

> The glulam grid landed clear of the dig, roof complete, fabric drawn back.

```
Completed photograph of glulam timber grid pavilion on eight slender points spanning an open archaeological excavation, Gdansk, finished and in use, no construction equipment, no people or at most one distant figure for scale. Same viewpoint and focal length as the before frame. cold northern light, low sun. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-1.webp` — Eight landings**

> Every load point outside the archaeological boundary.

```
Architectural detail photograph: eight landings of glulam timber grid pavilion on eight slender points spanning an open archaeological excavation, Gdansk. Every load point outside the archaeological boundary. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. cold northern light, low sun. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-2.webp` — Glulam grid**

> Spanning the whole dig without touching it.

```
Architectural detail photograph: glulam grid of glulam timber grid pavilion on eight slender points spanning an open archaeological excavation, Gdansk. Spanning the whole dig without touching it. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. cold northern light, low sun. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-3.webp` — Retractable perimeter**

> Fabric in winter; open the rest of the year.

```
Architectural detail photograph: retractable perimeter of glulam timber grid pavilion on eight slender points spanning an open archaeological excavation, Gdansk. Fabric in winter; open the rest of the year. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. cold northern light, low sun. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-4.webp` — Bolted joints**

> It comes apart in the order it went together.

```
Architectural detail photograph: bolted joints of glulam timber grid pavilion on eight slender points spanning an open archaeological excavation, Gdansk. It comes apart in the order it went together. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. cold northern light, low sun. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

---

## 15. Wharfside Market Hall

`wharfside-market-hall` · Retail · Bristol · 2024 · Built

**`before.webp`**

> The derelict train shed with the structural engineer and conservation architect inspecting truss connections from a scissor lift.

```
Construction-stage photograph of Victorian iron train shed with reglazed roof, forty freestanding market bays beneath, Bristol, before completion — structure exposed, scaffolding and site hoarding in place, ground churned and muddy. Two or three architects in hi-vis vests and hard hats stand mid-conversation over unrolled drawings, one pointing at the structure, none looking at the camera. shafts of daylight through patent glazing. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`after.webp`**

> The finished hall with all forty bays trading under the reglazed roof.

```
Completed photograph of Victorian iron train shed with reglazed roof, forty freestanding market bays beneath, Bristol, finished and in use, no construction equipment, no people or at most one distant figure for scale. Same viewpoint and focal length as the before frame. shafts of daylight through patent glazing. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-1.webp` — Freestanding bays**

> Steel tables; nothing new touches the trusses.

```
Architectural detail photograph: freestanding bays of Victorian iron train shed with reglazed roof, forty freestanding market bays beneath, Bristol. Steel tables; nothing new touches the trusses. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. shafts of daylight through patent glazing. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-2.webp` — Reglazed roof**

> Four rounds of mock-up to satisfy both standards.

```
Architectural detail photograph: reglazed roof of Victorian iron train shed with reglazed roof, forty freestanding market bays beneath, Bristol. Four rounds of mock-up to satisfy both standards. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. shafts of daylight through patent glazing. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-3.webp` — Filled rail lines**

> Flush in the slab, and they set the bay grid.

```
Architectural detail photograph: filled rail lines of Victorian iron train shed with reglazed roof, forty freestanding market bays beneath, Bristol. Flush in the slab, and they set the bay grid. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. shafts of daylight through patent glazing. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-4.webp` — Perimeter services ring**

> Every drop comes from the edge, never the span.

```
Architectural detail photograph: perimeter services ring of Victorian iron train shed with reglazed roof, forty freestanding market bays beneath, Bristol. Every drop comes from the edge, never the span. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. shafts of daylight through patent glazing. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

---

## 16. Ferrous House

`ferrous-house` · Residential · Vermont · 2024 · Built

**`before.webp`**

> The staked-out site in deep snow, with the architects and client reviewing the position of the plan.

```
Construction-stage photograph of weathering steel box on a dry-stone field-wall base, bare winter birches, deep Vermont snow, before completion — structure exposed, scaffolding and site hoarding in place, ground churned and muddy. Two or three architects in hi-vis vests and hard hats stand mid-conversation over unrolled drawings, one pointing at the structure, none looking at the camera. flat cold winter light. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`after.webp`**

> The completed steel volume on its stone base, birches bare, mid-winter.

```
Completed photograph of weathering steel box on a dry-stone field-wall base, bare winter birches, deep Vermont snow, finished and in use, no construction equipment, no people or at most one distant figure for scale. Same viewpoint and focal length as the before frame. flat cold winter light. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-1.webp` — Weathering steel**

> Nothing to paint in a house left empty for months.

```
Architectural detail photograph: weathering steel of weathering steel box on a dry-stone field-wall base, bare winter birches, deep Vermont snow. Nothing to paint in a house left empty for months. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. flat cold winter light. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-2.webp` — Field-wall base**

> Stone taken from the site's own walls.

```
Architectural detail photograph: field-wall base of weathering steel box on a dry-stone field-wall base, bare winter birches, deep Vermont snow. Stone taken from the site's own walls. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. flat cold winter light. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-3.webp` — North service wall**

> All storage, so the south wall can be glass.

```
Architectural detail photograph: north service wall of weathering steel box on a dry-stone field-wall base, bare winter birches, deep Vermont snow. All storage, so the south wall can be glass. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. flat cold winter light. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-4.webp` — Winter view**

> The reason the plan moved twice in February.

```
Architectural detail photograph: winter view of weathering steel box on a dry-stone field-wall base, bare winter birches, deep Vermont snow. The reason the plan moved twice in February. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. flat cold winter light. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

---

## 17. Granary Quarter Offices

`granary-quarter-offices` · Workplace · Dublin · 2026 · In design

**`before.webp`**

> The disused silos with the design team and structural engineer taking measurements from a cherry picker.

```
Construction-stage photograph of two retained concrete grain silos with a new glazed office floorplate threaded between them, Dublin docks, before completion — structure exposed, scaffolding and site hoarding in place, ground churned and muddy. Two or three architects in hi-vis vests and hard hats stand mid-conversation over unrolled drawings, one pointing at the structure, none looking at the camera. overcast, grey river light. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`after.webp`**

> Visualisation of the completed floorplate threaded between the retained silos.

```
Completed photograph of two retained concrete grain silos with a new glazed office floorplate threaded between them, Dublin docks, finished and in use, no construction equipment, no people or at most one distant figure for scale. Same viewpoint and focal length as the before frame. overcast, grey river light. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-1.webp` — The hundred-millimetre gap**

> Full height, both sides, structurally honest.

```
Architectural detail photograph: the hundred-millimetre gap of two retained concrete grain silos with a new glazed office floorplate threaded between them, Dublin docks. Full height, both sides, structurally honest. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. overcast, grey river light. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-2.webp` — Independent frame**

> Nothing new bears on the listed concrete.

```
Architectural detail photograph: independent frame of two retained concrete grain silos with a new glazed office floorplate threaded between them, Dublin docks. Nothing new bears on the listed concrete. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. overcast, grey river light. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-3.webp` — Breakout void**

> The gap, glazed top and bottom, on every floor.

```
Architectural detail photograph: breakout void of two retained concrete grain silos with a new glazed office floorplate threaded between them, Dublin docks. The gap, glazed top and bottom, on every floor. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. overcast, grey river light. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-4.webp` — Silo interiors**

> Still undecided; we are arguing for empty.

```
Architectural detail photograph: silo interiors of two retained concrete grain silos with a new glazed office floorplate threaded between them, Dublin docks. Still undecided; we are arguing for empty. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. overcast, grey river light. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

---

## 18. Pinewood Chapel

`pinewood-chapel` · Civic · Oregon · 2023 · Built

**`before.webp`**

> The forest clearing before construction, with the architect and carpenter setting out the east slot's orientation.

```
Construction-stage photograph of small chapel of stacked Douglas fir laid flat and pinned, single full-height slot on the east wall, Oregon forest clearing, before completion — structure exposed, scaffolding and site hoarding in place, ground churned and muddy. Two or three architects in hi-vis vests and hard hats stand mid-conversation over unrolled drawings, one pointing at the structure, none looking at the camera. equinox sunrise, low raking light. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`after.webp`**

> The finished chapel at equinox sunrise, light entering the east slot.

```
Completed photograph of small chapel of stacked Douglas fir laid flat and pinned, single full-height slot on the east wall, Oregon forest clearing, finished and in use, no construction equipment, no people or at most one distant figure for scale. Same viewpoint and focal length as the before frame. equinox sunrise, low raking light. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-1.webp` — Stacked timber wall**

> Douglas fir laid flat and pinned; no frame, no lining.

```
Architectural detail photograph: stacked timber wall of small chapel of stacked Douglas fir laid flat and pinned, single full-height slot on the east wall, Oregon forest clearing. Douglas fir laid flat and pinned; no frame, no lining. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. equinox sunrise, low raking light. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-2.webp` — East slot**

> One aperture, aligned to the equinox sunrise.

```
Architectural detail photograph: east slot of small chapel of stacked Douglas fir laid flat and pinned, single full-height slot on the east wall, Oregon forest clearing. One aperture, aligned to the equinox sunrise. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. equinox sunrise, low raking light. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-3.webp` — The room**

> Fifty seats, and most weeks nobody at all.

```
Architectural detail photograph: the room of small chapel of stacked Douglas fir laid flat and pinned, single full-height slot on the east wall, Oregon forest clearing. Fifty seats, and most weeks nobody at all. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. equinox sunrise, low raking light. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-4.webp` — Clearing approach**

> The walk in, which is half the building.

```
Architectural detail photograph: clearing approach of small chapel of stacked Douglas fir laid flat and pinned, single full-height slot on the east wall, Oregon forest clearing. The walk in, which is half the building. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. equinox sunrise, low raking light. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

---

## 19. Quarry Edge Hotel

`quarry-edge-hotel` · Hospitality · Cape Town · 2026 · On site

**`before.webp`**

> The worked-out quarry face with the geotechnical engineer and architects assessing bench stability on foot.

```
Construction-stage photograph of hotel rooms cut into the benched face of a worked-out granite quarry, Cape Town, before completion — structure exposed, scaffolding and site hoarding in place, ground churned and muddy. Two or three architects in hi-vis vests and hard hats stand mid-conversation over unrolled drawings, one pointing at the structure, none looking at the camera. hard high sun, sharp shadow on rock. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`after.webp`**

> The completed rooms occupying the cut, arrival court on the quarry floor below.

```
Completed photograph of hotel rooms cut into the benched face of a worked-out granite quarry, Cape Town, finished and in use, no construction equipment, no people or at most one distant figure for scale. Same viewpoint and focal length as the before frame. hard high sun, sharp shadow on rock. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-1.webp` — Bench rooms**

> Three levels, all within the original cut profile.

```
Architectural detail photograph: bench rooms of hotel rooms cut into the benched face of a worked-out granite quarry, Cape Town. Three levels, all within the original cut profile. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. hard high sun, sharp shadow on rock. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-2.webp` — Quarry floor court**

> Arrival on the ground the extraction left.

```
Architectural detail photograph: quarry floor court of hotel rooms cut into the benched face of a worked-out granite quarry, Cape Town. Arrival on the ground the extraction left. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. hard high sun, sharp shadow on rock. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-3.webp` — Anchor zones**

> The geotechnical report wrote a third of the plan.

```
Architectural detail photograph: anchor zones of hotel rooms cut into the benched face of a worked-out granite quarry, Cape Town. The geotechnical report wrote a third of the plan. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. hard high sun, sharp shadow on rock. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-4.webp` — Harvest tank**

> Cut into the face behind reception; the site has no water.

```
Architectural detail photograph: harvest tank of hotel rooms cut into the benched face of a worked-out granite quarry, Cape Town. Cut into the face behind reception; the site has no water. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. hard high sun, sharp shadow on rock. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

---

## 20. Alder Court Almshouses

`alder-court-almshouses` · Residential · Suffolk · 2025 · Built

**`before.webp`**

> The 1970s deck-access block before demolition, with the architects and foundation trustees walking the existing decks.

```
Construction-stage photograph of eighteen single-storey brick almshouses around a covered timber cloister facing a green, Suffolk, before completion — structure exposed, scaffolding and site hoarding in place, ground churned and muddy. Two or three architects in hi-vis vests and hard hats stand mid-conversation over unrolled drawings, one pointing at the structure, none looking at the camera. soft autumn afternoon. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`after.webp`**

> The completed cloister facing the green, late afternoon in autumn.

```
Completed photograph of eighteen single-storey brick almshouses around a covered timber cloister facing a green, Suffolk, finished and in use, no construction equipment, no people or at most one distant figure for scale. Same viewpoint and focal length as the before frame. soft autumn afternoon. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-1.webp` — The cloister**

> Wide enough to sit in, sheltered enough for February.

```
Architectural detail photograph: the cloister of eighteen single-storey brick almshouses around a covered timber cloister facing a green, Suffolk. Wide enough to sit in, sheltered enough for February. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. soft autumn afternoon. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-2.webp` — Single-storey homes**

> Eighteen front doors, all onto the same walk.

```
Architectural detail photograph: single-storey homes of eighteen single-storey brick almshouses around a covered timber cloister facing a green, Suffolk. Eighteen front doors, all onto the same walk. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. soft autumn afternoon. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-3.webp` — Adaptable bathroom**

> Reconfigurable without touching drainage.

```
Architectural detail photograph: adaptable bathroom of eighteen single-storey brick almshouses around a covered timber cloister facing a green, Suffolk. Reconfigurable without touching drainage. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. soft autumn afternoon. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

**`part-4.webp` — The green**

> What the cloister is for.

```
Architectural detail photograph: the green of eighteen single-storey brick almshouses around a covered timber cloister facing a green, Suffolk. What the cloister is for. Close, square-on framing that explains how the element is made — joints, fixings and material grain clearly legible. soft autumn afternoon. documentary architectural photography, shot on a 35mm full-frame camera with a tilt-shift lens, verticals corrected, natural available light, realistic materials with visible texture and slight weathering, muted neutral colour grade of white, warm grey and coffee brown, unpolished and true-to-life
```

---
