# Psalmist Nation Tabernacle

## Design system

Glossy glass on near-black. One accent color. Do not restyle pages one by one. Change the shared UI kit in `src/components/ui/` and the global background.

### Color tokens

- `--black`: `#060608` (page background)
- `--glass-fill`: `rgba(255,255,255,0.06)`
- `--glass-border`: `rgba(255,255,255,0.14)`
- `--gold`: `#D4AF37` (buttons, focus states, links)
- `--gold-glow`: `rgba(212,175,55,0.35)`
- `--violet-glow`: `rgba(88,60,140,0.28)`

### Typography

- Poppins ExtraBold: church name, page titles, and the tagline.
- Manrope: paragraphs, nav, labels, buttons, and form fields.

### Ambient background

One fixed full-viewport layer behind everything. Two or three large, heavily blurred radial blobs: one gold (`--gold-glow`), one violet (`--violet-glow`), near opposite corners. They drift on a 60-90 second loop. This is the only continuous animation on the site.

### Glass panels

Apply to `Card` and any other panel-like surface in the UI kit:

- background: `--glass-fill`
- backdrop-filter: `blur(20px) saturate(140%)`
- border-radius: `20px`
- border-top and border-left: `1px solid --glass-border`
- border-bottom and border-right: `1px solid rgba(0,0,0,0.3)`
- a static 1px gradient highlight across the top edge

Buttons and inputs use a 12px radius so they sit on top of the glass. Primary button: solid `--gold` fill, black text. Secondary button: `--glass-fill` background, `--gold` border, gold text.

### Motion

- No per-section scroll fade-ins. Sections are visible on load.
- Home hero only: one staggered entrance the first time the page loads (logo, then heading, then tagline, then button, about 80ms apart). Nowhere else.
- Card hover: a soft light sheen moves toward the cursor. This is the only card hover, everywhere a Card appears.
- Buttons: a brief scale-down on press. No hover scale.
- Form submit success: the form panel morphs into the confirmation panel.
- Mobile nav: opens as a glass panel sliding down.
