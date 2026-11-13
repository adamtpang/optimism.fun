# optimism.fun design system

Rewritten 2026-11-12 to describe the site as it is. The earlier version of this
file described a true-black terminal with a sky-blue accent, serif headlines and
em dashes. None of that is the site any more. The token files are the truth:

- `src/styles/ds/colors.css`: every color
- `src/styles/ds/typography.css`: fonts and weights
- `tailwind.config.ts`: the names components use
- `/design-system` (local only, 404 in production): everything on one screen

The older reference cards in `components/` and `_ds_manifest.json` in this folder
predate the 2026-11-01 spec. Treat them as history, not instructions.

## What the site is for

If Deutsch is the theory, Elon is the practice. We are at the beginning of
infinity, and problems, capital and talent, properly brought together, can save
the world. The site does three jobs at once:

1. Show the data, with a source on every number (the Our World in Data job).
2. Make it a picture worth sharing (the Visual Capitalist job).
3. End in a specific ask (the "Choose Good Quests" job).

The third is what makes it different. Every chart and every problem ends with
something to do.

## The look in one paragraph

Light paper, dark ink, one typeface. White canvas, a pale grey paper for panels,
hairline borders, generous space. Teal is the neutral action color. Blue marks
information. Three bold colors are reserved for the three kinds of visitor.
Everything else stays quiet so those three stand out.

## The three classes

| Class | Who | Default ask | Color |
|---|---|---|---|
| Patron | Has capital and decides where it goes | Fund this gap | Gold |
| Founder | Builds, or joins people who do | Start or join this quest | Vermilion |
| Researcher | Checks the numbers and extends what is known | Fix or extend this number | Blue |

The three get equal weight. No page ranks one above the others.

Each class has four color steps, defined in `colors.css` and exposed in Tailwind
as `patron`, `founder` and `researcher`:

| Step | Tailwind | Use |
|---|---|---|
| fill | `bg-patron` | A solid block: a button or a badge |
| on | `text-patron-on` | Text and icons placed over the fill |
| ink | `text-patron-ink`, `border-patron-ink` | The class color as text or a rule on white or paper |
| tint | `bg-patron-tint` | A soft background behind ink or body text |

Ready-made class strings live in `src/lib/visitor-classes.ts`. Use those instead
of assembling class names from strings, which Tailwind cannot see.

### Rules for class colors

1. A class color appears only on that class's call to action and its labels.
2. Never use a class color for a data series. Never use a chart color for a button.
3. Gold cannot carry white text. The patron fill takes dark text and an ink border.
4. Vermilion is close to the error red. Do not place a founder button beside an
   error message.
5. Color is never the only signal. Every class button also carries its name.

`tests/class-colors.test.ts` measures every pair and fails below 4.5:1 for text
and 3:1 for the button border.

## Color, everything else

- Action: teal 700 (`bg-primary`, `text-primary`). Links and neutral buttons.
- Information: blue (`text-info`).
- Error: `text-destructive`.
- Text: `text-ink-100` (primary) down to `text-ink-500` (labels). All text steps
  used as copy meet 4.5:1 on white.
- Surfaces: `bg-background` (white), `bg-paper` (pale grey).
- Charts: `--chart-1` to `--chart-5` and `--chart-other`, for data series only.

The site is light only. There is no dark theme.

## Type

Inter only. 14px is the smallest text anywhere. Six sizes cover every page:

| Role | Tailwind | Size / line |
|---|---|---|
| Display | `text-display-2` | 48 / 52, semibold |
| H1 | `text-h1` | 36 / 40, semibold |
| H2 | `text-h2` | 28 / 34, semibold |
| H3 | `text-h3` | 20 / 28, semibold |
| Body | `text-body` | 16 / 24 |
| Small | `text-small` | 14 / 20 |

One extra size, `text-data-xl` (48 / 52, tabular figures), is for a hero number.
`text-display-1` (64px) is allowed once per page at most, for a homepage headline.

Known drift, to be cleaned on the core pages only: many components still use the
generic Tailwind sizes (`text-2xl`, `text-4xl` and so on) and the old `font-serif`
and `font-mono` names, which now all resolve to Inter. `text-xs` and `text-sm` are
pinned to 14px, so they are harmless but should become `text-small`.

## Writing

- Plain sentences. State the finding first, then the number, then the source.
- Never use em dashes. Use commas, colons, parentheses or a new sentence.
- Every number has a source. A missing number is shown as unknown, never guessed.
- A chart's title states what the chart shows ("Loneliness is twice as common in
  low-income countries"), not its topic ("Loneliness by income").
- Buttons name the action and its object: "Fund this gap", not "Learn more".

## Components still to build (phase 2)

1. Chart frame: finding as title, the chart, a source line with links, share and
   download.
2. Infographic card: one idea, the number as the hero, sized to share, with the
   source and optimism.fun credit inside the image.
3. Class action bar: the three class buttons together, opening the commitment
   form preset for that class. A static preview is on `/design-system`.

## Accessibility floor

- Text contrast 4.5:1, large text and control borders 3:1.
- Touch targets at least 44px.
- Visible keyboard focus on every control.
- Reduced motion, reduced transparency and increased contrast are respected in
  `src/app/globals.css`.
- No horizontal scroll at 375px.
