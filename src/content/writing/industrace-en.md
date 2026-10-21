---
title: "Industrace — a CMDB for OT, before you open the wallet"
description: "Why I open-sourced a project to map industrial assets and networks, instead of pretending Excel still cuts it."
pubDate: 2025-07-24
language: "en"
draft: false
---

While preparing for the SANS GRID certification I ran into something simple and annoying: in ICS/OT, asset management is still a mess.

Solutions exist. They're often closed, expensive, designed for IT, or so vendor-locked that you end up buying the supplier's worldview along with the software.

Or there's Excel.

Excel works — until it doesn't: until someone updates the wrong cell, until the topology no longer fits in a sheet, until an audit asks “who changed what, and when,” and you're staring at `asset_v7_final_REAL.xlsx` with the face of someone who just saw a ghost.

That's how **Industrace** started.

## What it is

Industrace is an open-source CMDB (AGPL license) built for ICS and OT environments.

In plain terms: it helps you put order around assets, connections, relationships, documentation, and change — with logic that isn't “servers and laptops,” but plant, industrial network, Purdue levels, operational risk.

What you can do today:

- map assets, connections, and relationships
- visualize the network
- compute a risk index from operational parameters (location, maintenance, updates, Purdue level, and so on)
- generate printable reports (because offline, in the field, still matters)
- track changes with an audit trail
- manage multiple companies or sites (multi-tenant)
- RBAC, web UI, REST API

Stack, for those who want the details: FastAPI, Vue.js, PostgreSQL, Docker. Setup in a few minutes with demo data.

It is not “the final solution to the OT problem.” It is a concrete starting point. Usable. Improvable. Open.

## Why open source

Because if you lock it in a company drawer it becomes another tool nobody sees, nobody fixes, and nobody adapts to real cases.

Open source, here, means:

- people in the field can contribute
- each organization can adapt it to its own assets and processes
- the code can be read, audited, improved

I don't claim to be the “ultimate OT expert.” I claim to be someone who needs useful tools and decided to build one instead of complaining about the spreadsheet.

The project is supported by [BeSafe](https://www.besafe.it): there's a free community line, and a Pro direction for more enterprise needs (SSO, connectors, runbooks, and so on). But the starting point stays open.

## Who it's for (and who it isn't)

It's for anyone who wants **visibility, control, and documentation** on an industrial network without starting from scratch and without pretending a spreadsheet is a system of record.

It is not (yet) “drop it into critical production and forget about it.” On the 2.x line the advice is clear: controlled pilot, internal network, limited users, non-critical data, feedback. I'd rather say that myself before an incident says it for me.

## Where to try it

- Code: [github.com/industrace/industrace](https://github.com/industrace/industrace)
- More “official” write-up: [besafe.it/blog — Industrace](https://www.besafe.it/blog/industrace-an-open-source-foundation-for-building-visibility-and-order-in-the-ics-world/)
- Contact: industrace@besafe.it

If you try it, open an issue. Even just to say “in my world it works like this / it doesn't work at all.” For a project like this, that stuff is worth more than a hundred slides.
