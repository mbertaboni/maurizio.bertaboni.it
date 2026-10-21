# maurizio.bertaboni.it

Sito personale bilingue (IT/EN), statico, generato con [Astro](https://astro.build).

- Produzione: https://maurizio.bertaboni.it
- Contenuti in Markdown, nessun CMS
- Contenuti: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) (cita la fonte)
- Analytics: GoatCounter (opzionale, senza cookie) — vedi `src/site.config.ts`

## Avvio locale

```bash
npm install
npm run dev
```

## Build / deploy

```bash
npm run build
```

Push su `main` → GitHub Actions pubblica su Pages (`.github/workflows/deploy.yml`).

## Articoli

In `src/content/writing/`. Frontmatter: `title`, `description`, `pubDate`, `language`, `draft`.

## Analytics

1. Account su [goatcounter.com](https://www.goatcounter.com)
2. In `src/site.config.ts` imposta `goatcounterCode` (es. `"maurizio"`)
3. Commit + push
