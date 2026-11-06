# SRM EEE Academic Session & Advisory Communication Portal

> **Official Department Portal for Academic Advisory, Seminar Scheduling & Verified Student Email Dispatches**  
> **Faculty Principal:** Prof. of Practice Engr. Krishnavel, Senior Faculty Advisor  
> **Department:** Department of Electrical & Electronics Engineering (SRM EEE), SRM Institute of Science & Technology

---

## Overview

The **Academic Session & Advisory Communication Portal** enables faculty to schedule technical seminars, capstone advisory sessions, and departmental convocations with direct email dispatches to enrolled students and faculty members. 

It features an unslopped, academic craft UI, real-time student selection roster, automated RFC-5545 `.ics` calendar invitation generation, and a verified Google SMTP mail relay.

---

## Key Features

- **Personalized Faculty Interface:** Built for Prof. Krishnavel with institutional credentials, portrait integration, and department emblems.
- **Selective Student Dispatch:** Interactive roster allowing faculty to filter students by year, batch, or capstone group (e.g. Group 04, 09, 12), select individual students with checkboxes, or add custom external recipient email addresses.
- **Authenticated SMTP Relay:** Dispatches live HTML emails with attached iCalendar (`.ics`) invites and embedded faculty portrait signatures via authenticated Google SMTP relay (`srmeeelibraray@gmail.com`).
- **Telemetry & Logging:** Real-time delivery rate tracking, bounce logging, and audit records in `data/dispatches.json`.
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

### 2. Launch Server
Start the Express application on port 3000:
```bash
npm start
```
Development mode with live file watching:
```bash
npm run dev
```

The portal will be active at:
- **Dashboard:** [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- **Schedule Session:** [http://localhost:3000/schedule-session](http://localhost:3000/schedule-session)
- **Email Preview Dialog:** [http://localhost:3000/email-preview-confirmation-dialog](http://localhost:3000/email-preview-confirmation-dialog)
- **Email Template Inspector:** [http://localhost:3000/student-faculty-email-template](http://localhost:3000/student-faculty-email-template)
- **Session Archive History:** [http://localhost:3000/session-archive-history](http://localhost:3000/session-archive-history)
- **Faculty Login:** [http://localhost:3000/login](http://localhost:3000/login)

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
│   ├── smtp.js                 # Nodemailer transporter & relay credentials
│   └── supabase.js             # Supabase client wrapper & fallback logic
├── data/
│   ├── students.json           # SRM EEE enrolled student directory
│   ├── sessions.json           # Scheduled academic sessions & drafts
│   └── dispatches.json         # Outgoing SMTP transmission logs
├── public/
│   ├── professor_krishnavel.jpg# High-resolution faculty portrait
│   ├── shared-portal.css       # Unified design system stylesheet
│   └── shared-portal.js        # Active routing, toasts & calendar helpers
├── services/
│   └── mailer.js               # HTML email builder, .ics generator & dispatch relay
├── stitch_academic_session_communication_portal/
│   ├── professor_dashboard/    # Faculty main dashboard & metrics
│   ├── create_new_session/     # Schedule session & target student picker
│   ├── email_preview_confirmation_dialog/ # Pre-flight review modal & sender
│   ├── student_faculty_email_template/    # Responsive email canvas & inspector
│   ├── session_archive_history/# Historical session records & CSV export
│   └── professor_login_portal/ # Department authentication portal
├── server.js                   # Express server & API endpoints
├── supabase_schema.sql         # Production database schema script
├── package.json
└── README.md
```

---

## License & Attribution

Designed and maintained for **Department of Electrical & Electronics Engineering**, SRM Institute of Science and Technology.
Faculty Principal: Prof. of Practice Engr. Krishnavel.
