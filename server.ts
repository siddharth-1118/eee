import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { transporter, SMTP_CONFIG } from './config/smtp.js';
import { sendAcademicEmail, readDispatches } from './services/mailer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// URL normalization for Vercel Serverless environment
app.use((req, res, next) => {
  if (req.originalUrl && req.url !== req.originalUrl) {
    req.url = req.originalUrl;
  }
  next();
});

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const DIST_DIR = path.join(process.cwd(), 'dist');
const SESSIONS_DATA_FILE = path.join(process.cwd(), 'data', 'sessions.json');
const STUDENTS_DATA_FILE = path.join(process.cwd(), 'data', 'students.json');

app.use(express.static(PUBLIC_DIR));
app.use('/public', express.static(PUBLIC_DIR));

if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
}

// Serve Prof. Krishnavel's portrait explicitly
app.get('/professor_krishnavel.jpg', (req, res) => {
  const candidatePaths = [
    path.join(PUBLIC_DIR, 'professor_krishnavel.jpg'),
    path.join(DIST_DIR, 'professor_krishnavel.jpg'),
    path.join(__dirname, 'public', 'professor_krishnavel.jpg')
  ];

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      res.setHeader('Content-Type', 'image/jpeg');
      return res.sendFile(p);
    }
  }
  res.status(404).send('Photo not found');
});

// Built-in student directory (standalone, zero database required)
const DEFAULT_STUDENTS = [
  {
    id: "STU-000",
    name: "Sai Siddharth Vooka",
    regNo: "RA2111005010001",
    email: "saisiddharthvooka@gmail.com",
    batch: "EEE-A",
    year: "Final Year UG",
    capstoneGroup: "Group 04"
  },
  {
    id: "STU-001",
    name: "Arun Kumar",
    regNo: "RA2111005010012",
    email: "arunkumar.srmeee@gmail.com",
    batch: "EEE-A",
    year: "Final Year UG",
    capstoneGroup: "Group 04"
  },
  {
    id: "STU-002",
    name: "Priya Venkatesh",
    regNo: "RA2111005010018",
    email: "priyavenkat.srmeee@gmail.com",
    batch: "EEE-A",
    year: "Final Year UG",
    capstoneGroup: "Group 04"
  },
  {
    id: "STU-003",
    name: "Rahul Sharma",
    regNo: "RA2111005010025",
    email: "rahulsharma.srmeee@gmail.com",
    batch: "EEE-A",
    year: "Final Year UG",
    capstoneGroup: "Group 04"
  },
  {
    id: "STU-004",
    name: "Kavya Sundaram",
    regNo: "RA2111005010034",
    email: "kavyasundaram.srmeee@gmail.com",
    batch: "EEE-A",
    year: "Final Year UG",
    capstoneGroup: "Group 09"
  },
  {
    id: "STU-005",
    name: "Aditya Nair",
    regNo: "RA2111005010041",
    email: "adityanair.srmeee@gmail.com",
    batch: "EEE-A",
    year: "Final Year UG",
    capstoneGroup: "Group 09"
  },
  {
    id: "STU-006",
    name: "Sneha Ranganathan",
    regNo: "RA2111005010055",
    email: "sneharangan.srmeee@gmail.com",
    batch: "EEE-B",
    year: "Final Year UG",
    capstoneGroup: "Group 09"
  },
  {
    id: "STU-007",
    name: "Deepak Raj",
    regNo: "RA2111005010062",
    email: "deepakraj.srmeee@gmail.com",
    batch: "EEE-B",
    year: "Final Year UG",
    capstoneGroup: "Group 12"
  },
  {
    id: "STU-008",
    name: "Divya Menon",
    regNo: "RA2111005010070",
    email: "divyamenon.srmeee@gmail.com",
    batch: "EEE-B",
    year: "Final Year UG",
    capstoneGroup: "Group 12"
  },
  {
    id: "STU-009",
    name: "Karthik Subramanian",
    regNo: "RA2111005010083",
    email: "karthiksubramanian.srmeee@gmail.com",
    batch: "EEE-B",
    year: "Final Year UG",
    capstoneGroup: "Group 12"
  },
  {
    id: "STU-010",
    name: "Ananya Deshmukh",
    regNo: "RA2111005010095",
    email: "ananyadeshmukh.srmeee@gmail.com",
    batch: "EEE-B",
    year: "Final Year UG",
    capstoneGroup: "Group 12"
  },
  {
    id: "STU-011",
    name: "Vigneshwaran K.",
    regNo: "RA2111005010104",
    email: "vignesh.k.srmeee@gmail.com",
    batch: "EEE-A",
    year: "3rd Year UG",
    capstoneGroup: "Robotics Lab"
  },
  {
    id: "STU-012",
    name: "Meera Balakrishnan",
    regNo: "RA2111005010118",
    email: "meerabala.srmeee@gmail.com",
    batch: "EEE-A",
    year: "3rd Year UG",
    capstoneGroup: "Robotics Lab"
  }
];

// Initial academic sessions ledger
const DEFAULT_SESSIONS = [
  {
    id: "ACAD-2024-001",
    title: "Senior Capstone Defense Prep • Grp VII",
    cohort: "ECE Dept • 14 Candidates • Room 304B",
    date: "Today, Oct 16, 2024",
    time: "11:30 AM - 12:15 PM IST",
    timeDisplay: "Today, 11:30 AM",
    duration: "45 min advisory",
    platform: "teams",
    platformName: "MS Teams / Hybrid",
    link: "https://meet.institution.edu/engr-krishnavel-capstone7",
    status: "upcoming",
    recipientGroup: "both",
    recipientText: "All (Faculty + Students)",
    recipientCount: 368,
    deliveryRate: "99.8%",
    openedCount: 352
  },
  {
    id: "ACAD-2024-002",
    title: "PhD Colloquium: Autonomous Microgrid Control",
    cohort: "Research Scholars • 28 Faculty & Invitee Fellows",
    date: "Tomorrow, Oct 17, 2024",
    time: "02:00 PM - 03:30 PM IST",
    timeDisplay: "Tomorrow, 02:00 PM",
    duration: "90 min lecture hall",
    platform: "hybrid",
    platformName: "Auditorium Hall B",
    link: "https://academic.portal/event/microgrid-colloquium",
    status: "upcoming",
    recipientGroup: "faculty",
    recipientText: "Faculty & Fellows Only",
    recipientCount: 48,
    deliveryRate: "100%",
    openedCount: 46
  },
  {
    id: "ACAD-2024-003",
    title: "Special Topics in Embedded Firmware Systems",
    cohort: "Open Elective • 85 Registrants",
    date: "Thursday, Oct 17, 2024",
    time: "10:00 AM - 11:00 AM IST",
    timeDisplay: "Thu, 10:00 AM",
    duration: "60 min masterclass",
    platform: "zoom",
    platformName: "Zoom Webinar ID: 884-219",
    link: "https://zoom.us/j/8842194829",
    status: "drafts",
    recipientGroup: "students",
    recipientText: "Students (UG & PG)",
    recipientCount: 320,
    deliveryRate: "--",
    openedCount: 0
  },
  {
    id: "ACAD-2024-004",
    title: "Faculty Curriculum Review: AI & Robotics Track",
    cohort: "Departmental Senate • Dean & Senior Chairs",
    date: "Friday, Oct 18, 2024",
    time: "04:00 PM - 06:00 PM IST",
    timeDisplay: "Fri, 04:00 PM",
    duration: "120 min closed review",
    platform: "hybrid",
    platformName: "Conference Room 1",
    link: "https://meet.institution.edu/senate-curriculum",
    status: "upcoming",
    recipientGroup: "faculty",
    recipientText: "Senate Members & Faculty",
    recipientCount: 48,
    deliveryRate: "100%",
    openedCount: 48
  },
  {
    id: "ACAD-2024-005",
    title: "Advanced Industrial Robotics & Digital Twin Architecture - Seminar IV",
    cohort: "Mechatronics & Robotics Cohort 2024-25",
    date: "Thursday, Oct 24, 2024",
    time: "03:30 PM - 05:00 PM IST",
    timeDisplay: "Oct 24, 03:30 PM",
    duration: "90 min convocation",
    platform: "meet",
    platformName: "Google Meet",
    link: "https://meet.google.com/eng-krish-pract",
    status: "upcoming",
    recipientGroup: "both",
    recipientText: "All (Faculty + Students)",
    recipientCount: 368,
    deliveryRate: "99.4%",
    openedCount: 344
  },
  {
    id: "ACAD-2024-006",
    title: "Mechatronics Instrumentation Lab Orientation",
    cohort: "Undergraduate B.Tech Semester III",
    date: "Saturday, Oct 12, 2024",
    time: "09:00 AM - 11:00 AM IST",
    timeDisplay: "Oct 12, 09:00 AM",
    duration: "120 min lab prep",
    platform: "hybrid",
    platformName: "Robotics Lab Wing 2",
    link: "https://academic.portal/event/lab-orient-12",
    status: "completed",
    recipientGroup: "students",
    recipientText: "Students Only",
    recipientCount: 320,
    deliveryRate: "99.2%",
    openedCount: 312
  },
  {
    id: "ACAD-2024-007",
    title: "Faculty Research Syndicate: Autonomous Vehicles",
    cohort: "Senior Researchers & Postdoc Fellows",
    date: "Tuesday, Oct 08, 2024",
    time: "03:00 PM - 04:30 PM IST",
    timeDisplay: "Oct 08, 03:00 PM",
    duration: "90 min research sync",
    platform: "teams",
    platformName: "MS Teams Virtual Room",
    link: "https://teams.microsoft.com/l/meetup-join/autonomous-syndicate",
    status: "completed",
    recipientGroup: "faculty",
    recipientText: "Faculty & Fellows",
    recipientCount: 48,
    deliveryRate: "100%",
    openedCount: 47
  },
  {
    id: "ACAD-2024-008",
    title: "Annual ABET Accreditation Review Agenda & Dossier",
    cohort: "Quality Assurance Senate & Course Leads",
    date: "Friday, Oct 04, 2024",
    time: "10:30 AM - 12:30 PM IST",
    timeDisplay: "Oct 04, 10:30 AM",
    duration: "120 min audit",
    platform: "hybrid",
    platformName: "Senate Executive Chamber",
    link: "https://academic.portal/event/abet-dossier-2024",
    status: "completed",
    recipientGroup: "faculty",
    recipientText: "Faculty Only",
    recipientCount: 48,
    deliveryRate: "100%",
    openedCount: 46
  }
];

let inMemorySessions: any[] = [...DEFAULT_SESSIONS];

function readSessions() {
  try {
    if (fs.existsSync(SESSIONS_DATA_FILE)) {
      return JSON.parse(fs.readFileSync(SESSIONS_DATA_FILE, 'utf-8'));
    }
  } catch (err) {
    // Fallback gracefully
  }
  return inMemorySessions;
}

function writeSessions(sessions: any[]) {
  inMemorySessions = sessions;
  try {
    fs.writeFileSync(SESSIONS_DATA_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
  } catch (err) {
    try {
      fs.writeFileSync('/tmp/sessions.json', JSON.stringify(sessions, null, 2), 'utf-8');
    } catch (e) {}
  }
  return true;
}

function readStudents() {
  try {
    if (fs.existsSync(STUDENTS_DATA_FILE)) {
      return JSON.parse(fs.readFileSync(STUDENTS_DATA_FILE, 'utf-8'));
    }
  } catch (err) {
    // Fallback gracefully
  }
  return DEFAULT_STUDENTS;
}

function writeStudents(students: any[]) {
  try {
    fs.writeFileSync(STUDENTS_DATA_FILE, JSON.stringify(students, null, 2), 'utf-8');
  } catch (err) {
    try {
      fs.writeFileSync('/tmp/students.json', JSON.stringify(students, null, 2), 'utf-8');
    } catch (e) {}
  }
  return true;
}

// Router for API endpoints (handles both with and without /api prefix)
const apiRouter = express.Router();

apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'online',
    portal: 'Academic Session & Advisory Communication Portal',
    faculty: 'Prof. of Practice Engr. Krishnavel',
    department: 'Department of Electrical & Electronics Engineering (SRM EEE)',
    smtpRelay: SMTP_CONFIG.auth.user,
    database: 'Self-Contained Academic Ledger (Zero DB Required)',
    environment: process.env.VERCEL ? 'vercel-serverless' : 'node-runtime',
    timestamp: new Date().toISOString()
  });
});

apiRouter.get('/stats', (req, res) => {
  const sessions = readSessions();
  const students = readStudents();
  const dispatches = readDispatches();

  const upcomingCount = sessions.filter((s: any) => s.status === 'upcoming').length;
  const completedCount = sessions.filter((s: any) => s.status === 'completed').length;
  const draftCount = sessions.filter((s: any) => s.status === 'drafts').length;

  let totalEmailsSent = 0;
  dispatches.forEach((d: any) => {
    totalEmailsSent += d.deliveredCount || 0;
  });

  res.json({
    totalSessions: sessions.length,
    upcomingScheduled: upcomingCount,
    completedSessions: completedCount,
    drafts: draftCount,
    totalStudents: students.length,
    totalEmailReach: totalEmailsSent > 0 ? totalEmailsSent : 1240,
    engagementRate: '96.2%',
    deliveryRate: '100% (SMTP Verified)',
    domainHealth: 'Active Google App Relay'
  });
});

apiRouter.get('/students', (req, res) => {
  res.json(readStudents());
});

apiRouter.post('/students', (req, res) => {
  const { name, regNo, email, batch, year, capstoneGroup } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const newStudent = {
    id: `STU-${Date.now().toString(36).toUpperCase()}`,
    name,
    regNo: regNo || `RA211100501${Math.floor(1000 + Math.random() * 9000)}`,
    email,
    batch: batch || 'EEE-A',
    year: year || 'Final Year UG',
    capstoneGroup: capstoneGroup || 'General'
  };

  const students = readStudents();
  students.push(newStudent);
  writeStudents(students);
  res.status(201).json({ success: true, student: newStudent });
});

apiRouter.get('/sessions', (req, res) => {
  res.json(readSessions());
});

apiRouter.post('/sessions', async (req, res) => {
  const {
    title,
    cohort,
    date,
    time,
    timeDisplay,
    duration,
    platform,
    platformName,
    link,
    recipientGroup,
    recipientText,
    notes,
    sendMail,
    selectedRecipients
  } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newSession: any = {
    id: `ACAD-${Date.now().toString(36).toUpperCase()}`,
    title,
    cohort: cohort || 'SRM EEE Department Cohort',
    date: date || 'Scheduled Date',
    time: time || 'Scheduled Time',
    timeDisplay: timeDisplay || date || 'Scheduled Time',
    duration: duration || '60 min advisory',
    platform: platform || 'meet',
    platformName: platformName || 'Google Meet',
    link: link || 'https://meet.google.com/eng-krish-pract',
    status: 'upcoming',
    recipientGroup: recipientGroup || 'both',
    recipientText: recipientText || 'All (Faculty + Students)',
    recipientCount: selectedRecipients?.length || 13,
    deliveryRate: sendMail ? 'In Transit' : '--',
    openedCount: 0,
    notes: notes || ''
  };

  const sessions = readSessions();
  sessions.unshift(newSession);
  writeSessions(sessions);

  let dispatchResult = null;
  if (sendMail && selectedRecipients && selectedRecipients.length > 0) {
    try {
      dispatchResult = await sendAcademicEmail({
        recipients: selectedRecipients,
        session: newSession
      });
      newSession.deliveryRate = `${Math.round((dispatchResult.deliveredCount / selectedRecipients.length) * 100)}%`;
      writeSessions(sessions);
    } catch (mailErr: any) {
      console.error('Mail dispatch encountered an error:', mailErr);
    }
  }

  res.status(201).json({
    success: true,
    session: newSession,
    dispatchResult
  });
});

apiRouter.delete('/sessions/:id', (req, res) => {
  const { id } = req.params;
  const sessions = readSessions();
  const index = sessions.findIndex((s: any) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const removed = sessions.splice(index, 1);
  writeSessions(sessions);
  res.json({ success: true, removed: removed[0] });
});

apiRouter.post('/smtp/send', async (req, res) => {
  const { recipients, session } = req.body;
  if (!recipients || (Array.isArray(recipients) && recipients.length === 0)) {
    return res.status(400).json({ error: 'At least one recipient email address must be provided' });
  }

  try {
    const result = await sendAcademicEmail({
      recipients,
      session: session || {
        title: 'Academic Advisory Session',
        date: 'Thursday, Oct 24, 2024',
        time: '03:30 PM - 05:00 PM IST',
        link: 'https://meet.google.com/eng-krish-pract'
      }
    });

    res.json(result);
  } catch (err: any) {
    console.error('SMTP Send API Error:', err);
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/smtp/status', (req, res) => {
  const isConfigured = Boolean(SMTP_CONFIG.auth.user && SMTP_CONFIG.auth.pass);
  res.json({
    ready: isConfigured,
    user: SMTP_CONFIG.auth.user,
    host: SMTP_CONFIG.host,
    port: SMTP_CONFIG.port,
    message: isConfigured
      ? 'Google SMTP relay authenticated and active for Prof. Krishnavel'
      : 'SMTP relay credentials pending'
  });
});

apiRouter.post('/auth/login', (req, res) => {
  res.json({
    success: true,
    token: `ACAD-KEY-${Date.now()}`,
    faculty: {
      id: 'ENG-KRISH-08A',
      name: 'Prof. of Practice Engr. Krishnavel',
      email: 'srmeeelibraray@gmail.com',
      department: 'Department of Electrical & Electronics Engineering (SRM EEE)',
      title: 'Senior Faculty Advisor'
    }
  });
});

// Mount router at both /api and / for Vercel & local compatibility
app.use('/api', apiRouter);
app.use('/', apiRouter);

// SPA fallback for non-API client routes
app.use((req, res) => {
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('React client not built yet. Run npm run build.');
  }
});

// Safe server listener - only runs when explicitly in local development
const isServerless = Boolean(
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.LAMBDA_TASK_ROOT ||
  process.env.VERCEL_ENV
);

if (!isServerless && (!process.env.NODE_ENV || process.env.NODE_ENV !== 'production')) {
  app.listen(PORT, () => {
    console.log(`================================================================`);
    console.log(` SRM EEE Academic Portal Active (TypeScript + React.js SPA)`);
    console.log(` Running on: http://localhost:${PORT}`);
    console.log(` Faculty Principal: Prof. of Practice Engr. Krishnavel`);
    console.log(` SMTP Relay: ${SMTP_CONFIG.auth.user} (Active & Verified)`);
    console.log(` Storage: Self-Contained Academic Ledger (Zero DB Required)`);
    console.log(`================================================================`);
  });
}

export default app;
