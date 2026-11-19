# OnceMore — platform context

Research date: 19 November 2026.

This document explains OnceMore using the current repository, its recoverable page history, every file in the root `media/` directory, the discoverable public pages on oncemore.io, and relevant web coverage. It distinguishes observed product behavior, campaign material, company claims, and design prototypes. The local checkout and the production website are different versions of the experience.

## What OnceMore is

**OnceMore is a fan entertainment platform that partners with films, artists, sports teams, and other entertainment properties to give fans exclusive content and interactive digital experiences.** Its strongest demonstrated pattern combines participation, personalization, a reward or reveal, and something fans can keep or share.

For a fan, this means entering a world associated with entertainment they already care about, playing or answering questions, seeing their participation matter, and leaving with a personal artifact or access to exclusive material. For an entertainment partner, it means a dedicated experience around its property, with mechanics that turn release anticipation into active fan involvement. The platform's intended emotional outcome is joy, recognition, and belonging. [S1–S5]

The most useful concise description is:

> OnceMore brings fans closer to the entertainment they love through exclusive content, themed games, shared unlocks, and personalized digital experiences.

The local website expresses this through cinematic, explorable worlds. Those worlds are the presentation of the platform; its underlying proposition is the relationship between fans and the entertainment they love.

## Who it serves

### Fans

The evidence is strongest for Indian film fandom, especially the audiences of Pawan Kalyan and Samantha Ruth Prabhu. The public positioning also includes music and sport. The live homepage presents those broader categories, while its music and sports destinations are marked as forthcoming. This review did not verify active music or sports campaigns. [S1, S3]

Fans are invited to participate in a particular cultural moment: a film's launch, an exclusive reveal, a challenge, or a personalized result. Their motivation combines affection for the property, curiosity, recognition, and the chance to take part alongside other fans.

### Entertainment partners

The intended partners include film studios, filmmakers, artists, teams, and other IP owners. Here, **IP** means the entertainment property and its associated world, characters, talent, imagery, and stories.

The recurring partner proposition is a dedicated space with an experience designed around that property. Historical local homepage copy describes a collaboration process of discovering the fan moment, designing the experience, building it, and launching around the release calendar. That is useful evidence of the intended working model, although it does not establish commercial terms.

No reviewed material establishes a current public pricing model, partner dashboard, self-service campaign builder, revenue share, or standard enterprise subscription.

## The experience pattern

The campaigns suggest the following reusable structure. This is a synthesis of the evidence, rather than a claim that every campaign uses every step.

1. **An invitation tied to a recognizable property.** The film, star, story, or reveal gives fans a reason to enter.
2. **Participation.** A game, quiz, challenge, or other interaction gives the fan something meaningful to do.
3. **Identity.** Registration or a personalized output connects participation to a particular fan.
4. **Progress and payoff.** An individual result or a community milestone produces an unlock, reveal, or chance to win.
5. **A keepsake.** A named card, fan number, comic, result, or edited video makes the experience personal and shareable.
6. **A reason to return.** Campaign retrospectives invite fans to join the next experience.

OG emphasizes collective achievement. MIB emphasizes personal similarity and self-expression. Together, they show that OnceMore can use different mechanics while preserving the same fan relationship.

## Campaign example: They Call Him OG

### What the evidence shows

OnceMore's launch partnership centered on *They Call Him OG*, starring Pawan Kalyan. Local campaign pages, original screenshots, gameplay videos, the live OG retrospective, and launch coverage all support this campaign's existence.

The local story includes three samurai-themed games: **Katana, Archery, and Bushido**. The supplied videos show blade play, bow-and-target play, and a challenge using the virtues Courage, Justice, and Respect. They situate fans inside the film's Japanese visual world.

The campaign paired those activities with a collective reveal of **OG: The First Blood**, a comic exploring the character's earlier story. Original screenshots show a public counter and a progressively revealed poster. Local retrospectives describe verified registrations uncovering the image pixel by pixel. The live experience confirms a shared comic unlock and personalized Fire Cards. [S2]

Fans received cards with their names and individual participation numbers or fan codes. The three original card examples in `media/project01/` visibly contain different fan names and numbers. This makes the souvenir a record of participation, rather than generic promotional artwork.

### Important distinctions

- The current local `/og-page` is a **retrospective**, with an animated car reveal and archived gameplay. Its signup invitation concerns future OnceMore experiences.
- The cinematic car sequence is website presentation material. It is separate from the original three-game campaign mechanic.
- Some launch articles describe scores contributing to the collective goal, while local copy emphasizes registrations. The reviewed sources do not establish the exact backend formula. Describe the shared participation-driven unlock confidently; attribute a precise formula to its source.
- Local pages describe a historical chance to win rewards, including tickets. Do not promise a prize for every participant or imply the event is currently running.
- At review time, the live `/summary` page announced that the comic was unlocked but its link would be made available later. The live `OPEN COMIC` action returned this unauthenticated browser to the homepage. This review therefore does not establish that visitors can currently download the complete comic.

### Reported response

The founder reported one million registrations, 1.9 million visitors in 48 hours, participation from more than 60 countries, a 32% referral share, and no marketing spend. These are first-party launch claims. [S4]

October 2025 coverage also reported the million-registration milestone in 42 hours. One article places the 1.9 million visitor figure in that shorter window. Preserve that timing difference instead of combining all the figures into one independently verified metric. [S6, S7]

The repository and press establish strong evidence of a large launch response. They do not provide access to analytics, retention, current active users, or an independent audit. A historical registration milestone should not be presented as today's active audience.

## Campaign example: Maa Inti Bangaaram

### What the supplied material shows

MIB, short for *Maa Inti Bangaaram*, is a second film-centered campaign represented by substantial local material: posters, a quiz screenshot, match cards, a personality result, personalized videos, collaboration artwork, and several page versions.

The central interaction compares fans' choices with Samantha's answers. The quiz screenshot identifies question 1 of 15 and shows a choice between money and time. The local case studies describe the same fifteen-choice format.

The payoff has several layers:

- A **Samantha match score**. Four gold card examples show 67%, 71%, 70%, and 67%.
- A **personality result**. The supplied Harika screen labels the result “Rising Legend.”
- A **personal fan card** incorporating the fan into the film's visual treatment.
- A **personalized hero-reveal video**. Sampled endings show MSD, Surya, and Vicky, with outputs including “Sharp Strategist” and “Silent Warrior.”
- A **chance to win rewards**, described in local copy as including film tickets.

The supplied percentages are individual examples. The separate `top score.jpg` shows 72%; it is not a conversion rate, an engagement rate, or a platform-wide performance statistic.

The videos share a cinematic reveal structure but change the fan name and result. This demonstrates personalized outputs; the files alone do not establish whether production generation used AI, templates, compositing, or a combination.

### Evidence status

The current `/mib-page` and its longer archived counterpart explicitly present the launch as concluded. Their closing asks visitors to join future experiences.

The local README says the one-million-player figure came from the project owner. It is a **repository claim**, with a different evidence basis from OG's publicly reported launch registrations. No independent verification of MIB's player total was found in this review.

A search-indexed mirror of OnceMore's social account also references a Samantha/MIB hero reveal. That provides supporting public context but is a secondary mirror, not a direct inspection of the original post. [S10]

The public homepage reviewed here exposed OG; it did not expose a working MIB destination. Local campaign material should therefore be described as local evidence, without implying the MIB flow is currently available on production.

## The role of AI

OnceMore publicly positions itself as an AI entertainment platform. Founder and company descriptions include AI-driven fan experiences, and coverage discusses character interaction and a planned orchestration layer for dialogue, simulation, and visual generation. [S3, S4, S7]

There are three different kinds of evidence to keep separate:

| Evidence | What it establishes |
| --- | --- |
| Company positioning and coverage | AI is part of the platform's stated direction; some capabilities were described as plans or development work. |
| Campaign artifacts | Personalized cards, results, and videos exist. Their complete production pipeline is not visible here. |
| Repository generation notes | Some website illustrations, character layers, and a MIB key pose were generated or edited with image-generation tools during site development. |

The generated OG2 illustrations are documented as creative interpretations for the website. They are not original campaign screenshots or film stills. Likewise, a generated animation asset does not demonstrate that fans have a live AI conversation feature.

The January 2026 legal pages additionally describe permission-based Gmail/YouTube data use for personalized summaries or rewinds. This broadens the documented service scope, but no corresponding working rewind interface was verified. Treat it as a policy-described capability, with availability unresolved. The privacy policy also states that personal data is not used to train models. These are published policy statements, not findings from a technical privacy audit. [S8, S9]

## What the local website represents

The repository is an evolving marketing and interaction-design project. It contains campaign storytelling, world-navigation concepts, visual identity studies, and account-interface prototypes.

### Platform expression

The current local `/` serves Floating Worlds: a sky containing five floating destinations. OG and MIB occupy two concepts; three are labeled as future worlds. The current bundle gives the islands `href: null`, so their enter behavior leads to an in-page placeholder rather than wired campaign destinations.

This world-navigation metaphor expresses an expandable home for different entertainment properties. It does not establish five active partnerships. The sky settings panel and six atmosphere presets are design controls, not product tiers.

### Visual and verbal direction

The brand pages describe a world beyond the frame: cinematic scale combined with personal participation. They favor invitations, belonging, warmth, and concrete language. The original identity uses a dark midnight, light cloud, and warm afterglow palette; the six alternate looks explore atmosphere rather than separate products.

The campaign identities remain distinct: OG uses samurai imagery, ink, dark blues, parchment, and vermilion; MIB uses crimson, antique gold, ivory, condensed typography, and personal hero imagery. The platform can provide continuity while allowing each entertainment world its own visual character.

### Prototypes and historical material

The Little Office pages stage signup as a playful encounter with Pip. Their code uses a demo OTP, simulated timers, and no SMS delivery; the interface labels the experience as a demo. The profile pages use a fixed example identity, empty experience counts, and a draggable souvenir pass. They demonstrate an intended account experience, not a verified production account system.

The removed homepage, recovered from Git, offered a more partner-facing account of interactive worlds, exclusive content, AI moments, and launch collaboration. Its capabilities describe intended positioning, not proof that every advertised capability shipped.

## Company, scope, and commercial facts

The public legal pages identify the operator as **Nplus Labs Bharat Pvt Ltd**. Company and founder sources identify **Akash Mamidi** as the founder, with Vijayawada as the company's location. [S3–S5, S8, S9]

Launch coverage names Unshackled Ventures, Cherubic Ventures, TA Ventures, and Sketchnote Venture Partners among pre-launch backers. Treat this as reported historical funding information; this review did not verify the financing documents, amount, valuation, or current capitalization. [S6, S7]

The strongest business inference is a partnership-led platform: entertainment properties supply the audience context and story, and OnceMore supplies interactive experiences and fan participation. Contracts, rights arrangements, monetization, current paid plans, and unit economics remain unverified.

## Guidance for describing OnceMore accurately

Use these principles when writing future pages, pitches, briefs, or product requirements:

- Lead with fans, recognizable entertainment, and a concrete activity or payoff.
- Explain personalization through observable examples: a name, a fan number, a match result, a card, or an edited reveal.
- Describe a shared unlock as a community achievement; distinguish it from an individual quiz result.
- Attribute numerical campaign claims and preserve their date and measurement window.
- Present completed events in the past tense. Current signup CTAs should clearly concern future opportunities unless a campaign is confirmed live.
- Describe music, sports, character AI, rewinds, and other broader capabilities according to their actual evidence and availability.
- Keep prototype interactions, generated site artwork, and campaign records distinguishable.

Unresolved questions include the current active campaign catalog, MIB's independently measured reach, the precise unlock formula, the availability of AI character interaction and rewind features, and the commercial model. They do not prevent a clear account of the demonstrated platform: themed participation, exclusive content, personal artifacts, and community moments around entertainment.

## Review inventory: local pages and history

All 29 current local page URLs were opened. Review also included source copy across 104 TypeScript/TSX files, campaign READMEs, the two standalone HTML experiences, the routing configuration, and recoverable historical page paths. Browser captures document entry states; source inspection supplied content hidden behind animation or chapter selection. This was a context review, not exhaustive interaction QA of every animation state or a re-execution of every historical revision.

| Current local route | Earlier route, where changed | Role in understanding OnceMore |
| --- | --- | --- |
| `/` | Previous root homepage removed | Floating Worlds landing; the removed partner-facing homepage was reviewed from Git. |
| `/archive/floating-worlds` | `/floating-worlds` | Current sky-navigation concept, also used at `/`. |
| `/archive/floating-worlds-old` | `/floating-worlds-old` | Earlier sky-navigation version. |
| `/mib-page` | `/mib2` | Concise MIB campaign retrospective. |
| `/og-page` | `/og-car` | OG campaign retrospective with cinematic car reveal. |
| `/archive/katana` | `/katana` | OG story, 3D blade presentation, games, card, milestone, comic. |
| `/archive/maa-inti-bangaaram` | `/maa-inti-bangaaram` | Longer MIB retrospective and personalized-result examples. |
| `/archive/mib` | `/mib` | Early MIB rifle/projectile cinematic study. |
| `/archive/mib-compare` | `/mib-compare` | Internal comparison of two MIB presentations. |
| `/archive/og-compare` | `/og-compare` | Internal comparison of OG handscroll versions. |
| `/archive/og2` | `/og2` | Illustrated OG story using documented generated artwork. |
| `/archive/scroll` | `/scroll` | Longer OG handscroll retrospective. |
| `/archive/scroll2` | `/scroll2` | Concise OG handscroll and alternate visual themes. |
| `/archive/oncemore` | `/oncemore` | Crystallized wordmark motion study. |
| `/archive/oncemore2` | `/oncemore2` | Crystallized-to-elastic wordmark study. |
| `/archive/squish` | `/squish` | Draggable elastic wordmark experiment. |
| `/archive/squish2` | `/squish2` | Alternate elastic wordmark experiment. |
| `/archive/transition` | `/transition` | Light-tunnel transition study. |
| `/archive/signup` | `/signup` | Pixel-art Little Office signup demo. |
| `/archive/signup-3d` | `/signup-3d` | 3D Little Office signup demo. |
| `/archive/profile` | `/profile` | Example account, experience library, and souvenir interface. |
| `/archive/profile2` | `/profile2` | Alternate account layout with five color themes. |
| `/design/brand` | `/brand` | Base brand foundations, voice, identity, tokens, and applications. |
| `/design/brand-artwork` | `/brand-artwork` | Artwork-led identity variation. |
| `/design/brand-blue-hour` | `/brand-blue-hour` | Blue-hour identity variation. |
| `/design/brand-bright` | `/brand-bright` | Bright identity variation. |
| `/design/brand-dusk` | `/brand-dusk` | Dusk identity variation. |
| `/design/brand-golden-hour` | `/brand-golden-hour` | Golden-hour identity variation. |
| `/design/brand-storm` | `/brand-storm` | Storm identity variation. |

Git history contained the corresponding pre-reorganization paths and the deleted original root page. No additional distinct historical page path was found in the available history scan. This does not claim access to deleted remote branches, other repositories, or unrecorded deployments.

## Review inventory: production website

Production was reviewed in an unauthenticated browser. Discovery used visible navigation, the sitemap, search results, public client route references, and the historical URLs visible in supplied screenshots.

| Production page or state | Observation |
| --- | --- |
| `https://oncemore.io/` | Entertainment-category homepage; OG entry; music/sport marked forthcoming. |
| Homepage `Join Now` dialog | Name, phone number, country selector, and agreement checkbox. No personal information submitted. |
| `https://oncemore.io/experience/?card=1` | Public OG retrospective: participation milestone, shared comic unlock, Fire Card, future signup. |
| Experience `OPEN COMIC` action | Returned the unauthenticated browser to `/`; complete comic access not verified. |
| `https://oncemore.io/summary` | Public comic-unlocked notice with a message that access would be announced later. |
| `https://oncemore.io/privacy-policy` | Policy dated 23 January 2026; operator, data practices, and personalized entertainment scope. |
| `https://oncemore.io/terms-of-service` | Terms dated 23 January 2026; operator and broad AI entertainment description. |
| `https://oncemore.io/robots.txt` | Allows crawling and identifies the sitemap. |
| `https://oncemore.io/sitemap.xml` | Listed only the homepage, last modified 20 September 2025. |
| `/phone-entry`, `/name-entry`, `/landing` | Referenced in public client code but returned 404 when opened directly. |

These are the discoverable public pages and states reviewed, not a claim to have enumerated every route on the production server. The sitemap is incomplete for that purpose; authenticated, unlinked, retired, or otherwise undiscoverable screens remain outside verified coverage.

## Sources and how to use them

Local source paths below are repository-relative so the document remains portable. Production and article links are stable references rather than search-result snippets. Sources were accessed or searched on the research date above.

### First-party public sources

- **S1 — [OnceMore homepage](https://oncemore.io/):** current public categories and signup entry.
- **S2 — [OG experience](https://oncemore.io/experience/?card=1) and [fan summary](https://oncemore.io/summary):** directly observed campaign retrospective and access state.
- **S3 — [OnceMore company profile](https://in.linkedin.com/company/oncemore-io):** company-authored positioning, mission, and location.
- **S4 — [Akash Mamidi launch statement](https://www.linkedin.com/posts/akash-mamidi_we-broke-chatgpts-record-and-crossed-1-million-activity-7387051684822224896-DVRH):** founder's motivation, partner categories, and self-reported launch metrics.
- **S8 — [Privacy policy](https://oncemore.io/privacy-policy):** published data and personalized-feature scope; not an independent compliance assessment.
- **S9 — [Terms of service](https://oncemore.io/terms-of-service):** legal operator and broad service description; payment clauses do not prove a current subscription product.

### External coverage and supporting discovery

- **S5 — [Crunchbase company profile](https://www.crunchbase.com/organization/oncemore):** supporting founder/operator context. Directory estimates, traffic figures, and projected IT spend were not used as verified business metrics.
- **S6 — [Times of India / etimes.in, 8 October 2025](https://timesofindia.indiatimes.com/oncemore-io-sets-global-benchmark-reaches-one-million-users-in-just-42-hours/articleshow/124394266.cms):** launch, OG participation, growth, and reported backing. Promotional language and record comparisons require attribution.
- **S7 — [Voice&Data, 13 October 2025](https://www.voicendata.com/business-services/oncemoreio-reaches-one-million-users-within-42-hours-of-launch-10556043):** partner model, launch mechanics, and technology direction. Development plans are not current feature verification.
- **S10 — [Indexed mirror of @oncemore_io](https://instalker.org/oncemore_io):** supporting OG and MIB social references; secondary reproduction with uncertain relative dates.
- [VentureBeat contributor article](https://venturebeat.com/business/oncemore-io-reaches-one-million-users-in-less-than-2-days): contributor coverage; not an independent analytics audit.
- [The Week wire item, 9 October 2025](https://www.theweek.in/wire-updates/business/2025/10/09/dcm89-oncemore.io.html): discovered through search; full-page retrieval failed, so not relied upon for additional facts.
- [Devdiscourse launch item, 9 October 2025](https://www.devdiscourse.com/article/technology/3658003-oncemoreio-the-fastest-growing-entertainment-platform): brief launch coverage; overlapping reports should not be counted as independent measurement.

Search also surfaced traffic-estimation sites, automated reputation pages, and trademark aggregators. These did not add reliable evidence of product functionality, active audience, revenue, or rights ownership and were not used to establish those facts.

### Key repository sources

- `apps/web/src/app/og-page/og-story.tsx` and `README.md`.
- `apps/web/src/components/katana/story-content.ts`.
- `apps/web/src/components/scroll/scroll-copy.ts` and `scroll2/scroll-copy.ts`.
- `apps/web/src/app/mib-page/case-study.tsx` and `README.md`.
- `apps/web/src/app/archive/maa-inti-bangaaram/case-study.tsx`.
- `apps/web/src/app/archive/signup/signup-experience.tsx` and the 3D counterpart.
- `apps/web/src/app/archive/profile/page.tsx` and `profile2/page.tsx`.
- `apps/web/src/app/design/brand/brand-book.tsx` and `brand-themes.ts`.
- `apps/web/public/floating-worlds/index.html`, `app.js`, and the older standalone version.
- Historical `apps/web/src/app/page.tsx`, `src/lib/projects.ts`, and the former homepage sections, read from Git without restoring them.
- The complete root `media/` inventory below, including generation/provenance READMEs.

## Review inventory: every root media file

The root `media/` directory contained **69 files: 58 images, 8 videos, 1 GLB model, and 2 provenance READMEs**. Every image was visually inspected in labeled contact sheets. All eight videos were decoded and inspected at multiple timestamps, with additional late frames for the personalized reveals; this was not a full audio transcription or frame-by-frame forensic review. The GLB's scene/mesh structure was inspected, along with its use in the katana presentation. Both READMEs were read.

The table records each file's role. An image's presence establishes an available artifact, not its licensing status, campaign performance, or production-generation method.

| File relative to `media/` | Type | Reviewed role |
| --- | --- | --- |
| `c0866b59-00c8-4a17-8740-412d16c03054.png` | Image | Floating-worlds concept artwork: cloud roads, distinct islands, eclipse; platform world-navigation reference. |
| `katana.glb` | 3D model | 3D katana presentation asset; GLB inspection found 37 meshes. A website scene asset, not campaign-usage analytics. |
| `mib/raised-pose-source.png` | Image | Edited raised-rifle key pose. Local provenance identifies an image-generation edit from the opening artwork. |
| `project01/arrow-gameplay.mp4` | Video | Archery gameplay recording: bow and target in a Japanese courtyard. |
| `project01/bushido-gameplay.mp4` | Video | Bushido gameplay recording with Courage, Justice, and Respect scrolls. |
| `project01/event-archive/comic-unlocked-mobile.jpg` | Image | Historical mobile OG screen announcing the unlocked comic and a later access link. |
| `project01/event-archive/firestorm-launch-desktop.jpg` | Image | Historical Firestorm launch screen with live counter and start control. |
| `project01/event-archive/first-blood-poster.jpg` | Image | Portrait First Blood comic-cover artwork. |
| `project01/event-archive/million-fans-milestone.jpg` | Image | Campaign milestone artwork showing 1,000,000 fans joined. |
| `project01/event-archive/poster-reveal-0000149.jpg` | Image | Early pixel-mosaic reveal screenshot with count 149 and invite/card controls. |
| `project01/event-archive/poster-reveal-1000124.jpg` | Image | Later pixel reveal screenshot with count 1,000,124; browser shows the summary route. |
| `project01/event-archive/poster-reveal-1002545.jpg` | Image | Later pixel reveal screenshot with count 1,002,545 and invite/card controls. |
| `project01/katana-gameplay.mp4` | Video | Katana gameplay recording with blade interaction and cut targets. |
| `project01/og comic/wallpaperflare.com_wallpaper (1).jpg` | Image | Supplied comic panel with a small swordsman facing an enormous crimson dragon. |
| `project01/og comic/wallpaperflare.com_wallpaper (2).jpg` | Image | Supplied comic panel: chained sword/dragon imagery and awakening narration. |
| `project01/og comic/wallpaperflare.com_wallpaper (3).jpg` | Image | Supplied comic panels with military characters, aircraft, and dialogue. |
| `project01/og comic/wallpaperflare.com_wallpaper (4).jpg` | Image | Supplied battle panels with gunfire, soldiers, and tanks. |
| `project01/og comic/wallpaperflare.com_wallpaper (5).jpg` | Image | Supplied character and aircraft panels with waiting/return dialogue. |
| `project01/og comic/wallpaperflare.com_wallpaper (6).jpg` | Image | Supplied red/blue sword-battle panels with fallen opponents. |
| `project01/og comic/wallpaperflare.com_wallpaper (7).jpg` | Image | Supplied combat panels showing heavy weapons and an explosion. |
| `project01/og comic/wallpaperflare.com_wallpaper (8).jpg` | Image | Supplied panels with crimson silhouettes and a sword confrontation. |
| `project01/og comic/wallpaperflare.com_wallpaper (9).jpg` | Image | Supplied naval/combat panel with an explosion and smoke. |
| `project01/og comic/wallpaperflare.com_wallpaper.jpg` | Image | Supplied comic-panel art: protagonist, crimson dragon, and surrounding story panels. |
| `project01/og-first-blood-poster.png` | Image | Landscape First Blood illustration used in the local story presentation. |
| `project01/og2-generated/archery-hero.png` | Image | Generated transparent archer character layer for the illustrated OG2 website. |
| `project01/og2-generated/archery-world.png` | Image | Generated bamboo/target landscape for the OG2 archery scene. |
| `project01/og2-generated/bushido-hero.png` | Image | Generated airborne martial-arts character layer. |
| `project01/og2-generated/bushido-virtues.png` | Image | Generated Courage, Justice, and Respect scroll layer, informed by the game. |
| `project01/og2-generated/bushido-world.png` | Image | Generated mountain courtyard and bridge landscape with a dragon sky. |
| `project01/og2-generated/cards/card-1-background.png` | Image | Generated/edited clean background plate derived from original OG card 1; website animation layer. |
| `project01/og2-generated/cards/card-1-portrait.png` | Image | Extracted/reconstructed transparent portrait derived from original OG card 1; website animation layer. |
| `project01/og2-generated/cards/card-2-background.png` | Image | Generated/edited clean background plate derived from original OG card 2; website animation layer. |
| `project01/og2-generated/cards/card-2-portrait.png` | Image | Extracted/reconstructed transparent portrait derived from original OG card 2; website animation layer. |
| `project01/og2-generated/cards/card-3-background.png` | Image | Generated/edited clean background plate derived from original OG card 3; website animation layer. |
| `project01/og2-generated/cards/card-3-portrait.png` | Image | Extracted/reconstructed transparent portrait derived from original OG card 3; website animation layer. |
| `project01/og2-generated/cards/README.md` | README | Provenance for generated/edited card plates and extracted portraits from the three original cards. |
| `project01/og2-generated/dragon.png` | Image | Generated transparent crimson dragon layer. |
| `project01/og2-generated/foreground.png` | Image | Generated decorative landscape foreground layer. |
| `project01/og2-generated/katana-hero.png` | Image | Generated transparent sword-action character layer. |
| `project01/og2-generated/katana-world.png` | Image | Generated rain-soaked temple courtyard and red-moon landscape. |
| `project01/og2-generated/README.md` | README | Provenance for nine AI-generated website illustrations; explicitly distinguishes them from production stills. |
| `project01/og_card_1.png` | Image | Original named OG fan card: Harshini, fan code, protagonist, dragon backdrop. |
| `project01/og_card_2.png` | Image | Original named OG fan card: Vishalakshi, fan code, red/ivory treatment. |
| `project01/og_card_3.png` | Image | Original named OG fan card: Sudeep, fan code, blue-map treatment. |
| `project01/OG_Cover-(1)-94700e80-99fe-11f0-ac4b-214fd687b09d.webp` | Image | Theatrical OG artwork with the seated protagonist and fire. |
| `project01/poster01 clean.webp` | Image | Clean version of the rain-and-gun artwork for compositing. |
| `project01/poster01.jpg` | Image | Theatrical rain-and-gun OG poster with title and release lettering. |
| `project01/They-CAll-Him-OG.jpg` | Image | OG title lettering on a dark background. |
| `project01/video-to-animation.mp4` | Video | Covered-car reveal and orbit sequence; source for cinematic OG website presentation. |
| `project02/alt title card.jpg` | Image | Alternate Telugu MIB title treatment over a crimson character backdrop. |
| `project02/card.jpg` | Image | Gold individual MIB match-card example: 67%, with an unfilled/silhouette fan position. |
| `project02/card02.jpg` | Image | Gold personalized MIB match-card example: 71%, with fan portrait. |
| `project02/card03.jpg` | Image | Gold personalized MIB match-card example: 70%, with fan portrait. |
| `project02/card04.jpg` | Image | Gold personalized MIB match-card example: 67%, with fan portrait. |
| `project02/fan vid (1).mp4` | Video | Personalized hero-reveal video: MSD name appears in sampled late frames. |
| `project02/fan vid (2).mp4` | Video | Personalized hero-reveal video: Surya; Sharp Strategist result in sampled ending. |
| `project02/fan vid (3).mp4` | Video | Personalized hero-reveal video: Vicky; Silent Warrior result in sampled ending. |
| `project02/fan vid high res.mp4` | Video | Higher-resolution Surya reveal; Sharp Strategist result in sampled ending. |
| `project02/gun image.jpg` | Image | Illustrated Samantha/rifle artwork for cinematic scene development. |
| `project02/mib card.jpg` | Image | Mobile personal-result screen for Harika: Rising Legend, with share/continue controls. |
| `project02/muzzle flash.jpg` | Image | Rifle muzzle and flame visual-effects reference. |
| `project02/oncemore x mib.jpg` | Image | Explicit OnceMore × Maa Inti Bangaaram collaboration lockup. |
| `project02/poster01.jpg` | Image | MIB character poster contrasting domestic and armed character imagery. |
| `project02/poster02 clean.png` | Image | Clean Samantha/rifle portrait on crimson background; opening scene source. |
| `project02/poster02.jpg` | Image | Samantha/rifle portrait with English film-title lettering. |
| `project02/quiz.jpg` | Image | Campaign quiz screenshot: question 1 of 15, money-or-time choice. |
| `project02/Realistic Double-Barrel Shotgun Product Render.png` | Image | Isolated shotgun product render for visual/scene development. |
| `project02/title card.jpg` | Image | English MIB title treatment over a crimson character backdrop. |
| `project02/top score.jpg` | Image | Top-score screen showing 72%; an example quiz result, not a business KPI. |
