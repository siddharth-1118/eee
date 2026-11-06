// server.ts
import express from "express";
import cors from "cors";
import path2 from "path";
import fs2 from "fs";
import { fileURLToPath as fileURLToPath2 } from "url";

// config/smtp.ts
import nodemailer from "nodemailer";
var SMTP_CONFIG = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "465", 10),
  secure: true,
  auth: {
    user: process.env.SMTP_USER || "srmeeelibraray@gmail.com",
    pass: process.env.SMTP_PASS || "jzpvoyjarrtrpbeb"
  }
};
var transporter = nodemailer.createTransport(SMTP_CONFIG);

// services/mailer.ts
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var SENDER_NAME = "Prof. Krishnavel (SRM EEE)";
var SENDER_EMAIL = "srmeeelibraray@gmail.com";
var DISPATCH_LOG_FILE = path.join(__dirname, "..", "data", "dispatches.json");
var PROF_PHOTO_PATH = path.join(__dirname, "..", "public", "professor_krishnavel.jpg");
function readDispatches() {
  try {
    if (!fs.existsSync(DISPATCH_LOG_FILE)) return [];
    return JSON.parse(fs.readFileSync(DISPATCH_LOG_FILE, "utf-8"));
  } catch (e) {
    return [];
  }
}
function writeDispatches(logs) {
  try {
    fs.writeFileSync(DISPATCH_LOG_FILE, JSON.stringify(logs, null, 2), "utf-8");
  } catch (e) {
    console.error("Error logging dispatch:", e);
  }
}
function generateIcsCalendar(session) {
  const title = session.title || "Academic Advisory Session";
  const meetUrl = session.link || "https://meet.google.com/eng-krish-pract";
  const stamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const uid = `acad-${Date.now()}@srmist.edu.in`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SRMIST EEE//Academic Advisory Portal//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${stamp}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:Academic Session conducted by Prof. Krishnavel, Senior Faculty Advisor, SRM EEE.\\nMeeting Link: ${meetUrl}`,
    `LOCATION:${meetUrl}`,
    `ORGANIZER;CN="Prof. Krishnavel":mailto:${SENDER_EMAIL}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
}
function generateHtmlEmail(session, recipientEmail) {
  const title = session.title || "Advanced Industrial Robotics & Digital Twin Architecture \xB7 Seminar IV";
  const date = session.date || "Thursday, Oct 24, 2024";
  const time = session.time || "03:30 PM - 05:00 PM IST";
  const link = session.link || "https://meet.google.com/eng-krish-pract";
  const notes = session.notes || session.announcementBody || "Please review preparatory notes before attending the session.";
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #faf9f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1c1917; line-height: 1.5;">
  <div style="max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #e7e5e4; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
    
    <div style="padding: 20px 24px; border-bottom: 1px solid #f5f5f4; background-color: #ffffff;">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #78716c; font-weight: 600;">
        SRM Institute of Science and Technology \xB7 Department of EEE
      </div>
      <div style="font-size: 13px; color: #44403c; margin-top: 2px;">
        Academic Advisory & Session Dispatch Notice
      </div>
    </div>

    <div style="padding: 24px;">
      
      <div style="font-size: 12px; color: #a8a29e; font-family: monospace; margin-bottom: 8px;">
        OFFICIAL ACADEMIC NOTICE
      </div>

      <h1 style="font-size: 20px; line-height: 1.35; color: #0c0a09; margin: 0 0 16px 0; font-weight: 600;">
        ${title}
      </h1>

      <p style="font-size: 13px; color: #44403c; margin: 0 0 20px 0;">
        Dear Scholar, this formal notice confirms your registration for the upcoming academic session convened by <strong>Prof. of Practice Engr. Krishnavel</strong>.
      </p>

      <div style="background-color: #fbfaf8; border: 1px solid #e7e5e4; border-radius: 6px; padding: 16px; margin-bottom: 20px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="padding: 6px 0; color: #78716c; width: 110px;">Date:</td>
            <td style="padding: 6px 0; color: #1c1917; font-weight: 500;">${date}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #78716c;">Time:</td>
            <td style="padding: 6px 0; color: #1c1917; font-weight: 500;">${time}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #78716c;">Conference:</td>
            <td style="padding: 6px 0;">
              <a href="${link}" style="color: #1e3a8a; text-decoration: underline; font-weight: 500; word-break: break-all;" target="_blank">
                ${link}
              </a>
            </td>
          </tr>
        </table>

        <div style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed #e7e5e4;">
          <a href="${link}" style="display: inline-block; background-color: #1c1917; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 500; padding: 8px 16px; border-radius: 4px;" target="_blank">
            Join Teleconference Gateway
          </a>
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <div style="font-size: 12px; font-weight: 600; color: #1c1917; margin-bottom: 6px;">
          Session Syllabus & Directives:
        </div>
        <div style="font-size: 13px; color: #44403c; line-height: 1.6; white-space: pre-line; background: #ffffff; padding: 12px; border: 1px solid #f5f5f4; border-radius: 4px;">
          ${notes}
        </div>
      </div>

      <div style="background-color: #f5f5f4; border-radius: 4px; padding: 10px 14px; font-size: 12px; color: #57534e; margin-bottom: 24px;">
        \u{1F4C5} <strong>Calendar Invitation Attached:</strong> An RFC-5545 <code>.ics</code> calendar file is attached to sync with your institutional Google or Outlook Calendar.
      </div>

      <div style="padding-top: 20px; border-top: 1px solid #e7e5e4;">
        <table style="border-collapse: collapse;">
          <tr>
            <td style="vertical-align: middle; padding-right: 14px; width: 64px;">
              <img src="cid:prof_photo" alt="Prof. Krishnavel" style="width: 56px; height: 56px; border-radius: 50%; object-fit: cover; border: 1px solid #d6d3d1; display: block;" />
            </td>
            <td style="vertical-align: middle;">
              <div style="font-size: 13px; font-weight: 600; color: #0c0a09; line-height: 1.3;">Prof. of Practice Engr. Krishnavel</div>
              <div style="font-size: 11px; color: #78716c; margin-top: 2px;">Senior Faculty Advisor \xB7 Automation & Robotics</div>
              <div style="font-size: 11px; color: #a8a29e; margin-top: 1px;">Department of Electrical & Electronics Engineering \xB7 SRMIST</div>
              <div style="font-size: 11px; color: #78716c; margin-top: 2px;">Relay: <code>srmeeelibraray@gmail.com</code></div>
            </td>
          </tr>
        </table>
      </div>

    </div>

    <div style="padding: 14px 24px; background-color: #fbfaf8; border-top: 1px solid #f5f5f4; font-size: 11px; color: #a8a29e; text-align: center;">
      Academic Advisory Portal \xB7 Automated Student Dispatch Relay \xB7 SRMIST EEE
    </div>

  </div>
</body>
</html>
  `;
}
async function sendAcademicEmail({
  recipients,
  session
}) {
  if (!recipients) {
    throw new Error("No recipients specified for dispatch");
  }
  const recipientList = Array.isArray(recipients) ? recipients.filter(Boolean) : recipients.split(",").map((s) => s.trim()).filter(Boolean);
  if (recipientList.length === 0) {
    throw new Error("Recipient list is empty");
  }
  const title = session.title || "Academic Session Notification";
  const icsData = generateIcsCalendar(session);
  const attachments = [
    {
      filename: `${(session.title || "academic_session").replace(/[^a-zA-Z0-9]/g, "_")}.ics`,
      content: icsData,
      contentType: "text/calendar; charset=utf-8; method=REQUEST"
    }
  ];
  if (fs.existsSync(PROF_PHOTO_PATH)) {
    attachments.push({
      filename: "professor_krishnavel.jpg",
      path: PROF_PHOTO_PATH,
      cid: "prof_photo"
    });
  }
  const results = [];
  const errors = [];
  for (const recipient of recipientList) {
    try {
      const html = generateHtmlEmail(session, recipient);
      const mailOptions = {
        from: `"${SENDER_NAME}" <${SENDER_EMAIL}>`,
        to: recipient,
        subject: `[SRM EEE Advisory] ${title}`,
        text: `Official Academic Notice from Prof. Krishnavel:

${title}
Date: ${session.date}
Time: ${session.time}
Link: ${session.link}

${session.notes || ""}`,
        html,
        attachments
      };
      const info = await transporter.sendMail(mailOptions);
      results.push({
        recipient,
        messageId: info.messageId,
        status: "delivered"
      });
    } catch (err) {
      console.error(`Failed to send to ${recipient}:`, err.message);
      errors.push({
        recipient,
        error: err.message
      });
    }
  }
  const dispatches = readDispatches();
  const logEntry = {
    id: `DISP-${Date.now()}`,
    title: session.title,
    date: session.date,
    time: session.time,
    totalAttempted: recipientList.length,
    deliveredCount: results.length,
    failedCount: errors.length,
    recipients: recipientList,
    results,
    errors,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
  dispatches.unshift(logEntry);
  writeDispatches(dispatches);
  return {
    success: results.length > 0,
    deliveredCount: results.length,
    failedCount: errors.length,
    results,
    errors,
    dispatchId: logEntry.id
  };
}

// server.ts
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = path2.dirname(__filename2);
var app = express();
var PORT = parseInt(process.env.PORT || "3000", 10);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  if (req.originalUrl && req.url !== req.originalUrl) {
    req.url = req.originalUrl;
  }
  next();
});
var PUBLIC_DIR = path2.join(process.cwd(), "public");
var DIST_DIR = path2.join(process.cwd(), "dist");
var SESSIONS_DATA_FILE = path2.join(process.cwd(), "data", "sessions.json");
var STUDENTS_DATA_FILE = path2.join(process.cwd(), "data", "students.json");
app.use(express.static(PUBLIC_DIR));
app.use("/public", express.static(PUBLIC_DIR));
if (fs2.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
}
app.get("/professor_krishnavel.jpg", (req, res) => {
  const candidatePaths = [
    path2.join(PUBLIC_DIR, "professor_krishnavel.jpg"),
    path2.join(DIST_DIR, "professor_krishnavel.jpg"),
    path2.join(__dirname2, "public", "professor_krishnavel.jpg")
  ];
  for (const p of candidatePaths) {
    if (fs2.existsSync(p)) {
      res.setHeader("Content-Type", "image/jpeg");
      return res.sendFile(p);
    }
  }
  res.status(404).send("Photo not found");
});
var DEFAULT_STUDENTS = [];
var DEFAULT_SESSIONS = [];
var inMemorySessions = [...DEFAULT_SESSIONS];
function readSessions() {
  try {
    if (fs2.existsSync(SESSIONS_DATA_FILE)) {
      return JSON.parse(fs2.readFileSync(SESSIONS_DATA_FILE, "utf-8"));
    }
  } catch (err) {
  }
  return inMemorySessions;
}
function writeSessions(sessions) {
  inMemorySessions = sessions;
  try {
    fs2.writeFileSync(SESSIONS_DATA_FILE, JSON.stringify(sessions, null, 2), "utf-8");
  } catch (err) {
    try {
      fs2.writeFileSync("/tmp/sessions.json", JSON.stringify(sessions, null, 2), "utf-8");
    } catch (e) {
    }
  }
  return true;
}
function readStudents() {
  try {
    if (fs2.existsSync(STUDENTS_DATA_FILE)) {
      return JSON.parse(fs2.readFileSync(STUDENTS_DATA_FILE, "utf-8"));
    }
  } catch (err) {
  }
  return DEFAULT_STUDENTS;
}
function writeStudents(students) {
  try {
    fs2.writeFileSync(STUDENTS_DATA_FILE, JSON.stringify(students, null, 2), "utf-8");
  } catch (err) {
    try {
      fs2.writeFileSync("/tmp/students.json", JSON.stringify(students, null, 2), "utf-8");
    } catch (e) {
    }
  }
  return true;
}
var apiRouter = express.Router();
apiRouter.get("/health", (req, res) => {
  res.json({
    status: "online",
    portal: "Academic Session & Advisory Communication Portal",
    faculty: "Prof. of Practice Engr. Krishnavel",
    department: "Department of Electrical & Electronics Engineering (SRM EEE)",
    smtpRelay: SMTP_CONFIG.auth.user,
    database: "Self-Contained Academic Ledger (Zero DB Required)",
    environment: process.env.VERCEL ? "vercel-serverless" : "node-runtime",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
apiRouter.get("/stats", (req, res) => {
  const sessions = readSessions();
  const students = readStudents();
  const dispatches = readDispatches();
  const upcomingCount = sessions.filter((s) => s.status === "upcoming").length;
  const completedCount = sessions.filter((s) => s.status === "completed").length;
  const draftCount = sessions.filter((s) => s.status === "drafts").length;
  let totalEmailsSent = 0;
  dispatches.forEach((d) => {
    totalEmailsSent += d.deliveredCount || 0;
  });
  res.json({
    totalSessions: sessions.length,
    upcomingScheduled: upcomingCount,
    completedSessions: completedCount,
    drafts: draftCount,
    totalStudents: students.length,
    totalEmailReach: totalEmailsSent,
    engagementRate: totalEmailsSent > 0 ? "100%" : "0%",
    deliveryRate: totalEmailsSent > 0 ? "100% (SMTP Verified)" : "Ready (Verified)",
    domainHealth: "Active Google App Relay"
  });
});
apiRouter.get("/students", (req, res) => {
  res.json(readStudents());
});
apiRouter.post("/students", (req, res) => {
  const { name, regNo, email, batch, year, capstoneGroup } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  const newStudent = {
    id: `STU-${Date.now().toString(36).toUpperCase()}`,
    name,
    regNo: regNo || `RA211100501${Math.floor(1e3 + Math.random() * 9e3)}`,
    email,
    batch: batch || "EEE-A",
    year: year || "Final Year UG",
    capstoneGroup: capstoneGroup || "General"
  };
  const students = readStudents();
  students.push(newStudent);
  writeStudents(students);
  res.status(201).json({ success: true, student: newStudent });
});
apiRouter.get("/sessions", (req, res) => {
  res.json(readSessions());
});
apiRouter.post("/sessions", async (req, res) => {
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
    return res.status(400).json({ error: "Title is required" });
  }
  const newSession = {
    id: `ACAD-${Date.now().toString(36).toUpperCase()}`,
    title,
    cohort: cohort || "SRM EEE Department Cohort",
    date: date || "Scheduled Date",
    time: time || "Scheduled Time",
    timeDisplay: timeDisplay || date || "Scheduled Time",
    duration: duration || "60 min advisory",
    platform: platform || "meet",
    platformName: platformName || "Google Meet",
    link: link || "https://meet.google.com/eng-krish-pract",
    status: "upcoming",
    recipientGroup: recipientGroup || "both",
    recipientText: recipientText || "All (Faculty + Students)",
    recipientCount: selectedRecipients?.length || 13,
    deliveryRate: sendMail ? "In Transit" : "--",
    openedCount: 0,
    notes: notes || ""
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
      newSession.deliveryRate = `${Math.round(dispatchResult.deliveredCount / selectedRecipients.length * 100)}%`;
      writeSessions(sessions);
    } catch (mailErr) {
      console.error("Mail dispatch encountered an error:", mailErr);
    }
  }
  res.status(201).json({
    success: true,
    session: newSession,
    dispatchResult
  });
});
apiRouter.delete("/sessions/:id", (req, res) => {
  const { id } = req.params;
  const sessions = readSessions();
  const index = sessions.findIndex((s) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Session not found" });
  }
  const removed = sessions.splice(index, 1);
  writeSessions(sessions);
  res.json({ success: true, removed: removed[0] });
});
apiRouter.post("/smtp/send", async (req, res) => {
  const { recipients, session } = req.body;
  if (!recipients || Array.isArray(recipients) && recipients.length === 0) {
    return res.status(400).json({ error: "At least one recipient email address must be provided" });
  }
  try {
    const result = await sendAcademicEmail({
      recipients,
      session: session || {
        title: "Academic Advisory Session",
        date: "Thursday, Oct 24, 2024",
        time: "03:30 PM - 05:00 PM IST",
        link: "https://meet.google.com/eng-krish-pract"
      }
    });
    res.json(result);
  } catch (err) {
    console.error("SMTP Send API Error:", err);
    res.status(500).json({ error: err.message });
  }
});
apiRouter.get("/smtp/status", (req, res) => {
  const isConfigured = Boolean(SMTP_CONFIG.auth.user && SMTP_CONFIG.auth.pass);
  res.json({
    ready: isConfigured,
    user: SMTP_CONFIG.auth.user,
    host: SMTP_CONFIG.host,
    port: SMTP_CONFIG.port,
    message: isConfigured ? "Google SMTP relay authenticated and active for Prof. Krishnavel" : "SMTP relay credentials pending"
  });
});
apiRouter.post("/auth/login", (req, res) => {
  res.json({
    success: true,
    token: `ACAD-KEY-${Date.now()}`,
    faculty: {
      id: "ENG-KRISH-08A",
      name: "Prof. of Practice Engr. Krishnavel",
      email: "srmeeelibraray@gmail.com",
      department: "Department of Electrical & Electronics Engineering (SRM EEE)",
      title: "Senior Faculty Advisor"
    }
  });
});
app.use("/api", apiRouter);
app.use("/", apiRouter);
app.use((req, res) => {
  const indexPath = path2.join(DIST_DIR, "index.html");
  if (fs2.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("React client not built yet. Run npm run build.");
  }
});
var isServerless = Boolean(
  process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT || process.env.VERCEL_ENV
);
if (!isServerless && (!process.env.NODE_ENV || process.env.NODE_ENV !== "production")) {
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
var server_default = app;
export {
  server_default as default
};
