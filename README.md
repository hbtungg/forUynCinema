<div align="center">

```
███████╗ ██████╗ ██████╗ ██╗   ██╗██╗   ██╗███╗   ██╗
██╔════╝██╔═══██╗██╔══██╗██║   ██║╚██╗ ██╔╝████╗  ██║
█████╗  ██║   ██║██████╔╝██║   ██║ ╚████╔╝ ██╔██╗ ██║
██╔══╝  ██║   ██║██╔══██╗██║   ██║  ╚██╔╝  ██║╚██╗██║
██║     ╚██████╔╝██║  ██║╚██████╔╝   ██║   ██║ ╚████║
╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═══╝
                    C I N E M A
```

**A personal full-stack streaming platform — built from scratch, deployed to production.**

[![Next.js](https://img.shields.io/badge/Next.js_15-App_Router-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-00ED64?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v3-38BDF8?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![NextAuth](https://img.shields.io/badge/NextAuth.js-Auth-purple?style=flat-square)](https://next-auth.js.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel)](https://foruyn.vercel.app)

</div>

---

## Overview

forUyn Cinema is a production-grade movie streaming interface built with Next.js 15 App Router. It aggregates content from external film APIs, layers a full authentication system on top, and persists user data — watch history, favorites — across sessions and devices via MongoDB Atlas.

The project started as a personal gift. It evolved into a real engineering exercise: server components for data fetching, client components for interactivity, hybrid localStorage + database sync for zero-latency UX, and a cinematic dark UI designed in Tailwind from scratch.

**Live:** [foruyn.vercel.app](https://foruyn.vercel.app)

---

## Features

**Streaming & Discovery**
- Hero slider with featured films and metadata overlay
- Horizontal movie sections by genre, country, and recency
- Film detail pages with embedded player, episode navigation, and server switching
- Cinema mode — fullscreen-optimized layout for the watch page
- Related films sidebar with inline recommendations

**Account & Personalization**
- Email/password authentication via NextAuth.js Credentials Provider
- Per-user watch history with episode tracking
- Favorites list synced to MongoDB Atlas
- Hybrid storage: localStorage for instant reads, database for cross-device persistence

**Architecture**
- Next.js 15 App Router with `async` Server Components for data fetching
- Client Components isolated to interactive islands (player, search, header, drawers)
- `page.js` → `HomePageClient.js` pattern: server fetches all data in parallel, passes to client shell
- Responsive three-column layout: persistent left sidebar, scrollable center, sticky right panel
- Independent scroll regions — center scrolls, sidebar and right panel stay fixed

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | JavaScript (ES2024) |
| Styling | Tailwind CSS v3 |
| Authentication | NextAuth.js — Credentials Provider |
| Database | MongoDB Atlas (Mongoose) |
| Film API | phim.nguonc.com |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── app/
│   ├── home/
│   │   ├── page.js              # Server Component — parallel data fetching
│   │   └── HomePageClient.js    # Client shell — sidebar state, layout
│   ├── watch/[slug]/
│   │   ├── page.js              # generateMetadata + data fetch
│   │   └── WatchClient.js       # Player, episode nav, history sync
│   ├── movie/[slug]/            # Film detail page
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth route
│   │   ├── history/             # Watch history CRUD
│   │   └── favorites/           # Favorites CRUD
│   └── layout.js                # Root layout, Providers, global font
├── components/
│   ├── Header.js                # Top nav — search, notifications, user menu
│   ├── Sidebar.js               # Left nav — stateless, receives collapsed prop
│   ├── HeroSlider.js            # Featured film carousel
│   ├── MovieSection.js          # Horizontal scrollable film row
│   ├── MovieCard.js             # Film poster card with badges
│   ├── WatchPlayer.js           # iframe wrapper with loading/error states
│   ├── WatchMetadata.js         # Title, badges, action buttons, description
│   ├── WatchTabs.js             # Episodes / Info / Comments tabs
│   ├── MiniPlayerDock.js        # Fixed bottom playback bar
│   ├── RelatedMovies.js         # Related films by category
│   └── header/
│       ├── Hamburger.js
│       ├── HeaderLogo.js
│       └── MobileDrawer.js
└── lib/
    ├── mongodb.js               # Atlas connection with connection pooling
    └── movies.js                # Film API helpers
```

---

## Getting Started

**Prerequisites:** Node.js 18+, a MongoDB Atlas cluster, a running Next.js environment.

```bash
# 1. Clone
git clone https://github.com/hbtungg/forUynCinema.git
cd forUynCinema

# 2. Install
npm install

# 3. Environment
cp .env.example .env.local
```

Edit `.env.local`:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/foruyn
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
```

```bash
# 4. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Key Technical Decisions

**Server → Client data flow.** `page.js` files are async Server Components that fetch all required data in parallel with `Promise.all`, then pass it as props to Client Component shells. This keeps the data fetching fast and avoids waterfall requests on the client.

**Hybrid history sync.** Watch history writes to `localStorage` immediately (zero latency for the UI), then fires a background `fetch` to `/api/history` to persist to MongoDB. Reads come from localStorage first; the database is the fallback and cross-device source of truth.

**Sidebar state ownership.** `sidebarCollapsed` lives in the page-level Client Component (`HomePageClient`), not in `Sidebar` itself. `Header` receives an `onToggleSidebar` callback. This eliminates `window.dispatchEvent` workarounds and keeps state flow predictable.

**Independent scroll regions.** The three-column layout uses `flex h-screen` with `overflow-y-auto` on the center column only. The sidebar and right panel use `h-full` without overflow, so they stay anchored while the content scrolls.

---

## Roadmap

- [ ] Keyboard shortcuts for player control
- [ ] Continue-watching from exact timestamp (not just episode)
- [ ] Search with debounce and result preview
- [ ] Genre and country filter pages
- [ ] PWA support for mobile install

---

<div align="center">

Built by [hb.tungg](https://github.com/hbtungg) · For Thu Uyên ❤️

</div>