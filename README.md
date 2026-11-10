# Review bubbles with heart reveal

Opens with a giant word and a small glowing heart cut-out that grows on scroll to reveal a pink section. Then a messy pile of review bubbles appears; each one is read on top of the pile, then flies off with a bounce until they're scattered across the screen. On mobile the heart still plays, then the reviews pop in as an alternating, tilted stack.

### Content
A blog (e.g. `/reviews`). Title = punchy line, excerpt = full review, first tag = client name (optional). Set the **section background** to the colour you want revealed through the heart.

### Settings
Card settings as card-deck (`data-collection`, `data-max`, `data-card-colors`, `data-card-text-colors`, `data-glow*`, `data-font-name`, `data-font-url`, `data-font-weight`), plus:

| Setting | What it does |
|---|---|
| `data-headline`, `data-headline-color`, `data-headline-size` | Word behind the bubbles |
| `data-intro` | `on` = heart reveal |
| `data-intro-word`, `data-intro-bg`, `data-intro-color` | The opening word, cover colour, word colour |
| `data-heart-size` | Heart start size, % of the screen |

Tweak at the top of the script: `READ` (time on top of the pile), `STEP`, `LAND` (landed size), `SPREAD`, `TILT`, `INTRO` (heart scroll length).

### Install

Paste into **Settings → Developer tools → Code injection → Footer**:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/sq-assets/review-bubbles@main/effect.css">
<script src="https://cdn.jsdelivr.net/gh/sq-assets/review-bubbles@main/effect.js"></script>
```

After changing a file here, jsDelivr can take up to 12 hours to update the live site. To force it straight away, purge it at https://www.jsdelivr.com/tools/purge

### Code Block

```html
<div class="reviews"
  data-collection="/reviews"
  data-max="6"
  data-card-colors="#F7F7F7"
  data-card-text-colors="#111111"
  data-glow="on"
  data-glow-color="#ED6A5E"
  data-glow-strength="1"
  data-glow-size="25"
  data-headline="REVIEWS"
  data-headline-color="#FFFFFF"
  data-headline-size="fill"
  data-font-name="Coo and Miku"
  data-font-url="https://static1.squarespace.com/static/6ad0cd06bdf579679cd29712/t/6ae369a254cf1d5e365c02b1/1793288610581/CooandMiku-Normal.otf"
  data-font-weight="400"
  data-intro="on"
  data-intro-word="REVIEWS"
  data-intro-bg="#F4F4F3"
  data-intro-color="#F2AED1"
  data-heart-size="16">
</div>
```

Made by [Kill Vanilla Studio](https://www.killvanillastudio.com)
