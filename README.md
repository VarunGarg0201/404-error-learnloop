# ⚡️ LearnLoop

> **Learn. Teach. Grow Together.** 
> An AI-powered peer-to-peer learning ecosystem designed exclusively for students.

<br />

## 👋 Hey there!
Ever felt stuck on a concept at 2 AM, wishing you could just ask a classmate who *actually gets it*? We did too. 

**LearnLoop** isn't just another studying tool. It's a living, breathing student community where you can instantly find study partners based on your unique "Learning DNA", join live virtual study rooms, and earn reputation (Knowledge Credits) by helping others. We believe that teaching is the best way to learn, and we built LearnLoop to make that process seamless, rewarding, and fun.

---

## ✨ Features that make it magical

- 🧬 **Learning DNA & AI Matchmaking:** Our AI analyzes how you learn best and instantly connects you with peers whose teaching style perfectly complements your needs.
- 🎙️ **Live Study Rooms:** Jump into real-time collaborative spaces (focus sessions, whiteboarding, or coding) with synchronized Pomodoro timers and shared notes.
- 🛡️ **Squads & Accountability:** Form micro-communities with shared goals. Keep streaks alive, check-in daily, and hold each other accountable.
- 🏫 **Campus Communities:** Discover trending topics, join course-specific groups, and connect with people at your university.
- 💎 **Knowledge Credits (KC):** A gamified reputation system. Earn KC and trust score points by helping others, creating a culture of positive sum growth.
- 🌙 **Premium Dark-Mode First Design:** A distraction-free, hyper-polished interface built for late-night grind sessions.

---

## 🛠️ Built with modern tools

LearnLoop is built for performance and a premium user experience:
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **AI Integration:** OpenAI API

---

## 🚀 Running it locally

Want to spin up LearnLoop on your own machine? It's easy.

### Prerequisites
- Node.js (v18 or newer)
- npm or pnpm
- A Supabase account (for database & auth)

### Setup

1. **Clone the repo**
   ```bash
   git clone git@github.com:VarunGarg0201/404-error-learnloop.git
   cd 404-error-learnloop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env.local` file in the root directory and add your Supabase keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Fire it up!**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser. 

---

## 💡 The Vision
This project was built during a hackathon! Our vision for the future includes deeper AI tutoring integrations, live WebRTC video/audio rooms, and campus-wide verified leaderboards. 

<br />

<div align="center">
  <i>Built with 🤍 for students everywhere.</i>
</div>
