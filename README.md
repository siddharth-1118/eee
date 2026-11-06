# SRM EEE Academic Session & Advisory Communication Portal (React + TypeScript)

> **Official Department Portal for Academic Advisory, Seminar Scheduling & Verified Student Email Dispatches**  
> **Faculty Principal:** Prof. of Practice Engr. Krishnavel, Senior Faculty Advisor  
> **Department:** Department of Electrical & Electronics Engineering (SRM EEE), SRM Institute of Science & Technology  
> **Stack:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Express, Nodemailer, Supabase

---

## Overview

The **Academic Session & Advisory Communication Portal** is a full-stack **TypeScript and React.js** web application enabling faculty to schedule technical seminars, capstone advisory sessions, and departmental convocations with direct email dispatches to enrolled students and faculty members.

It features an unslopped, academic craft UI, real-time student selection roster, automated RFC-5545 `.ics` calendar invitation generation, and a verified Google SMTP mail relay (`srmeeelibraray@gmail.com`).

---

## Key Features

- **Built with React & TypeScript:** Built with React 19, TypeScript, React Router, and Tailwind CSS.
- **Personalized Faculty Interface:** Built for Prof. Krishnavel with institutional credentials, portrait integration, and SRM EEE department badges.
- **Interactive Student Selection Roster:** Filter students by year, batch, or capstone group (e.g. Group 04, 09, 12), select individual students with checkboxes, or add custom external recipient email addresses.
- **Authenticated SMTP Relay:** Dispatches live HTML emails with attached iCalendar (`.ics`) invites and embedded faculty portrait signatures via authenticated Google SMTP relay (`srmeeelibraray@gmail.com`).
- **Telemetry & Logging:** Real-time delivery tracking, bounce logging, and audit records in `data/dispatches.json`.
- **Supabase Ready:** Includes `@supabase/supabase-js` configuration and a ready-to-execute schema in `supabase_schema.sql` for quick database sync.

---

## Quick Start

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/siddharth-1118/eee.git
cd eee
npm install
```

### 2. Build and Launch
Build the React TypeScript frontend:
```bash
npm run build
```

Start the application on port 3000:
```bash
npm start
```

Or for live development with hot module reloading (HMR):
```bash
npm run dev
```

The portal will be active at:
- **Dashboard:** [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- **Schedule Session:** [http://localhost:3000/schedule-session](http://localhost:3000/schedule-session)
- **Pre-Flight Preview:** [http://localhost:3000/email-preview](http://localhost:3000/email-preview)
- **Email Template Inspector:** [http://localhost:3000/email-templates](http://localhost:3000/email-templates)
- **Session Archive History:** [http://localhost:3000/session-archive](http://localhost:3000/session-archive)
- **Faculty Login:** [http://localhost:3000/login](http://localhost:3000/login)

---

## Hosting on Vercel

This repository is pre-configured for zero-friction Vercel deployment:
- **`vercel.json`**: Configures Vite build output and API rewrite rules.
- **`api/index.ts`**: Runs the backend Express relay as a serverless function.
- **Environment Variables (Optional / Configured in Vercel Dashboard)**:
  - `SMTP_USER` = `srmeeelibraray@gmail.com`
  - `SMTP_PASS` = `jzpvoyjarrtrpbeb`
  - `SMTP_HOST` = `smtp.gmail.com`
  - `SMTP_PORT` = `465`
  - `SUPABASE_URL` = (your Supabase URL)
  - `SUPABASE_KEY` = (your Supabase Anon Key)

### Steps to Deploy:
1. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
2. Select your repository: **`siddharth-1118/eee`**.
3. Framework Preset: **Vite** (automatically detected).
4. Build Command: `npm run build` (default).
5. Output Directory: `dist` (default).
6. Click **Deploy**!

---

## Supabase Database Integration

When setting up your Supabase project:
1. Open the [Supabase Dashboard](https://supabase.com).
2. Navigate to **SQL Editor** &rarr; **New Query**.
3. Paste and run the SQL instructions from `supabase_schema.sql`.
4. Provide the project URL and API key via environment variables:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your-anon-key
   ```
   *Note: If Supabase is not connected yet, the system smoothly falls back to local JSON storage in `data/`.*

---

## Architecture & Directory Structure

```
├── config/
│   ├── smtp.ts                 # Nodemailer transporter & relay credentials
│   └── supabase.ts             # Supabase client wrapper & fallback logic
├── data/
│   ├── students.json           # SRM EEE enrolled student directory
│   ├── sessions.json           # Scheduled academic sessions & drafts
│   └── dispatches.json         # Outgoing SMTP transmission logs
├── public/
│   └── professor_krishnavel.jpg# High-resolution faculty portrait
├── services/
│   └── mailer.ts               # HTML email builder, .ics generator & dispatch relay
├── src/
│   ├── components/
│   │   └── Header.tsx          # React header with Sir's avatar & navigation
│   ├── context/
│   │   └── ToastContext.tsx    # Global notifications toast system
│   ├── pages/
│   │   ├── DashboardPage.tsx   # Metrics & upcoming convocations
│   │   ├── ScheduleSessionPage.tsx # Session form & student picker
│   │   ├── PreviewConfirmationPage.tsx # Pre-flight review modal
│   │   ├── EmailTemplatesPage.tsx # 640px responsive mail inspector
│   │   ├── SessionArchivePage.tsx # Historical ledger & CSV export
│   │   └── LoginPage.tsx       # Faculty authentication portal
│   ├── services/
│   │   └── api.ts              # Typed API communication service
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces & definitions
│   ├── App.tsx                 # Client router & page layout
│   ├── main.tsx                # React application entry point
│   └── index.css               # Tailwind CSS & craft styling
├── server.ts                   # Express server & API endpoints (TypeScript)
├── vite.config.ts              # Vite configuration & proxy settings
├── tsconfig.json               # TypeScript compiler options
├── tailwind.config.js          # Tailwind theme configuration
├── supabase_schema.sql         # Production database schema script
├── package.json
└── README.md
```

---

## License & Attribution

Designed and maintained for **Department of Electrical & Electronics Engineering**, SRM Institute of Science and Technology.  
Faculty Principal: Prof. of Practice Engr. Krishnavel.
