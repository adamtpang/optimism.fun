A mono, uppercase, mostly-bordered button — ghost by default, solid sky `primary` for the single key action on a view.

```jsx
<Button variant="primary" size="lg" onClick={subscribe}>subscribe →</Button>
<Button>see the receipts →</Button>
<Button variant="quiet" tone="neutral">who's funding →</Button>
```

Variants: `ghost` (hairline box, accent text — the resting default), `primary` (solid sky fill, near-black text), `quiet` (neutral border, brightens on hover). Sizes `sm | md | lg`. `tone` recolors a ghost button to a terminal signal (green/rose/violet/cyan). Press reads as a darker accent — never a scale change. Use `as="a"` + `href` for links.
