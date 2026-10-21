# maurizio.bertaboni.it

Starter minimale Astro per il sito personale bilingue.

## 1. Avvio locale

Richiede una versione recente di Node.js.

```bash
npm install
npm run dev
```

Apri l'URL mostrato da Astro.

## 2. Build

```bash
npm run build
npm run preview
```

Il sito statico viene generato in `dist/`.

## 3. Pubblicazione su GitHub Pages

1. Crea un repository GitHub.
2. Copia questi file nel repository.
3. Esegui:

```bash
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin git@github.com:TUO-UTENTE/NOME-REPO.git
git push -u origin main
```

4. Su GitHub: **Settings → Pages → Source → GitHub Actions**.
5. Il workflow `.github/workflows/deploy.yml` costruisce e pubblica il sito.

Il file `public/CNAME` contiene già:

```text
maurizio.bertaboni.it
```

## 4. DNS

Dal provider DNS di `bertaboni.it`, crea il CNAME del sottodominio:

```text
maurizio  CNAME  TUO-UTENTE.github.io
```

Poi in **GitHub → repository → Settings → Pages → Custom domain**
imposta:

```text
maurizio.bertaboni.it
```

e abilita HTTPS quando disponibile.

## 5. Struttura lingue

- `/` = italiano
- `/en/` = inglese
- `/writing/` e `/en/writing/`
- `/projects/` e `/en/projects/`
- `/about/` e `/en/about/`

È volutamente esplicita: niente magia i18n finché non serve.

## 6. Articoli

Gli articoli/record stanno in:

```text
src/content/writing/
```

Esempio frontmatter:

```yaml
---
title: "Titolo"
description: "Descrizione breve"
pubDate: 2026-10-07
language: "it"
draft: false
externalUrl: "https://..."
---
```

Se un pezzo vive sul blog BeSafe, usa `externalUrl`.
Il sito personale diventa l'indice canonico del tuo lavoro senza duplicare il contenuto.

## 7. Cose da cambiare subito

- sostituisci gli URL GitHub placeholder;
- aggiungi una descrizione vera di Industrace;
- correggi/raffina il testo About;
- sostituisci l'URL finto dell'articolo AI;
- aggiungi favicon e, se vuoi, una foto molto sobria;
- aggiungi metadata Open Graph quando il contenuto inizia a circolare.

## Filosofia

Pochi file. HTML statico. Markdown. Nessun database. Nessun CMS.
La presenza deve mostrare il lavoro, non diventare un lavoro.
