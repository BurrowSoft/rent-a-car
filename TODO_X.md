# TODO_X: SEO — Google Crawlability & Structured Data

## App: rent-a-car (https://www.rentacarmole.com)

## Permissions
Run with: `claude --dangerously-skip-permissions`

## Do NOT fill a Reports file for this TODO. Just commit and push when done.

## Overview
Three SEO tasks. Do all three. Do NOT change any existing functionality, API routes, or UI.

---

## Task 1 — WebSite JSON-LD in layout.tsx

Add a `<script type="application/ld+json">` tag inside the `<body>` of`src/app/layout.tsx`.

`	sx
const WEBSITE_SCHEMA = { /* see App-specific section below */ };

// Inside the layout return, inside <body>:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA) }}
/>
`"

---

## Task 2 — hreflang alternate links

Add to the root `metadata` export in `src/app/layout.tsx`:

`	s
alternates: {
  languages: {
    "en": "https://www.rentacarmole.com",
    "th": "https://www.rentacarmole.com",
    "es": "https://www.rentacarmole.com",
    "ru": "https://www.rentacarmole.com",
    "pt-BR": "https://www.rentacarmole.com",
    "fr": "https://www.rentacarmole.com",
    "ja": "https://www.rentacarmole.com",
    "zh": "https://www.rentacarmole.com",
    "zh-TW": "https://www.rentacarmole.com",
    "ar": "https://www.rentacarmole.com",
    "de": "https://www.rentacarmole.com",
    "id": "https://www.rentacarmole.com",
    "ko": "https://www.rentacarmole.com",
    "it": "https://www.rentacarmole.com",
    "vi": "https://www.rentacarmole.com",
    "x-default": "https://www.rentacarmole.com",
  },
},
`"

---

## Task 3 — robots.ts audit

See App-specific section for exact disallow rules.

---

## App-specific: rent-a-car

### WebSite schema for Task 1

```ts
const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "RentACarMole",
  "url": "https://www.rentacarmole.com",
  "description": "Compare car rental deals from top suppliers worldwide. No hidden fees, free cancellation.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://www.rentacarmole.com/?q={pickup_location}"
    },
    "query-input": "required name=pickup_location"
  }
};
```

### robots.ts

Check `src/app/robots.ts`. Disallow: `["/api/", "/_next/"]`
The homepage (where widgets live) must remain allowed.

---

## Commit and push

```bash
git add -A
git commit -m "seo: JSON-LD structured data, hreflang, robots.txt"
git push origin master
vercel deploy --prod --yes --scope burrowsoft
```