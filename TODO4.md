# RentACarMole — TODO4: Complete Thai/Portuguese Localisation

Finish translation coverage and adopt the shared `LanguageSelector` dropdown component.

## Replace LanguageSelector with shared component
Delete `src/components/LanguageSelector.tsx`. In `layout.tsx`:
```tsx
import { LanguageSelector } from "@burrowsoft/shared";
<LanguageSelector locales={["en", "th"]} />
```

## Wire SearchForm strings (if pending)
Add `useTranslations("search")` and replace hardcoded strings:
- `"Pick-up location"`, `"Drop-off location"`, `"Pick-up date"`, `"Drop-off date"`, `"Driver age"`, `"Search Cars"`, `"Return to same location"`

## Translate page-level hero
- `page.tsx` hero title/subtitle/badge/trust strips/feature cards (if still hardcoded)
- Add `hero` namespace to message files if not already there

## Verify affiliate search labels
- `AffiliateCarSearch.tsx` — title, subtitle, provider names (Booking.com, Rentalcars, Kayak, Expedia) — use `t()` calls

## Test end-to-end
1. Load page in EN
2. Switch locale dropdown to TH — verify Thai render + Sarabun font
3. Trigger a search — verify affiliate car search buttons are translated
4. Switch back to EN
5. Reload — verify cookie persists

## Fill in ThaiReports.md
Document translation coverage. Link to `API Stories/Thai.md` for later API work (RentSyst, Avis, Traveloka, etc.).

---

**API work:** See `API Stories/Thai.md` and `API Stories/Brazil.md` (start after localisation is complete).
