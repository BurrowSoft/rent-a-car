# RentACarMole — TODO5: Adopt Shared RegionalFloatingAd + Commit TODO4

## Permissions
Ask the user to enable bypass permissions before starting: `claude --dangerously-skip-permissions`.

## Please fill in Reports5.md when done.

## Pending from TODO4 (uncommitted — verify then commit)
- `src/app/layout.tsx` — imports `LanguageSelector` from `@burrowsoft/shared`
- `src/app/page.tsx` — hero title, subtitle, feature cards translated
- `src/messages/en.json` + `th.json` — any additions
- `src/components/LanguageSelector.tsx` — DELETE this file

## Replace local LazadaFloatingAd with shared RegionalFloatingAd
Delete `src/components/LazadaFloatingAd.tsx`.

In `src/app/layout.tsx`:
```tsx
import { RegionalFloatingAd } from "@burrowsoft/shared";
<RegionalFloatingAd />
```

## Fix amadeus.ts in packages/shared
Delete `packages/shared/src/providers/flights/amadeus.ts` (was modified by TODO4 instance instead of left deleted).

## Verify end-to-end
- EN: no floating ad
- TH: Lazada ad appears, dismissible, hero page fully in Thai

## Commit and push + fill Reports5.md