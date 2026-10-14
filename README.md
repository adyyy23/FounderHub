# FounderHub — Mission Control for Founders

> The operating system for founders who ship. Integrate fundraising, growth metrics, and strategic execution into a single high-fidelity command deck.

FounderHub is a portfolio SaaS project that consolidates the fragmented tools founders juggle daily — investor CRM, OKR tracking, idea management, roadmap planning, team operations, and AI-driven strategic analysis — into one unified workspace.

## Features

### Core Modules
- **Dashboard** — Real-time mission health score, runway calculation, ARR growth charts, activity feed, and A/B variant toggle
- **Investor CRM** — Full-funnel pipeline tracking (Sourced → Contacted → Interested → Negotiating → Closed), commitment tracking, notes, sentiment analysis, and contact management
- **Goals & OKRs** — Cascading objectives with key results, completion tracking, archiving, and category filtering
- **Idea Vault** — Idea backlog with ICE scoring (Impact × Confidence ÷ Effort), priority scores, and spec-level detail pages
- **Roadmap** — Strategic timeline with status tracking, priority levels, assignee management, and date filtering
- **Team** — Team member management with workload tracking, department filtering, and linked task backlogs
- **Task Backlog** — Kanban-style task board with drag-free status flow, assignee/priority/due-date management
- **Metrics** — KPI dashboard with real CSV export across 6 data dimensions, all sourced from live Supabase data
- **AI Advisor** — Contextual strategic advisor that analyzes your live data (investors, goals, ideas, roadmap, team) and provides actionable recommendations. Auto-detects Gemini API key for enhanced responses with local fallback engine

### Platform Features
- **Global Search** — Fuzzy-matched search across investors, goals, ideas, roadmap items, tasks, and team members with recent search history
- **Notification Preferences** — User-configurable notification settings persisted to database
- **Legal Pages** — Privacy Policy, Terms of Service, and Support Center
- **Dark Theme** — Premium dark UI with orange accent (#f97316), consistent 8px spacing system
- **Responsive Design** — Optimized across mobile, tablet, and desktop viewports
- **Auth** — Supabase email/password authentication with protected routes

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui components |
| Icons | Lucide React |
| Charts | Recharts |
| Routing | React Router v7 (lazy-loaded routes) |
| Backend | Supabase (PostgreSQL, Auth, RLS, Edge Functions) |
| AI | Google Gemini API (optional, auto-detected) with local fallback engine |

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
npm install
npm run dev
```

The dev server starts automatically. Open your browser to the displayed URL.

### Environment Variables

Review `src/lib/supabase.ts` and configure a Supabase project you control before using real data. The repository includes database migrations under `supabase/`. Optional:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key  # Optional — enables Gemini-powered AI responses
```

## Database Schema

FounderHub uses Supabase (PostgreSQL) with Row Level Security on every table. Owner-scoped CRUD policies ensure users only access their own data.

### Tables
- `profiles` — User profile data (name, company, role, bio, social links, avatar)
- `investors` — Investor CRM pipeline (name, firm, stage, commitment, sentiment, notes)
- `goals` — OKR objectives with completion tracking and key results
- `key_results` — Child objectives linked to goals
- `ideas` — Idea vault with ICE scoring (impact, confidence, effort, status)
- `roadmap_items` — Strategic roadmap with status, priority, assignee, dates
- `team_members` — Team roster with workload, department, status
- `tasks` — Task backlog with assignee, priority, due date, status
- `activities` — Activity log feed
- `notifications` — In-app notification center
- `notification_preferences` — User notification toggle settings
- `monthly_metrics` — ARR growth chart data (month, arr, target)
- `conversations` / `messages` — AI Advisor chat history

## Project Structure

```
src/
├── components/
│   ├── layout/          # AppLayout, Header, Sidebar
│   └── ui/              # shadcn/ui component library
├── config/
│   └── landing.ts       # Landing page content config
├── contexts/
│   └── AuthContext.tsx  # Supabase auth provider
├── hooks/
│   └── use-toast.ts     # Toast notification hook
├── lib/
│   ├── aiInsights.ts    # Data-driven insight engine
│   ├── supabase.ts      # Supabase client singleton
│   └── utils.ts         # Shared utilities
├── pages/               # 21 route pages (lazy-loaded)
├── services/            # Supabase data access layer
└── types/               # TypeScript type definitions
```

## Build

```bash
npm run build    # TypeScript check + Vite production build
npm run typecheck # TypeScript-only check
```

## License

Proprietary — FounderHub Mission Control
