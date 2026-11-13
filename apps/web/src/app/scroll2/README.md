# OG scroll — shorter-copy version

`/scroll2` is an independent copy of `/scroll`. Its components live in
`components/scroll2/`, with the same models, scroll geometry, assets,
desktop handscroll and mobile wall-scroll behavior as the original.

Chapter labels, titles and descriptions total 126 words, down from 256.
Repeated media captions and decorative explanatory labels are also trimmed.
The three games, personalised fan cards, chance to win rewards, million-fan /
under-42-hour milestone, comic reveal and signup invitation are retained.

The page displays only this updated version. The before/after toggle and
original-page iframe are no longer mounted.

The bottom floating dock offers seven local visual themes: Parchment (the
original), Katana (charcoal/crimson with Anton and Barlow Condensed, based on
`/katana`), Jade (green/gold with book serifs), Noir (monochrome sans serif),
Vermilion (red/cream condensed typography), Black Rain (petrol blue, cold white,
and scarlet, using the OG rain poster), and Scorched (soot, aged cream, and
burnt orange, using the flame poster). The last two add static grain and scratch
textures without adding animation work. CSS custom properties recolor
desktop/mobile surfaces, text, clouds, menus, and media mounts. Scroll models,
timelines, geometry, assets, and chapter content are shared unchanged across
themes; switching themes does not replace the scene or media nodes. Each visit
starts in Parchment. No global theme state or other route is modified.

Dock buttons support Tab/Enter/Space, arrow keys, Home and End. Phone controls
use a compact swatch layout, with accessible names and a live selection label.

Verified all five themes on desktop and at 320px phone width: no horizontal
overflow, no title overflow on desktop, no scroll displacement or scene/canvas/
video replacement when switching. Desktop track transforms stay unchanged.
Mobile chapter menu navigation and keyboard theme switching work. TypeScript
passes; Next runtime reports no errors. The compilation check reports existing
Google Fonts network warnings, with no compilation errors.
