An instrument-like metric row: mono label, tabular value, optional confidence badge, and a literal 1px-tall colored fill.

```jsx
<ScoreBar label="welfare · bcr" value={487} max={500} color="green" format={(n) => `${n}×`} confidence="high" source="Copenhagen Consensus" />
<ScoreBar label="x-risk · itn" value={8.4} max={10} color="rose" confidence="med" />
<ScoreBar label="capital req" value={null} />
```

Pass `value={null}` for an "n/a" row. Colors map to terminal signals. Stack them inside a bordered Card for a problem's scorecard.
