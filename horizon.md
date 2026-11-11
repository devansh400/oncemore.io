# Horizon — Warm Bloom

A soft, warm wellness-inspired system built on a cream canvas, lavender calm, and apricot energy. Rounded, friendly, and tactile — no cold blues, no hard edges.

## Palette

### Canvas & surfaces

| Token | Hex | Use |
| --- | --- | --- |
| `--cream` | `#FBF8F3` | Page background |
| `--cream-deep` | `#F6EFE7` | Recessed panels |
| `--white` | `#FFFFFF` | Cards, floating bars |
| `--surface-cream` | `#FFF8F2` | Warm empty states |
| `--surface-lavender` | `#F5EFFC` | Calm secondary surfaces |
| `--surface-blush` | `#FDF0EA` | Highlight / hover surfaces |

### Lavender

| Token | Hex |
| --- | --- |
| `--lavender-50` | `#F6F1FC` |
| `--lavender-100` | `#ECE3F8` |
| `--lavender-200` | `#DCCFF0` |
| `--lavender-300` | `#C6B2E6` |
| `--lavender-400` | `#A98FD7` |
| `--lavender-600` | `#7F68B0` |
| `--plum` | `#4A3B58` |

### Apricot & blush

| Token | Hex |
| --- | --- |
| `--peach-50` | `#FFF4EC` |
| `--peach-100` | `#FFE6D6` |
| `--peach-200` | `#FBD0B4` |
| `--peach-300` | `#F8B98F` |
| `--peach-400` | `#F39D6A` |
| `--peach-500` | `#EC8A55` |
| `--coral` | `#E37B45` |
| `--apricot` | `#F6A96B` |
| `--sun` | `#F4C56C` |
| `--mint` | `#7AC6A3` |

### Text

| Token | Hex | Use |
| --- | --- | --- |
| `--text-primary` | `#3F3249` | Headings, values |
| `--text-secondary` | `#8F7F8C` | Supporting copy |
| `--text-muted` | `#B4A6AE` | Captions, meta |
| `--text-inverse` | `#FFFAF6` | Text on apricot |

## Tokens

```css
:root {
  /* Canvas & surfaces */
  --cream: #FBF8F3;
  --cream-deep: #F6EFE7;
  --white: #FFFFFF;

  /* Lavender */
  --lavender-50: #F6F1FC;
  --lavender-100: #ECE3F8;
  --lavender-200: #DCCFF0;
  --lavender-300: #C6B2E6;
  --lavender-400: #A98FD7;
  --lavender-600: #7F68B0;
  --plum: #4A3B58;

  /* Apricot & blush */
  --peach-50: #FFF4EC;
  --peach-100: #FFE6D6;
  --peach-200: #FBD0B4;
  --peach-300: #F8B98F;
  --peach-400: #F39D6A;
  --peach-500: #EC8A55;
  --coral: #E37B45;
  --apricot: #F6A96B;
  --sun: #F4C56C;
  --mint: #7AC6A3;

  /* Semantic */
  --background: var(--cream);
  --surface: var(--white);
  --surface-cream: #FFF8F2;
  --surface-lavender: #F5EFFC;
  --surface-blush: #FDF0EA;
  --surface-plum: #4A3B58;

  /* Text */
  --text-primary: #3F3249;
  --text-secondary: #8F7F8C;
  --text-muted: #B4A6AE;
  --text-inverse: #FFFAF6;

  /* Interactive */
  --accent: #EC8A55;
  --accent-strong: #E07A42;
  --accent-soft: #FFE6D6;
  --secondary: #A98FD7;

  /* Gradients */
  --gradient-sunrise: linear-gradient(135deg, #F8B98F 0%, #EC8A55 100%);
  --gradient-apricot: linear-gradient(140deg, #F9C39B 0%, #EF9159 55%, #E37B45 100%);
  --gradient-lavender: linear-gradient(150deg, #F1E9FB 0%, #DCCFF0 55%, #C6B2E6 100%);
  --gradient-dawn: linear-gradient(160deg, #FFF7EF 0%, #FDE7D8 100%);
  --gradient-aurora: linear-gradient(120deg, #F7D7AE 0%, #EFA078 45%, #C6B2E6 100%);

  /* Borders */
  --border-soft: rgba(74, 59, 88, 0.08);
  --border-warm: rgba(236, 138, 85, 0.24);

  /* Shadows */
  --shadow-soft: 0 18px 44px rgba(74, 59, 88, 0.08);
  --shadow-float: 0 12px 30px rgba(74, 59, 88, 0.1);
  --shadow-lift: 0 22px 48px rgba(236, 138, 85, 0.2);

  /* Typography */
  --font-display: "Nunito", sans-serif;
  --font-heading: "Nunito", sans-serif;
  --font-body: "DM Sans", sans-serif;

  /* Geometry */
  --radius-sm: 12px;
  --radius-md: 18px;
  --radius-lg: 28px;
  --radius-xl: 36px;
  --radius-full: 999px;
}
```

## Usage rules

- Surfaces are warm white or tinted pastels — never cool grays or blues.
- Apricot is the single action color: primary buttons, active emphasis, hero gradients.
- Lavender is calm and secondary: avatars, quiet tiles, supporting surfaces.
- Cards use 28–36px radii; buttons and pills are fully rounded.
- Shadows are warm-tinted and low opacity. Avoid hard borders — use soft rings and tinted surfaces.
- Display type is Nunito (700–800). Body and UI copy is DM Sans (400–600).
- Decorative shapes are organic blobs, not perfect circles.
- Keep one primary action per view and plenty of breathing room.
