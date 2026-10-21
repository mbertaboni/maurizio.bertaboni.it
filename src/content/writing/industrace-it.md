---
title: "Industrace — un CMDB per l'OT, prima di aprire il portafoglio"
description: "Perché ho aperto un progetto open source per mappare asset e reti industriali, invece di fingere che Excel basti ancora."
pubDate: 2025-07-24
language: "it"
draft: false
---

Durante la preparazione alla certificazione SANS GRID mi sono scontrato con una cosa banale e fastidiosa: nel mondo ICS/OT la gestione degli asset è ancora un casino.

Le soluzioni ci sono. Spesso sono chiuse, care, pensate per l'IT, o talmente legate a un vendor che ti ritrovi a comprare anche la filosofia del fornitore insieme al software.

Oppure c'è Excel.

Excel funziona, finché non funziona più: finché qualcuno non aggiorna la cella sbagliata, finché la topologia non sta più in un foglio, finché in audit ti chiedono “chi ha cambiato cosa, e quando”, e tu guardi il file `asset_v7_finale_VERA.xlsx` con l'espressione di chi ha appena visto un ghost.

Così è nato **Industrace**.

## Cos'è

Industrace è una CMDB open source (licenza AGPL) pensata per ambienti ICS e OT.

In soldoni: ti aiuta a mettere ordine su asset, connessioni, relazioni, documentazione e cambiamenti — con una logica che non è “server e laptop”, ma impianto, rete industriale, livelli Purdue, rischio operativo.

Cose che puoi fare oggi:

- mappare asset, connessioni e relazioni
- visualizzare la rete
- calcolare un indice di rischio su parametri operativi (posizione, manutenzione, aggiornamenti, livello Purdue, ecc.)
- generare report stampabili (perché offline, in campo, conta ancora)
- tracciare le modifiche con un audit trail
- gestire più aziende o stabilimenti (multi-tenant)
- RBAC, interfaccia web, API REST

Stack, per chi vuole i dettagli: FastAPI, Vue.js, PostgreSQL, Docker. Setup in pochi minuti con i dati demo.

Non è “la soluzione definitiva al problema OT”. È una base concreta. Usabile. Migliorabile. Open.

## Perché open source

Perché se lo chiudi in un cassetto aziendale diventa un altro tool che nessuno vede, nessuno corregge e nessuno adatta ai casi veri.

Open source, qui, significa:

- chi lavora in campo può contribuire
- ogni realtà può adattarlo ai propri asset e processi
- il codice si può leggere, auditarlo, migliorarlo

Non mi propongo come “esperto assoluto di OT”. Mi propongo come qualcuno che ha bisogno di strumenti utili e ha deciso di costruirne uno invece di lamentarsi del foglio Excel.

Il progetto è patrocinato da [BeSafe](https://www.besafe.it): c'è una linea community libera, e una direzione Pro per esigenze più enterprise (SSO, connettori, runbook, ecc.). Ma il punto di partenza resta aperto.

## Per chi è (e per chi no)

È per chi vuole **visibilità, controllo e documentazione** su una rete industriale senza partire da zero e senza fingere che un foglio di calcolo sia un sistema di record.

Non è (ancora) “lo butti in produzione critica e ti scordi”. Sulla linea 2.x il consiglio è chiaro: pilot controllato, rete interna, utenti limitati, dati non critici, feedback. Preferisco dirlo io prima che te lo dica un incidente.

## Dove si prova

- Codice: [github.com/industrace/industrace](https://github.com/industrace/industrace)
- Contesto e post più “ufficiale”: [besafe.it/blog — Industrace](https://www.besafe.it/blog/industrace-una-base-open-source-per-costruire-visibilita-e-ordine-nel-mondo-ics/)
- Contatti: industrace@besafe.it

Se lo provi, apri una issue. Anche solo per dire “qui nella mia realtà funziona così / non funziona mica”. Quella roba lì, per un progetto come questo, vale più di cento slide.
