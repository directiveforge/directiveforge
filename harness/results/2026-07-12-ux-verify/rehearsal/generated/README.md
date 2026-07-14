# unitkit

Tiny CLI for converting between metric and imperial units.

```
unitkit 5 km in miles
5 km = 3.1069 miles
```

## Develop

- `npm run build` — compile to `dist/`
- `npm run lint` — ESLint over `src/`

No tests yet. Length and mass only; temperature is on the roadmap (`src/units.ts` has the
dimension enum ready but no temperature units — conversion is factor-based and temperature
needs offsets, so it is deliberately not wired in).

Personal side project, MIT.
