# LearnLoop Complete System Architecture

This document outlines the foundational application architecture for LearnLoop. It is designed to be highly modular, scalable, and prepared for future expansion (like a React Native app), keeping the core philosophy of "Learn. Teach. Grow Together." at the forefront.

## 1. Scalable Folder Structure

We use a feature-driven, modular architecture within the Next.js App Router. This isolates concerns and prevents the `src/app` directory from becoming bloated.

```text
learnloop/
├── prisma/                 # Prisma schema, migrations, and seed scripts
├── prisma.config.ts        # Prisma V7 configuration
├── src/
│   ├── app/                # Next.js App Router (Purely Routing & Layouts)
│   ├── components/         # Global Shared UI Components
│   │   ├── ui/             # shadcn/ui unstyled baseline components
│   │   ├── layout/         # Root layouts (Navigation, Sidebars)
│   │   └── shared/         # Common generic components (Avatars, Cards)
│   ├── features/           # Feature Modules (The core of modularity)
│   │   ├── auth/           # Auth UI, actions, and specific hooks
│   │   ├── dashboard/      # Feed logic, widgets, layout components
│   │   ├── rooms/          # Collaborative room logic, realtime hooks
│   │   ├── squads/         # Squad management and UI
│   │   ├── profiles/       # Profile management, Learning DNA
│   │   └── core/           # Shared core business logic
│   ├── lib/                # 3rd Party Integrations & Core Utils
│   │   ├── supabase/       # SSR/Browser clients & middleware
│   │   ├── prisma.ts       # Database client singleton
│   │   ├── ai/             # AI service wrappers (OpenAI)
│   │   └── utils.ts        # Pure utility functions
│   ├── store/              # Global State (Zustand)
│   ├── types/              # Global TS Interfaces (e.g., Database types)
│   └── hooks/              # Global React Hooks
└── tailwind.config.ts
```

## 2. Frontend Architecture

**Serverless + Monolithic Frontend:** 
- **Server Components (RSC) Default:** All components are server components by default to optimize SEO, reduce bundle size, and securely fetch data directly from Prisma.
- **Client Components (`'use client'`):** Restricted strictly to the leaves of the component tree where interactivity, state (Zustand/useState), or browser APIs (Supabase Realtime) are required.
- **Data Hydration:** Initial data is fetched via RSC and passed down as props to Client Components to prevent client-side waterfall fetching.

## 3. Backend Architecture

- **Primary Backend:** Next.js Server Actions and API Routes running on Vercel's Edge/Serverless infrastructure.
- **Data Layer:** PostgreSQL (hosted on Supabase) managed entirely via Prisma ORM for type-safe database access.
- **File Storage:** Supabase Storage for user uploads (avatars, micro-teaching notes, attachments).
- **Separation of Concerns:** Database access logic is isolated in the `features/[feature]/actions.ts` files, never mixed directly inside UI components.

## 4. API Structure

- **Server Actions:** The preferred method for all standard mutations (creating a room, updating a profile, giving feedback). They provide type-safe RPC-like calls directly from client components.
- **Route Handlers (`app/api/*`):** Used only for specific scenarios:
  - Streaming AI responses (OpenAI completion streams).
  - Webhooks (e.g., Supabase Auth triggers, Stripe if added later).
  - Public external API endpoints if we expose them.

## 5. Auth Architecture

- **Provider:** Supabase Auth handling Google, GitHub, and Email/Password.
- **Session Management:** `@supabase/ssr` with Next.js Middleware (`src/middleware.ts`) to actively refresh tokens and protect routes at the edge.
- **Flow:** 
  1. User authenticates via Supabase Auth.
  2. Middleware validates session.
  3. If missing `Profile` data (name, campus, skills), the user is hard-redirected to the `/onboarding` flow.

## 6. State Management Strategy

- **Server State:** Managed by React Server Components and Next.js Router Cache. We will minimize client-side data fetching libraries (like React Query) unless specifically needed for highly dynamic, paginated data.
- **Global UI State:** Managed by **Zustand**. We will split the state into small, atomic stores:
  - `useUserStore`: Client-side cache of the logged-in user profile.
  - `useRoomStore`: Manages complex collaborative state in study rooms.
- **Form State:** `react-hook-form` paired with `zod` for robust client and server validation.

## 7. Realtime Strategy

- **Technology:** Supabase Realtime via WebSocket.
- **Implementation:** Realtime logic will be encapsulated in custom hooks inside `features/rooms/hooks/useRealtimeRoom.ts`.
- **Use Cases:**
  - **Presence:** Tracking active users in a study room.
  - **Broadcast:** Low-latency events like typing indicators, cursor positions, or whiteboard drawing.
  - **Postgres Changes:** Listening to the `Messages` table for live chat updates without manual refreshing.

## 8. AI Service Layer Structure

Isolated in `src/lib/ai/` to abstract the specific LLM provider and ensure future flexibility (e.g., moving from OpenAI to local models or Anthropic).
- `matching.ts`: AI agent that evaluates `LearningDNA`, skills, and goals to generate peer recommendations.
- `assistant.ts`: The core "Friendly Study Assistant" logic for quiz generation and concept explanation.
- `moderation.ts`: Automated quality control for micro-teaching posts and session feedback.
- `dna.ts`: Asynchronous worker logic that infers user traits based on historical session data.

## 9. Route Organization

```text
(public)
├── /                       # Landing Page
├── /login, /register       # Auth
(protected)
├── /onboarding             # Mandatory setup
├── (dashboard)             # Uses DashboardLayout
│   ├── /dashboard          # Main feed & matches
│   ├── /discover           # Search for peers/mentors
│   ├── /squads             # My squads
│   ├── /communities        # Campus hubs
│   └── /profile            # Current user settings/stats
├── /rooms                  # Room lobby
└── /rooms/[id]             # Immersive Room Layout (No sidebar)
```

## 10. Provider Structure

We will use a composite root provider in `app/layout.tsx` to keep the DOM clean.
```tsx
<AppProvider>
  <ThemeProvider>      {/* Dark mode support */}
    <AuthProvider>     {/* Supabase session context */}
      <TooltipProvider>{/* shadcn requirements */}
        {children}
      </TooltipProvider>
    </AuthProvider>
  </ThemeProvider>
</AppProvider>
```

## 11. Reusable Component Strategy

- **Atomic Design:** Base components (buttons, inputs) in `components/ui` generated by shadcn.
- **Feature Components:** Complex composites (e.g., `MatchCard`, `MicroTeachingPost`) live in `features/[feature]/components/`.
- **Aesthetics First:** We strictly enforce the "Linear + Discord + Notion" hybrid style using a robust `tailwind.config.ts` defining our calm dark mode, soft gradients, and modern spacing tokens.

## 12. Dashboard Architecture

- **Layout:** A persistent collapsible left sidebar containing primary navigation (Feed, Squads, Rooms, Communities).
- **Right Panel (Optional):** Contextual AI Assistant panel or active "Quick Help" requests.
- **Main Content:** A modular grid system that dynamically renders widgets based on the user's `LearningDNA` and current context (e.g., emphasizing upcoming squad check-ins).

## 13. Protected Routes Strategy

- **Edge Protection:** `src/middleware.ts` intercepts all requests. If a user is not authenticated, they are instantly redirected to `/login` before any server components render.
- **Onboarding Guard:** A secondary check in the root layout or middleware ensures authenticated users who haven't completed their profile are forced to `/onboarding`.
- **Data Authorization:** Row Level Security (RLS) in Supabase is our ultimate fallback, but primary authorization logic (e.g., "can user join this private squad?") will be handled in Server Actions using Prisma.

## 14. Mobile Responsiveness Strategy

- **Tailwind Breakpoints:** We design mobile-first. Default tailwind classes apply to mobile, with `md:` and `lg:` prefixes scaling up for tablets and desktops.
- **Navigation Adaptation:** The desktop sidebar collapses into a bottom navigation bar or hamburger menu on mobile devices.
- **React Native Preparation:** By keeping business logic strictly in `features/` (actions, hooks, utils) and isolating UI components, we ensure that the core logic can easily be exported via APIs to a future React Native codebase without rewriting the backend operations.

## User Review Required

> [!IMPORTANT]
> Please review this comprehensive system architecture.
> - Does this structure align with your vision for scalability and future mobile app integration?
> - Are there any other specific technical patterns or tools you want mandated before we begin building the Prisma schema and the core UI layouts?
