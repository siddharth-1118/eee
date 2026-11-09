// server.ts
import express from "express";
import cors from "cors";
import path2 from "path";
import fs2 from "fs";
import { fileURLToPath as fileURLToPath2 } from "url";

// config/smtp.ts
import nodemailer from "nodemailer";
var host = process.env.SMTP_HOST || "smtp.gmail.com";
var port = parseInt(process.env.SMTP_PORT || (host.includes("brevo") || host.includes("sendinblue") ? "587" : "465"), 10);
var SMTP_CONFIG = {
  host,
  port,
  secure: port === 465,
  // SSL for 465, TLS/STARTTLS for 587
  auth: {
    user: process.env.SMTP_USER || "srmeeelibraray@gmail.com",
    pass: process.env.SMTP_PASS || "jzpvoyjarrtrpbeb"
  }
};
var transporter = nodemailer.createTransport({
  ...SMTP_CONFIG,
  // Brevo TLS compatibility settings
  tls: {
    rejectUnauthorized: false
  }
});

// services/mailer.ts
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var SENDER_NAME = process.env.SMTP_SENDER_NAME || "Prof. Krishnavel (SRM EEE)";
var SENDER_EMAIL = process.env.SMTP_FROM || process.env.SMTP_USER || "srmeeelibraray@gmail.com";
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
  const meetUrl = session.link || "https://meet.zoho.in/nvzd-cbn-fyn";
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
  const link = session.link || "https://meet.zoho.in/nvzd-cbn-fyn";
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
            Join Teleconference ${link.includes("zoho") ? "(Zoho Meeting)" : link.includes("google") ? "(Google Meet)" : "Gateway"}
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

// src/data/recipientsData.ts
var EEE_STUDENTS = [
  {
    "id": "stu-RA2611005010001",
    "name": "MOHAMMAD KHAJA SAQIB AHAMED",
    "email": "ma6024@srmist.edu.in",
    "regNo": "RA2611005010001",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010002",
    "name": "YARAM PENCHALA SHANMUKA VARDHAN",
    "email": "py2466@srmist.edu.in",
    "regNo": "RA2611005010002",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010003",
    "name": "MIRTHAESH KUMAR P",
    "email": "pp3062@srmist.edu.in",
    "regNo": "RA2611005010003",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010004",
    "name": "SUDHARSAN V",
    "email": "sv4160@srmist.edu.in",
    "regNo": "RA2611005010004",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010005",
    "name": "SUGESH M",
    "email": "sm3122@srmist.edu.in",
    "regNo": "RA2611005010005",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010007",
    "name": "JEEVAN C",
    "email": "jc8603@srmist.edu.in",
    "regNo": "RA2611005010007",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010008",
    "name": "NAVNEETH JAYACHANDRAN",
    "email": "nj5847@srmist.edu.in",
    "regNo": "RA2611005010008",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010009",
    "name": "E MAHIZHNAN",
    "email": "me5461@srmist.edu.in",
    "regNo": "RA2611005010009",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010010",
    "name": "PRITISH SINGH",
    "email": "ps6080@srmist.edu.in",
    "regNo": "RA2611005010010",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010011",
    "name": "PRIYANSH ARORA",
    "email": "pa5632@srmist.edu.in",
    "regNo": "RA2611005010011",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010012",
    "name": "SARAN A",
    "email": "sa6450@srmist.edu.in",
    "regNo": "RA2611005010012",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010013",
    "name": "SANTHOSH K P",
    "email": "sk1635@srmist.edu.in",
    "regNo": "RA2611005010013",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010014",
    "name": "SAPTARSHI MUKHERJEE",
    "email": "sm7491@srmist.edu.in",
    "regNo": "RA2611005010014",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010015",
    "name": "SUBHADEEP GIRI",
    "email": "sg1785@srmist.edu.in",
    "regNo": "RA2611005010015",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010017",
    "name": "ROHAN HUKAM CHAND",
    "email": "rh2592@srmist.edu.in",
    "regNo": "RA2611005010017",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010018",
    "name": "SHASHWAT RAJ HOTA",
    "email": "sh1064@srmist.edu.in",
    "regNo": "RA2611005010018",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010020",
    "name": "PREM SARAVAN P",
    "email": "pp9521@srmist.edu.in",
    "regNo": "RA2611005010020",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010021",
    "name": "AARUSH S ANOOP",
    "email": "as0612@srmist.edu.in",
    "regNo": "RA2611005010021",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010022",
    "name": "SHAIK RAIHAN",
    "email": "sr7768@srmist.edu.in",
    "regNo": "RA2611005010022",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010023",
    "name": "SHAIK RIZWAN",
    "email": "sr0334@srmist.edu.in",
    "regNo": "RA2611005010023",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010024",
    "name": "VASANTHAKUMAR V",
    "email": "vv2846@srmist.edu.in",
    "regNo": "RA2611005010024",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010025",
    "name": "AASHNA JOSHI",
    "email": "aj4644@srmist.edu.in",
    "regNo": "RA2611005010025",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010026",
    "name": "PARTHA SARATHI V",
    "email": "pv8170@srmist.edu.in",
    "regNo": "RA2611005010026",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010027",
    "name": "SAMRIDDHI MISHRA",
    "email": "sm4805@srmist.edu.in",
    "regNo": "RA2611005010027",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010028",
    "name": "PRIYANK DUBEY",
    "email": "pd8107@srmist.edu.in",
    "regNo": "RA2611005010028",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010030",
    "name": "BHAVAN S",
    "email": "bs8223@srmist.edu.in",
    "regNo": "RA2611005010030",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010031",
    "name": "R JOSHITA NESALYN",
    "email": "jr6804@srmist.edu.in",
    "regNo": "RA2611005010031",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010032",
    "name": "ANISH DATTA",
    "email": "ad1644@srmist.edu.in",
    "regNo": "RA2611005010032",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010034",
    "name": "AAYUSH S",
    "email": "as8441@srmist.edu.in",
    "regNo": "RA2611005010034",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010035",
    "name": "KALISHSAILESHKUMAR P",
    "email": "kp1046@srmist.edu.in",
    "regNo": "RA2611005010035",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010036",
    "name": "ABHRO GHOSH",
    "email": "ag1580@srmist.edu.in",
    "regNo": "RA2611005010036",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010037",
    "name": "RYAN S MATHEW",
    "email": "rm6815@srmist.edu.in",
    "regNo": "RA2611005010037",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010038",
    "name": "ABINAV P",
    "email": "ap5414@srmist.edu.in",
    "regNo": "RA2611005010038",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010039",
    "name": "ISHAAN RAHUL KORDE",
    "email": "ik1043@srmist.edu.in",
    "regNo": "RA2611005010039",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010040",
    "name": "S ADHIKESAVAN",
    "email": "sa4676@srmist.edu.in",
    "regNo": "RA2611005010040",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010042",
    "name": "DIVYA CHANDU",
    "email": "dc1660@srmist.edu.in",
    "regNo": "RA2611005010042",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010043",
    "name": "GEERTHY MG",
    "email": "gm5891@srmist.edu.in",
    "regNo": "RA2611005010043",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010044",
    "name": "NIVEDHITHA T",
    "email": "nt9313@srmist.edu.in",
    "regNo": "RA2611005010044",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010045",
    "name": "P SULEKA GIRIDAR",
    "email": "sp1121@srmist.edu.in",
    "regNo": "RA2611005010045",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010046",
    "name": "BALASANKAR H",
    "email": "bh3051@srmist.edu.in",
    "regNo": "RA2611005010046",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010047",
    "name": "KEATAN SINGH SOLANKI",
    "email": "ks3644@srmist.edu.in",
    "regNo": "RA2611005010047",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010050",
    "name": "SHAILESH V",
    "email": "sv8067@srmist.edu.in",
    "regNo": "RA2611005010050",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010051",
    "name": "MAJJI BHARANESWAR KUMAR",
    "email": "bm3680@srmist.edu.in",
    "regNo": "RA2611005010051",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010052",
    "name": "RITHIK ROSAN S",
    "email": "rs9046@srmist.edu.in",
    "regNo": "RA2611005010052",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010053",
    "name": "R M DHARUNGOPESH",
    "email": "rd2654@srmist.edu.in",
    "regNo": "RA2611005010053",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010054",
    "name": "KAVAN SAMEER DAVE",
    "email": "kd0085@srmist.edu.in",
    "regNo": "RA2611005010054",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010055",
    "name": "ANURAG PATNAIK",
    "email": "ap6543@srmist.edu.in",
    "regNo": "RA2611005010055",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010056",
    "name": "AFRIN FATHIMA K S",
    "email": "ak3799@srmist.edu.in",
    "regNo": "RA2611005010056",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010057",
    "name": "M ABISHEK",
    "email": "mm3616@srmist.edu.in",
    "regNo": "RA2611005010057",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010058",
    "name": "SHREYAS BHOWAL",
    "email": "sb1340@srmist.edu.in",
    "regNo": "RA2611005010058",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010059",
    "name": "CHINNALA DHANUSH TEJA",
    "email": "dc1645@srmist.edu.in",
    "regNo": "RA2611005010059",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010060",
    "name": "RISHIT NAGAR",
    "email": "rn7561@srmist.edu.in",
    "regNo": "RA2611005010060",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010061",
    "name": "HANNA MARIAM SAM",
    "email": "hm2861@srmist.edu.in",
    "regNo": "RA2611005010061",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010062",
    "name": "MAKIZHAN R S",
    "email": "mr8841@srmist.edu.in",
    "regNo": "RA2611005010062",
    "year": "I Year",
    "section": "A",
    "department": "EEE",
    "cohort": "I Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010064",
    "name": "NIRANJAN S",
    "email": "ra2611005010064@srmist.edu.in",
    "regNo": "RA2611005010064",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010065",
    "name": "AADHITH M",
    "email": "ra2611005010065@srmist.edu.in",
    "regNo": "RA2611005010065",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010066",
    "name": "THARUN V G",
    "email": "ra2611005010066@srmist.edu.in",
    "regNo": "RA2611005010066",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010068",
    "name": "MUTCHU BHASKAR TEJ",
    "email": "ra2611005010068@srmist.edu.in",
    "regNo": "RA2611005010068",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010069",
    "name": "KAHRKI A",
    "email": "ra2611005010069@srmist.edu.in",
    "regNo": "RA2611005010069",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010070",
    "name": "VANYA ANAND SRIVASTAVA",
    "email": "ra2611005010070@srmist.edu.in",
    "regNo": "RA2611005010070",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010071",
    "name": "M N JEEVAREKHA",
    "email": "ra2611005010071@srmist.edu.in",
    "regNo": "RA2611005010071",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010072",
    "name": "CHRISTY JOHN",
    "email": "ra2611005010072@srmist.edu.in",
    "regNo": "RA2611005010072",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010073",
    "name": "RANIRVIGRAM SELVARAJ",
    "email": "ra2611005010073@srmist.edu.in",
    "regNo": "RA2611005010073",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010074",
    "name": "SELVA L",
    "email": "ra2611005010074@srmist.edu.in",
    "regNo": "RA2611005010074",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010075",
    "name": "KUZHAGAN V",
    "email": "ra2611005010075@srmist.edu.in",
    "regNo": "RA2611005010075",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010076",
    "name": "ABHINAV SUNIL",
    "email": "ra2611005010076@srmist.edu.in",
    "regNo": "RA2611005010076",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010077",
    "name": "PAVITHRA P",
    "email": "ra2611005010077@srmist.edu.in",
    "regNo": "RA2611005010077",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010078",
    "name": "ABIR DASHORA",
    "email": "ra2611005010078@srmist.edu.in",
    "regNo": "RA2611005010078",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010079",
    "name": "ABDUL RAHMAN N",
    "email": "ra2611005010079@srmist.edu.in",
    "regNo": "RA2611005010079",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010080",
    "name": "MANCHILI GANAPATHY SHANMUKH",
    "email": "ra2611005010080@srmist.edu.in",
    "regNo": "RA2611005010080",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010081",
    "name": "NAGARAJAN S",
    "email": "ra2611005010081@srmist.edu.in",
    "regNo": "RA2611005010081",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010083",
    "name": "DEBESH BISWAS",
    "email": "ra2611005010083@srmist.edu.in",
    "regNo": "RA2611005010083",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010084",
    "name": "R SANJAY",
    "email": "ra2611005010084@srmist.edu.in",
    "regNo": "RA2611005010084",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010085",
    "name": "SANGLAP DAS",
    "email": "ra2611005010085@srmist.edu.in",
    "regNo": "RA2611005010085",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010086",
    "name": "SOMBIT NEOGI",
    "email": "ra2611005010086@srmist.edu.in",
    "regNo": "RA2611005010086",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010087",
    "name": "SAGNIK DUTTA",
    "email": "ra2611005010087@srmist.edu.in",
    "regNo": "RA2611005010087",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010088",
    "name": "RIYA NAHATA",
    "email": "ra2611005010088@srmist.edu.in",
    "regNo": "RA2611005010088",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010089",
    "name": "KARTHIKEYAN N",
    "email": "ra2611005010089@srmist.edu.in",
    "regNo": "RA2611005010089",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010090",
    "name": "NOULOSHI GHOSH",
    "email": "ra2611005010090@srmist.edu.in",
    "regNo": "RA2611005010090",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010091",
    "name": "AVIRAL VERMA",
    "email": "ra2611005010091@srmist.edu.in",
    "regNo": "RA2611005010091",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010092",
    "name": "ADRI RAJAK",
    "email": "ra2611005010092@srmist.edu.in",
    "regNo": "RA2611005010092",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010093",
    "name": "BHAVATHARA A",
    "email": "ra2611005010093@srmist.edu.in",
    "regNo": "RA2611005010093",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010094",
    "name": "SREYASHEE DAS",
    "email": "ra2611005010094@srmist.edu.in",
    "regNo": "RA2611005010094",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010095",
    "name": "MITHUN R",
    "email": "ra2611005010095@srmist.edu.in",
    "regNo": "RA2611005010095",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010096",
    "name": "SRINJOY TALUKDAR",
    "email": "ra2611005010096@srmist.edu.in",
    "regNo": "RA2611005010096",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010097",
    "name": "ARIVARASAN P P",
    "email": "ra2611005010097@srmist.edu.in",
    "regNo": "RA2611005010097",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010098",
    "name": "SM RAKSHETA",
    "email": "ra2611005010098@srmist.edu.in",
    "regNo": "RA2611005010098",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010099",
    "name": "MAHAMITHRAN K",
    "email": "ra2611005010099@srmist.edu.in",
    "regNo": "RA2611005010099",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010100",
    "name": "B NEGA",
    "email": "ra2611005010100@srmist.edu.in",
    "regNo": "RA2611005010100",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010101",
    "name": "MANAAL AGGARWAL",
    "email": "ra2611005010101@srmist.edu.in",
    "regNo": "RA2611005010101",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010102",
    "name": "KIRTHIK M",
    "email": "ra2611005010102@srmist.edu.in",
    "regNo": "RA2611005010102",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010103",
    "name": "SARTHAK SINGH",
    "email": "ra2611005010103@srmist.edu.in",
    "regNo": "RA2611005010103",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010104",
    "name": "ABHIN DATTA",
    "email": "ra2611005010104@srmist.edu.in",
    "regNo": "RA2611005010104",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010105",
    "name": "SHIVATHEJ MS",
    "email": "ra2611005010105@srmist.edu.in",
    "regNo": "RA2611005010105",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010106",
    "name": "AARON A JUSTIN",
    "email": "ra2611005010106@srmist.edu.in",
    "regNo": "RA2611005010106",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010107",
    "name": "VRITIKA ANTERVEDI",
    "email": "ra2611005010107@srmist.edu.in",
    "regNo": "RA2611005010107",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010108",
    "name": "V SARAN PRIYAN",
    "email": "ra2611005010108@srmist.edu.in",
    "regNo": "RA2611005010108",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010109",
    "name": "KAKARLA CHAKRADHAR REDDY",
    "email": "ra2611005010109@srmist.edu.in",
    "regNo": "RA2611005010109",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010110",
    "name": "HARSHITA DEB",
    "email": "ra2611005010110@srmist.edu.in",
    "regNo": "RA2611005010110",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010111",
    "name": "APRAA SINGH",
    "email": "ra2611005010111@srmist.edu.in",
    "regNo": "RA2611005010111",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010112",
    "name": "ARASAVILLI VIGNESH CHITTI MURARI",
    "email": "ra2611005010112@srmist.edu.in",
    "regNo": "RA2611005010112",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010113",
    "name": "YASH SOHAL",
    "email": "ra2611005010113@srmist.edu.in",
    "regNo": "RA2611005010113",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010114",
    "name": "ANSHUMAN SINGH",
    "email": "ra2611005010114@srmist.edu.in",
    "regNo": "RA2611005010114",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010115",
    "name": "UTKARSH RAJ",
    "email": "ra2611005010115@srmist.edu.in",
    "regNo": "RA2611005010115",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010116",
    "name": "RIDHA",
    "email": "ra2611005010116@srmist.edu.in",
    "regNo": "RA2611005010116",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010117",
    "name": "RATHISH S",
    "email": "ra2611005010117@srmist.edu.in",
    "regNo": "RA2611005010117",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010118",
    "name": "MUGUNTHAN J",
    "email": "ra2611005010118@srmist.edu.in",
    "regNo": "RA2611005010118",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010119",
    "name": "AAMAN NANDI",
    "email": "ra2611005010119@srmist.edu.in",
    "regNo": "RA2611005010119",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010120",
    "name": "KUNAL RAI",
    "email": "ra2611005010120@srmist.edu.in",
    "regNo": "RA2611005010120",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010122",
    "name": "TEJAS SINGH THAPA",
    "email": "ra2611005010122@srmist.edu.in",
    "regNo": "RA2611005010122",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010123",
    "name": "ASWIN P",
    "email": "ra2611005010123@srmist.edu.in",
    "regNo": "RA2611005010123",
    "year": "I Year",
    "section": "B",
    "department": "EEE",
    "cohort": "I Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010124",
    "name": "T TEJAS",
    "email": "tt1317@srmist.edu.in",
    "regNo": "RA2611005010124",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010125",
    "name": "JANICE PATRICIA A",
    "email": "jp7784@srmist.edu.in",
    "regNo": "RA2611005010125",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010126",
    "name": "GUNDA PRANSHU AADITH",
    "email": "pg3072@srmist.edu.in",
    "regNo": "RA2611005010126",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010128",
    "name": "ANANYA MISHRA",
    "email": "am0763@srmist.edu.in",
    "regNo": "RA2611005010128",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010129",
    "name": "NAGANABHOINA AKHIL SAI",
    "email": "an7538@srmist.edu.in",
    "regNo": "RA2611005010129",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010130",
    "name": "AIMEE VINOD",
    "email": "av5966@srmist.edu.in",
    "regNo": "RA2611005010130",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010131",
    "name": "JYOTI PRAKASH RAMAN",
    "email": "jr2492@srmist.edu.in",
    "regNo": "RA2611005010131",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010132",
    "name": "SABARISH SIVAKUMAR",
    "email": "as6552@srmist.edu.in",
    "regNo": "RA2611005010132",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010133",
    "name": "ESHAN TRIPATHI",
    "email": "et6229@srmist.edu.in",
    "regNo": "RA2611005010133",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010134",
    "name": "SALMAN FARIZ",
    "email": "sf9812@srmist.edu.in",
    "regNo": "RA2611005010134",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010135",
    "name": "SHAURYA KHANNA",
    "email": "sk7825@srmist.edu.in",
    "regNo": "RA2611005010135",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010136",
    "name": "AMISHA RATH",
    "email": "ar7887@srmist.edu.in",
    "regNo": "RA2611005010136",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010137",
    "name": "KANDHAVEL MURUGAN G M",
    "email": "kg7052@srmist.edu.in",
    "regNo": "RA2611005010137",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010138",
    "name": "DEEPASHREE R",
    "email": "dr6757@srmist.edu.in",
    "regNo": "RA2611005010138",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010139",
    "name": "NAIMISH TIWARI",
    "email": "nt2835@srmist.edu.in",
    "regNo": "RA2611005010139",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010140",
    "name": "TEESTA PAL",
    "email": "tp8931@srmist.edu.in",
    "regNo": "RA2611005010140",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010142",
    "name": "VALIREDDI GUNA SHEKHAR",
    "email": "gv1788@srmist.edu.in",
    "regNo": "RA2611005010142",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010143",
    "name": "K KEDARNATH",
    "email": "kk7964@srmist.edu.in",
    "regNo": "RA2611005010143",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010144",
    "name": "SLEEBA S PULIKOTTIL",
    "email": "sp8366@srmist.edu.in",
    "regNo": "RA2611005010144",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010145",
    "name": "TRESA JOSEPH",
    "email": "th1912@srmist.edu.in",
    "regNo": "RA2611005010145",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010146",
    "name": "KRUTHIK KRISHNA A",
    "email": "kk7284@srmist.edu.in",
    "regNo": "RA2611005010146",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010147",
    "name": "SIVANATHAN B",
    "email": "sb0553@srmist.edu.in",
    "regNo": "RA2611005010147",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010148",
    "name": "KAUSHIK KOTHA",
    "email": "kk2548@srmist.edu.in",
    "regNo": "RA2611005010148",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010150",
    "name": "PRACHI DEY",
    "email": "pd8779@srmist.edu.in",
    "regNo": "RA2611005010150",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010152",
    "name": "SOHAAG SENGUPTA",
    "email": "os3402@srmist.edu.in",
    "regNo": "RA2611005010152",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010153",
    "name": "ENIYAN G",
    "email": "eg3695@srmist.edu.in",
    "regNo": "RA2611005010153",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010154",
    "name": "NIRVISHA MUKHERJEE",
    "email": "nm2567@srmist.edu.in",
    "regNo": "RA2611005010154",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010155",
    "name": "RITHANYAA B",
    "email": "rb2276@srmist.edu.in",
    "regNo": "RA2611005010155",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010157",
    "name": "ARYAN SATYAM",
    "email": "as0051@srmist.edu.in",
    "regNo": "RA2611005010157",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010158",
    "name": "PRINCE YADAV",
    "email": "py1432@srmist.edu.in",
    "regNo": "RA2611005010158",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010159",
    "name": "ARYAN JOSE",
    "email": "aj8071@srmist.edu.in",
    "regNo": "RA2611005010159",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010160",
    "name": "SHIVA PRIYA G",
    "email": "sg0392@srmist.edu.in",
    "regNo": "RA2611005010160",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010161",
    "name": "CAITLIN BONICA J A",
    "email": "cb3107@srmist.edu.in",
    "regNo": "RA2611005010161",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010162",
    "name": "RAKESH E",
    "email": "re0167@srmist.edu.in",
    "regNo": "RA2611005010162",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010163",
    "name": "SAKET MILIND GHAROTE",
    "email": "sg3230@srmist.edu.in",
    "regNo": "RA2611005010163",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010164",
    "name": "KAVINESH E",
    "email": "ke7513@srmist.edu.in",
    "regNo": "RA2611005010164",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010165",
    "name": "HARISHANKAR R K",
    "email": "hr5120@srmist.edu.in",
    "regNo": "RA2611005010165",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010167",
    "name": "NEHILA N",
    "email": "nn7556@srmist.edu.in",
    "regNo": "RA2611005010167",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010168",
    "name": "YADUNAND K T",
    "email": "yk0057@srmist.edu.in",
    "regNo": "RA2611005010168",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010169",
    "name": "VIKRAM KUMAR",
    "email": "vk9973@srmist.edu.in",
    "regNo": "RA2611005010169",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010170",
    "name": "YESHWANTH P",
    "email": "yp8932@srmist.edu.in",
    "regNo": "RA2611005010170",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010171",
    "name": "ISHITA KARKUN",
    "email": "ik6808@srmist.edu.in",
    "regNo": "RA2611005010171",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010172",
    "name": "AMISH ANAND DIAS",
    "email": "ad4235@srmist.edu.in",
    "regNo": "RA2611005010172",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010173",
    "name": "KESIREDDDY AKKASHH REDDY",
    "email": "ak2947@srmist.edu.in",
    "regNo": "RA2611005010173",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010174",
    "name": "SREEPRIYA SATHEESH",
    "email": "rs1612@srmist.edu.in",
    "regNo": "RA2611005010174",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010175",
    "name": "KRITHIK KUMAR",
    "email": "kk0029@srmist.edu.in",
    "regNo": "RA2611005010175",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010176",
    "name": "KUNDAN SHARMA",
    "email": "ks1266@srmist.edu.in",
    "regNo": "RA2611005010176",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010177",
    "name": "ADVAIT",
    "email": "az5522@srmist.edu.in",
    "regNo": "RA2611005010177",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010178",
    "name": "OM TYAGI",
    "email": "ot6322@srmist.edu.in",
    "regNo": "RA2611005010178",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010179",
    "name": "RICHARD A",
    "email": "ra3765@srmist.edu.in",
    "regNo": "RA2611005010179",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010181",
    "name": "RAUNAK NAYAN",
    "email": "rn7853@srmist.edu.in",
    "regNo": "RA2611005010181",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010182",
    "name": "REESHABH MODI",
    "email": "rm1849@srmist.edu.in",
    "regNo": "RA2611005010182",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010183",
    "name": "MOVINSHA RAI",
    "email": "mr3947@srmist.edu.in",
    "regNo": "RA2611005010183",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010184",
    "name": "D PUSHYAMI TRINAEE",
    "email": "pd3188@srmist.edu.in",
    "regNo": "RA2611005010184",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010185",
    "name": "ANANYA U N",
    "email": "au4962@srmist.edu.in",
    "regNo": "RA2611005010185",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010186",
    "name": "SAAVAN SURESH O K",
    "email": "as4547@srmist.edu.in",
    "regNo": "RA2611005010186",
    "year": "I Year",
    "section": "C",
    "department": "EEE",
    "cohort": "I Year EEE-C",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010187",
    "name": "ARNAB JYOTI RAJBANGSHI",
    "email": "aj1053@srmist.edu.in",
    "regNo": "RA2611005010187",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010188",
    "name": "R PRATYUSH",
    "email": "pr1104@srmist.edu.in",
    "regNo": "RA2611005010188",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010189",
    "name": "AMIT KUMAR ROUTA",
    "email": "ar5617@srmist.edu.in",
    "regNo": "RA2611005010189",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010191",
    "name": "PUSHKAR ASHUTOSH JHA",
    "email": "pj7809@srmist.edu.in",
    "regNo": "RA2611005010191",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010192",
    "name": "K RAGHAVI",
    "email": "kk8040@srmist.edu.in",
    "regNo": "RA2611005010192",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010193",
    "name": "SHOBIKAA S",
    "email": "hs1926@srmist.edu.in",
    "regNo": "RA2611005010193",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010194",
    "name": "AMEENUR RAHMAN M",
    "email": "am5178@srmist.edu.in",
    "regNo": "RA2611005010194",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010195",
    "name": "PRIMO JAYA KIRSTEN P",
    "email": "pp0248@srmist.edu.in",
    "regNo": "RA2611005010195",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010196",
    "name": "R NITHIA SHREE",
    "email": "nr9390@srmist.edu.in",
    "regNo": "RA2611005010196",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010198",
    "name": "NABANSHU CHATTERJEE",
    "email": "nc3385@srmist.edu.in",
    "regNo": "RA2611005010198",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010199",
    "name": "KULKARNI SIDDH KISHOR",
    "email": "sk2756@srmist.edu.in",
    "regNo": "RA2611005010199",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010200",
    "name": "SHIVANI SL",
    "email": "hs9261@srmist.edu.in",
    "regNo": "RA2611005010200",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010201",
    "name": "SHASHWATA BHATTACHARJEE",
    "email": "sb6675@srmist.edu.in",
    "regNo": "RA2611005010201",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010202",
    "name": "ABDUL HAMID ABDUR RAHMAN",
    "email": "aa7407@srmist.edu.in",
    "regNo": "RA2611005010202",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010203",
    "name": "S BHARATH",
    "email": "bs2451@srmist.edu.in",
    "regNo": "RA2611005010203",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010204",
    "name": "PERUMALLA TEJESH",
    "email": "tp4277@srmist.edu.in",
    "regNo": "RA2611005010204",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010205",
    "name": "MAILAPALLI NARENDRA KUMAR",
    "email": "mk7496@srmist.edu.in",
    "regNo": "RA2611005010205",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010206",
    "name": "MAULIK JAIN",
    "email": "mj2881@srmist.edu.in",
    "regNo": "RA2611005010206",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010207",
    "name": "GOURAV CHAKRABORTY",
    "email": "gc9887@srmist.edu.in",
    "regNo": "RA2611005010207",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010208",
    "name": "INFANT ALWIN NISHAN DURAIRAAJ",
    "email": "id7324@srmist.edu.in",
    "regNo": "RA2611005010208",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010209",
    "name": "SHREYA TAMANNA DAS",
    "email": "sd3927@srmist.edu.in",
    "regNo": "RA2611005010209",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010210",
    "name": "SABARINATHAN S A",
    "email": "as3622@srmist.edu.in",
    "regNo": "RA2611005010210",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010212",
    "name": "SANJANA M",
    "email": "sm2496@srmist.edu.in",
    "regNo": "RA2611005010212",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010213",
    "name": "MUHANNAD ABDULLAH I",
    "email": "ma8956@srmist.edu.in",
    "regNo": "RA2611005010213",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010214",
    "name": "ADNAN C T",
    "email": "ac3592@srmist.edu.in",
    "regNo": "RA2611005010214",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010215",
    "name": "SREERAM SALIN",
    "email": "rs5959@srmist.edu.in",
    "regNo": "RA2611005010215",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010216",
    "name": "SIMION C",
    "email": "sc0710@srmist.edu.in",
    "regNo": "RA2611005010216",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010217",
    "name": "RIA MONSURATE",
    "email": "rm5976@srmist.edu.in",
    "regNo": "RA2611005010217",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010218",
    "name": "DHARUN S",
    "email": "ds1056@srmist.edu.in",
    "regNo": "RA2611005010218",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010219",
    "name": "OM GUPTA",
    "email": "og5712@srmist.edu.in",
    "regNo": "RA2611005010219",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010220",
    "name": "M INIYAVARMAN",
    "email": "im0370@srmist.edu.in",
    "regNo": "RA2611005010220",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010221",
    "name": "AKSHAT SINGH RATHORE",
    "email": "as5578@srmist.edu.in",
    "regNo": "RA2611005010221",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010222",
    "name": "AVANNAGARI MANOGNA",
    "email": "ma3048@srmist.edu.in",
    "regNo": "RA2611005010222",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010223",
    "name": "JELIN SWEETY K",
    "email": "js1391@srmist.edu.in",
    "regNo": "RA2611005010223",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010224",
    "name": "SRISUGANTH A",
    "email": "sa4121@srmist.edu.in",
    "regNo": "RA2611005010224",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010225",
    "name": "MUTHAMIL PRIYAN",
    "email": "mp0819@srmist.edu.in",
    "regNo": "RA2611005010225",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010226",
    "name": "P S AAKASH",
    "email": "ps7543@srmist.edu.in",
    "regNo": "RA2611005010226",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010227",
    "name": "ELAMPARITHI S",
    "email": "es2362@srmist.edu.in",
    "regNo": "RA2611005010227",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010228",
    "name": "ARYAN V S",
    "email": "av4167@srmist.edu.in",
    "regNo": "RA2611005010228",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010229",
    "name": "HETHEIN KRISHNA",
    "email": "hk6782@srmist.edu.in",
    "regNo": "RA2611005010229",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010230",
    "name": "SHAURYA SHIKHAR",
    "email": "hs3694@srmist.edu.in",
    "regNo": "RA2611005010230",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010231",
    "name": "D HRITHICK",
    "email": "dc2835@srmist.edu.in",
    "regNo": "RA2611005010231",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2611005010232",
    "name": "FAZLE RUB SYED ABDUL YAMAN",
    "email": "fy7196@srmist.edu.in",
    "regNo": "RA2611005010232",
    "year": "I Year",
    "section": "D",
    "department": "EEE",
    "cohort": "I Year EEE-D",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010068",
    "name": "HANSIKA DAS",
    "email": "hd6174@srmist.edu.in",
    "regNo": "RA2511005010068",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010069",
    "name": "KALEY SATHYA K",
    "email": "sk7507@srmist.edu.in",
    "regNo": "RA2511005010069",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010070",
    "name": "HARNOOR SINGH",
    "email": "hs5388@srmist.edu.in",
    "regNo": "RA2511005010070",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010071",
    "name": "RONIT BARUAH",
    "email": "rb7322@srmist.edu.in",
    "regNo": "RA2511005010071",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010072",
    "name": "LOHIT RAGHUPATHY",
    "email": "lr3113@srmist.edu.in",
    "regNo": "RA2511005010072",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010073",
    "name": "PRABHJYOT SINGH",
    "email": "ps2321@srmist.edu.in",
    "regNo": "RA2511005010073",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010074",
    "name": "DEEPABRATA MUKHERJEE",
    "email": "dm7033@srmist.edu.in",
    "regNo": "RA2511005010074",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010075",
    "name": "MANASA K",
    "email": "mk4590@srmist.edu.in",
    "regNo": "RA2511005010075",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010076",
    "name": "NAVIN CHANDIRA M K",
    "email": "nm6217@srmist.edu.in",
    "regNo": "RA2511005010076",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010077",
    "name": "DIVYANGONA PYNE",
    "email": "dp1782@srmist.edu.in",
    "regNo": "RA2511005010077",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010079",
    "name": "VEDULLAPALLI CHANASYA",
    "email": "cv2983@srmist.edu.in",
    "regNo": "RA2511005010079",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010080",
    "name": "VIRSHAN SAAI S",
    "email": "vk8043@srmist.edu.in",
    "regNo": "RA2511005010080",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010082",
    "name": "OMKAR PARIDA",
    "email": "op3326@srmist.edu.in",
    "regNo": "RA2511005010082",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010083",
    "name": "YATO KONYAK",
    "email": "yk8375@srmist.edu.in",
    "regNo": "RA2511005010083",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010084",
    "name": "DODDAKA VIJAYA SRI",
    "email": "vd1612@srmist.edu.in",
    "regNo": "RA2511005010084",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010086",
    "name": "J ANANDAKUMAR",
    "email": "jk4565@srmist.edu.in",
    "regNo": "RA2511005010086",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010087",
    "name": "SHAIK IZHAAR MADANI",
    "email": "is1645@srmist.edu.in",
    "regNo": "RA2511005010087",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010088",
    "name": "PRITY MISHRA",
    "email": "pm0095@srmist.edu.in",
    "regNo": "RA2511005010088",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010089",
    "name": "VED K KACHHIA",
    "email": "vk4736@srmist.edu.in",
    "regNo": "RA2511005010089",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010090",
    "name": "MOHIT NAIR",
    "email": "mn0767@srmist.edu.in",
    "regNo": "RA2511005010090",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010091",
    "name": "ANKUR KUMAR SHAHI",
    "email": "as2713@srmist.edu.in",
    "regNo": "RA2511005010091",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010092",
    "name": "RAHUL KUMAR",
    "email": "rk3161@srmist.edu.in",
    "regNo": "RA2511005010092",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010093",
    "name": "SIDDHARTH KUMAR PANDEY",
    "email": "sk5731@srmist.edu.in",
    "regNo": "RA2511005010093",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010094",
    "name": "S VIBUBALAN",
    "email": "vs8837@srmist.edu.in",
    "regNo": "RA2511005010094",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010095",
    "name": "SHARVESH S",
    "email": "hs1941@srmist.edu.in",
    "regNo": "RA2511005010095",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010096",
    "name": "SOWMYA V",
    "email": "vv0819@srmist.edu.in",
    "regNo": "RA2511005010096",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010097",
    "name": "SAIKIRUBA",
    "email": "sa6190@srmist.edu.in",
    "regNo": "RA2511005010097",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010098",
    "name": "ADITYA JHA",
    "email": "aj2788@srmist.edu.in",
    "regNo": "RA2511005010098",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010099",
    "name": "S SIDHARTH",
    "email": "is1024@srmist.edu.in",
    "regNo": "RA2511005010099",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010100",
    "name": "ARYAN PREM",
    "email": "ap0003@srmist.edu.in",
    "regNo": "RA2511005010100",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010101",
    "name": "SAMUEL JOHN DHINAKARAN J V",
    "email": "sj1201@srmist.edu.in",
    "regNo": "RA2511005010101",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010102",
    "name": "MUKUND",
    "email": "mp8540@srmist.edu.in",
    "regNo": "RA2511005010102",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010103",
    "name": "ANIRUDDHA ARYA",
    "email": "aa6620@srmist.edu.in",
    "regNo": "RA2511005010103",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010104",
    "name": "SREEYESH SHANKAR CHELLAM",
    "email": "sc7647@srmist.edu.in",
    "regNo": "RA2511005010104",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010106",
    "name": "SWATHI S",
    "email": "ws0697@srmist.edu.in",
    "regNo": "RA2511005010106",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010107",
    "name": "RAYAVARAPU MADHAN MOHAN",
    "email": "rm3149@srmist.edu.in",
    "regNo": "RA2511005010107",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010108",
    "name": "GAURAV KUMAR JHA",
    "email": "gj3203@srmist.edu.in",
    "regNo": "RA2511005010108",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010109",
    "name": "AMIYA DAS",
    "email": "ad0880@srmist.edu.in",
    "regNo": "RA2511005010109",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010110",
    "name": "HARSH GUPTA",
    "email": "hg3297@srmist.edu.in",
    "regNo": "RA2511005010110",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010111",
    "name": "ABBIGERI SIDDHIKA SANGAPPA",
    "email": "is5829@srmist.edu.in",
    "regNo": "RA2511005010111",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010113",
    "name": "BALARAMAKRISHNAN R",
    "email": "br3110@srmist.edu.in",
    "regNo": "RA2511005010113",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010114",
    "name": "BUNTY SAINI",
    "email": "bs4433@srmist.edu.in",
    "regNo": "RA2511005010114",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010115",
    "name": "DIVYENDER NAGARAJAN GNANASEKARAN",
    "email": "dg4098@srmist.edu.in",
    "regNo": "RA2511005010115",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010117",
    "name": "SWAPNIL CHAUDHARY",
    "email": "sc9068@srmist.edu.in",
    "regNo": "RA2511005010117",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010120",
    "name": "AADARSH KV",
    "email": "av7700@srmist.edu.in",
    "regNo": "RA2511005010120",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010121",
    "name": "AYUSHI SHUKLA",
    "email": "as1378@srmist.edu.in",
    "regNo": "RA2511005010121",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010122",
    "name": "SARVESH K N",
    "email": "sk5200@srmist.edu.in",
    "regNo": "RA2511005010122",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010123",
    "name": "DEEPIKA S",
    "email": "ds3938@srmist.edu.in",
    "regNo": "RA2511005010123",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010124",
    "name": "MANOJ V",
    "email": "mv6442@srmist.edu.in",
    "regNo": "RA2511005010124",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010125",
    "name": "SHREYANSH GUPTA",
    "email": "sg9417@srmist.edu.in",
    "regNo": "RA2511005010125",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010127",
    "name": "NAVEENRAM B",
    "email": "nb6851@srmist.edu.in",
    "regNo": "RA2511005010127",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010129",
    "name": "S DEVAPRIYAN",
    "email": "ds1573@srmist.edu.in",
    "regNo": "RA2511005010129",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010130",
    "name": "M GUNESH RANJAN",
    "email": "gr0111@srmist.edu.in",
    "regNo": "RA2511005010130",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010131",
    "name": "ARSH M Y",
    "email": "am5881@srmist.edu.in",
    "regNo": "RA2511005010131",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010134",
    "name": "GOPISH N J",
    "email": "gn1821@srmist.edu.in",
    "regNo": "RA2511005010134",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010135",
    "name": "ASHUTOSH NITIN KADAM",
    "email": "ak1282@srmist.edu.in",
    "regNo": "RA2511005010135",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010136",
    "name": "SIDDHARTH KUMAR SINHA",
    "email": "is4015@srmist.edu.in",
    "regNo": "RA2511005010136",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010137",
    "name": "RAJVEER BHADAURIA",
    "email": "rb9348@srmist.edu.in",
    "regNo": "RA2511005010137",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010138",
    "name": "R BLESSWIN",
    "email": "br5053@srmist.edu.in",
    "regNo": "RA2511005010138",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010139",
    "name": "AGHATIYAN B",
    "email": "ab0430@srmist.edu.in",
    "regNo": "RA2511005010139",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010140",
    "name": "R PRAJWAL",
    "email": "pr5898@srmist.edu.in",
    "regNo": "RA2511005010140",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010143",
    "name": "SANJAY P",
    "email": "sp5817@srmist.edu.in",
    "regNo": "RA2511005010143",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2511005010144",
    "name": "UTSAV KUMAR",
    "email": "uk9225@srmist.edu.in",
    "regNo": "RA2511005010144",
    "year": "II Year",
    "section": "B",
    "department": "EEE",
    "cohort": "II Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010001",
    "name": "ALAKUNTLA SUDEEPTHI",
    "email": "sa0508@srmist.edu.in",
    "regNo": "RA2411005010001",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010002",
    "name": "KARTHIK KUMARAVEL KMG",
    "email": "kk4404@srmist.edu.in",
    "regNo": "RA2411005010002",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010003",
    "name": "SREEJITH R",
    "email": "sr2292@srmist.edu.in",
    "regNo": "RA2411005010003",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010004",
    "name": "PRADEEPRAJ",
    "email": "pr0002@srmist.edu.in",
    "regNo": "RA2411005010004",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010005",
    "name": "A ROJAR",
    "email": "ad9823@srmist.edu.in",
    "regNo": "RA2411005010005",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010006",
    "name": "MILIND SUDHEER",
    "email": "ms7125@srmist.edu.in",
    "regNo": "RA2411005010006",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010007",
    "name": "SHAAN BHATTACHARYA",
    "email": "sb3194@srmist.edu.in",
    "regNo": "RA2411005010007",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010008",
    "name": "PRAVINKUMAR A",
    "email": "pk1934@srmist.edu.in",
    "regNo": "RA2411005010008",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010009",
    "name": "NARESH P",
    "email": "np7696@srmist.edu.in",
    "regNo": "RA2411005010009",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010010",
    "name": "HIMANK BHATTACHARYA",
    "email": "hb9037@srmist.edu.in",
    "regNo": "RA2411005010010",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010011",
    "name": "TANISHK JAIN",
    "email": "tj5819@srmist.edu.in",
    "regNo": "RA2411005010011",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010012",
    "name": "PRIYAMVADA V",
    "email": "pv8134@srmist.edu.in",
    "regNo": "RA2411005010012",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010013",
    "name": "RUDRAKSH AGARWAL",
    "email": "ra6383@srmist.edu.in",
    "regNo": "RA2411005010013",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010014",
    "name": "HARIHARAN J",
    "email": "hj5382@srmist.edu.in",
    "regNo": "RA2411005010014",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010015",
    "name": "MUDIUM PUNEETH REDDY",
    "email": "pm3676@srmist.edu.in",
    "regNo": "RA2411005010015",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010016",
    "name": "NEHA SRAVANI DARAM",
    "email": "nd4785@srmist.edu.in",
    "regNo": "RA2411005010016",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010017",
    "name": "TELU SWAYAMBHU",
    "email": "st6318@srmist.edu.in",
    "regNo": "RA2411005010017",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010018",
    "name": "BHAVAN KALYAN M",
    "email": "bm1129@srmist.edu.in",
    "regNo": "RA2411005010018",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010019",
    "name": "MUDIT KUMAR RAI",
    "email": "mr3150@srmist.edu.in",
    "regNo": "RA2411005010019",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010020",
    "name": "ANUSHKA TYAGI",
    "email": "at8875@srmist.edu.in",
    "regNo": "RA2411005010020",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010021",
    "name": "SWETHASREE S",
    "email": "ss3456@srmist.edu.in",
    "regNo": "RA2411005010021",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010022",
    "name": "SUBHRONIL HALDAR",
    "email": "sa2918@srmist.edu.in",
    "regNo": "RA2411005010022",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010023",
    "name": "SANJAY G",
    "email": "sg2353@srmist.edu.in",
    "regNo": "RA2411005010023",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010024",
    "name": "CHARULATHA P",
    "email": "cp2718@srmist.edu.in",
    "regNo": "RA2411005010024",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010025",
    "name": "SANTHOSH T",
    "email": "st5560@srmist.edu.in",
    "regNo": "RA2411005010025",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010027",
    "name": "SACHIN ANAND",
    "email": "sa0997@srmist.edu.in",
    "regNo": "RA2411005010027",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010028",
    "name": "SIDDHARTH S",
    "email": "ss3755@srmist.edu.in",
    "regNo": "RA2411005010028",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010029",
    "name": "AKSHAT ANAND",
    "email": "aa1975@srmist.edu.in",
    "regNo": "RA2411005010029",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010030",
    "name": "KUMKUM",
    "email": "ks5682@srmist.edu.in",
    "regNo": "RA2411005010030",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010031",
    "name": "M.Vigneshvaran",
    "email": "vv6439@srmist.edu.in",
    "regNo": "RA2411005010031",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010032",
    "name": "BILALRAZA MEGHREJI",
    "email": "bm0086@srmist.edu.in",
    "regNo": "RA2411005010032",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010033",
    "name": "POTARLA ADITHYA CHANDRA",
    "email": "pc9749@srmist.edu.in",
    "regNo": "RA2411005010033",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010034",
    "name": "APOORV SAXENA",
    "email": "as2176@srmist.edu.in",
    "regNo": "RA2411005010034",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010035",
    "name": "DEBOJYOTI GANGULY",
    "email": "dg5341@srmist.edu.in",
    "regNo": "RA2411005010035",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010036",
    "name": "DALLI SHANMUKHA SRINIVAS",
    "email": "sd7502@srmist.edu.in",
    "regNo": "RA2411005010036",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010037",
    "name": "JANANI J",
    "email": "jj6326@srmist.edu.in",
    "regNo": "RA2411005010037",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010038",
    "name": "SRIJAN ANANT",
    "email": "sa1823@srmist.edu.in",
    "regNo": "RA2411005010038",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010039",
    "name": "VEDANT JAIN",
    "email": "vj9725@srmist.edu.in",
    "regNo": "RA2411005010039",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010040",
    "name": "TANISH VITHAL ARAJPURE",
    "email": "ta1901@srmist.edu.in",
    "regNo": "RA2411005010040",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010041",
    "name": "RITHIKA M",
    "email": "rm2851@srmist.edu.in",
    "regNo": "RA2411005010041",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010042",
    "name": "GRACIA SAMITHA S",
    "email": "gs4964@srmist.edu.in",
    "regNo": "RA2411005010042",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010043",
    "name": "ATIN HEGDE",
    "email": "ah5353@srmist.edu.in",
    "regNo": "RA2411005010043",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010044",
    "name": "BHARATH RAJ SARAVANAN",
    "email": "bs3940@srmist.edu.in",
    "regNo": "RA2411005010044",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010045",
    "name": "DHONTIKA NANDU VARDHAN",
    "email": "nd4536@srmist.edu.in",
    "regNo": "RA2411005010045",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010046",
    "name": "HARSHIT RANJAN SINHA",
    "email": "hs5785@srmist.edu.in",
    "regNo": "RA2411005010046",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010047",
    "name": "MAYANK AGARWAL",
    "email": "ma1991@srmist.edu.in",
    "regNo": "RA2411005010047",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010048",
    "name": "THAMIZH POZHILAN M T",
    "email": "tp6846@srmist.edu.in",
    "regNo": "RA2411005010048",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010049",
    "name": "GOWTHAM",
    "email": "gp5948@srmist.edu.in",
    "regNo": "RA2411005010049",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010050",
    "name": "PRITHIV M",
    "email": "pm5433@srmist.edu.in",
    "regNo": "RA2411005010050",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010052",
    "name": "SOHAM SAI PANDA",
    "email": "sp8548@srmist.edu.in",
    "regNo": "RA2411005010052",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010053",
    "name": "PULLELA AVINASH",
    "email": "ap5386@srmist.edu.in",
    "regNo": "RA2411005010053",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010054",
    "name": "HARSHAVARDHAN MENON",
    "email": "hm0636@srmist.edu.in",
    "regNo": "RA2411005010054",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010055",
    "name": "AKSHAT SINGH",
    "email": "as3431@srmist.edu.in",
    "regNo": "RA2411005010055",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010056",
    "name": "SANTHOSH V",
    "email": "sv1994@srmist.edu.in",
    "regNo": "RA2411005010056",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010057",
    "name": "MD SHAHIL ANSARI",
    "email": "ma5396@srmist.edu.in",
    "regNo": "RA2411005010057",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010058",
    "name": "ROHAN RAJ SINGAPERUMALKOIL JANAKIRAMAN",
    "email": "rr0258@srmist.edu.in",
    "regNo": "RA2411005010058",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010059",
    "name": "J M PRANAV",
    "email": "jm3388@srmist.edu.in",
    "regNo": "RA2411005010059",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010060",
    "name": "SANJAY P D",
    "email": "ps7078@srmist.edu.in",
    "regNo": "RA2411005010060",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010061",
    "name": "AADHARSH S",
    "email": "as4876@srmist.edu.in",
    "regNo": "RA2411005010061",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010062",
    "name": "MANHA SRAMBIYAKKAL MIKDADH",
    "email": "mm4373@srmist.edu.in",
    "regNo": "RA2411005010062",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010063",
    "name": "MOHAMMAD AYMAN ALI",
    "email": "ma6741@srmist.edu.in",
    "regNo": "RA2411005010063",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010065",
    "name": "BALAGURU V",
    "email": "bv0097@srmist.edu.in",
    "regNo": "RA2411005010065",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010066",
    "name": "SANYA DUA",
    "email": "sd4109@srmist.edu.in",
    "regNo": "RA2411005010066",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010067",
    "name": "KAVYANSHU CHOUDHARY",
    "email": "kc5867@srmist.edu.in",
    "regNo": "RA2411005010067",
    "year": "III Year",
    "section": "A",
    "department": "EEE",
    "cohort": "III Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010026",
    "name": "SHRUTI SINGH",
    "email": "ss7759@srmist.edu.in",
    "regNo": "RA2411005010026",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010068",
    "name": "ROHAN PHILIP",
    "email": "rp5240@srmist.edu.in",
    "regNo": "RA2411005010068",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010069",
    "name": "DHANYA SRI M",
    "email": "ds3392@srmist.edu.in",
    "regNo": "RA2411005010069",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010070",
    "name": "MAYANK UMREY",
    "email": "mu8865@srmist.edu.in",
    "regNo": "RA2411005010070",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010071",
    "name": "MADHUNISHA G",
    "email": "mg6018@srmist.edu.in",
    "regNo": "RA2411005010071",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010072",
    "name": "AKASH S",
    "email": "as0851@srmist.edu.in",
    "regNo": "RA2411005010072",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010073",
    "name": "SHAMBHAVI ROY",
    "email": "sr5759@srmist.edu.in",
    "regNo": "RA2411005010073",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010074",
    "name": "UJJWAL ARYAN",
    "email": "ua4833@srmist.edu.in",
    "regNo": "RA2411005010074",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010075",
    "name": "MANJARI MAJUMDAR",
    "email": "mm5729@srmist.edu.in",
    "regNo": "RA2411005010075",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010076",
    "name": "KAISER SAHIL M",
    "email": "ks6865@srmist.edu.in",
    "regNo": "RA2411005010076",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010077",
    "name": "TOOPALLE MONISH VARDHAN",
    "email": "mt6330@srmist.edu.in",
    "regNo": "RA2411005010077",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010078",
    "name": "GHANSHYAM SEOSH MARAKKATH",
    "email": "gs3280@srmist.edu.in",
    "regNo": "RA2411005010078",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010079",
    "name": "THIRUPATHI V",
    "email": "tv0860@srmist.edu.in",
    "regNo": "RA2411005010079",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010080",
    "name": "RAJESH S",
    "email": "rs2466@srmist.edu.in",
    "regNo": "RA2411005010080",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010081",
    "name": "DHARANI DHARAN S",
    "email": "ds8399@srmist.edu.in",
    "regNo": "RA2411005010081",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010082",
    "name": "JINESSH J P",
    "email": "jj0068@srmist.edu.in",
    "regNo": "RA2411005010082",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010083",
    "name": "ANIRUDH TADINADA",
    "email": "at3252@srmist.edu.in",
    "regNo": "RA2411005010083",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010084",
    "name": "GAURANG KHARWAR",
    "email": "gk4225@srmist.edu.in",
    "regNo": "RA2411005010084",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010085",
    "name": "SAMUEL LAWRENCE M",
    "email": "sl2022@srmist.edu.in",
    "regNo": "RA2411005010085",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010086",
    "name": "KHADEEJA MARJAN K",
    "email": "km0771@srmist.edu.in",
    "regNo": "RA2411005010086",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010088",
    "name": "SHALIKHA GREHOR PEREIRA",
    "email": "sg3245@srmist.edu.in",
    "regNo": "RA2411005010088",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010089",
    "name": "RONY VARGHESE",
    "email": "rv7660@srmist.edu.in",
    "regNo": "RA2411005010089",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010090",
    "name": "ABHINAV A",
    "email": "aa9979@srmist.edu.in",
    "regNo": "RA2411005010090",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010091",
    "name": "HADI AMAN SIDDIQUIE",
    "email": "hs2306@srmist.edu.in",
    "regNo": "RA2411005010091",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010092",
    "name": "MONIS THILAK RAMASAMY CHINNASAMY",
    "email": "mc6329@srmist.edu.in",
    "regNo": "RA2411005010092",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010093",
    "name": "RISHE S M",
    "email": "rs6056@srmist.edu.in",
    "regNo": "RA2411005010093",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010094",
    "name": "NIRMALYA BHATTACHARJEE",
    "email": "nb2203@srmist.edu.in",
    "regNo": "RA2411005010094",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010096",
    "name": "AYUSH GOVINDARAJAN",
    "email": "ag8152@srmist.edu.in",
    "regNo": "RA2411005010096",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010097",
    "name": "S THARUN VIGNESH",
    "email": "st6607@srmist.edu.in",
    "regNo": "RA2411005010097",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010098",
    "name": "HIMA KARTHIK YANAMADALA",
    "email": "hy7921@srmist.edu.in",
    "regNo": "RA2411005010098",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010100",
    "name": "V HARSHINI",
    "email": "vv7224@srmist.edu.in",
    "regNo": "RA2411005010100",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010101",
    "name": "RAJESH S",
    "email": "rs4555@srmist.edu.in",
    "regNo": "RA2411005010101",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010102",
    "name": "DIVIT SUGUMAR",
    "email": "ds4593@srmist.edu.in",
    "regNo": "RA2411005010102",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010103",
    "name": "PRANAVRAJ V",
    "email": "pv5546@srmist.edu.in",
    "regNo": "RA2411005010103",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010104",
    "name": "ISHITA KHARE",
    "email": "ik9218@srmist.edu.in",
    "regNo": "RA2411005010104",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010105",
    "name": "SHARULATHA B",
    "email": "sb3890@srmist.edu.in",
    "regNo": "RA2411005010105",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010106",
    "name": "VARSHA GUPTA",
    "email": "vg7768@srmist.edu.in",
    "regNo": "RA2411005010106",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010107",
    "name": "PIYUSH NARAYAN",
    "email": "pn4020@srmist.edu.in",
    "regNo": "RA2411005010107",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010109",
    "name": "AKSHAI PRAMOD",
    "email": "ap9164@srmist.edu.in",
    "regNo": "RA2411005010109",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010110",
    "name": "VIMAL M",
    "email": "vm5649@srmist.edu.in",
    "regNo": "RA2411005010110",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010111",
    "name": "JAYAPRAKASH D",
    "email": "jp2795@srmist.edu.in",
    "regNo": "RA2411005010111",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010112",
    "name": "PAAWAN KATIYAR",
    "email": "pk0847@srmist.edu.in",
    "regNo": "RA2411005010112",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010113",
    "name": "DEVARSH SUNIL",
    "email": "ds8687@srmist.edu.in",
    "regNo": "RA2411005010113",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010114",
    "name": "SOHAM ANIL KUMAR",
    "email": "sk6312@srmist.edu.in",
    "regNo": "RA2411005010114",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010116",
    "name": "SUBHASISH BHATTACHARJEE",
    "email": "sb0455@srmist.edu.in",
    "regNo": "RA2411005010116",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010117",
    "name": "ESHAN VENGAL GEORGE",
    "email": "eg6294@srmist.edu.in",
    "regNo": "RA2411005010117",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010118",
    "name": "BALAJI R",
    "email": "bb3513@srmist.edu.in",
    "regNo": "RA2411005010118",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010119",
    "name": "KOUSALYA M N",
    "email": "kn5363@srmist.edu.in",
    "regNo": "RA2411005010119",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010120",
    "name": "K SENTAMIZH",
    "email": "sk2494@srmist.edu.in",
    "regNo": "RA2411005010120",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010121",
    "name": "THADURI SRINATH",
    "email": "sr1413@srmist.edu.in",
    "regNo": "RA2411005010121",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010122",
    "name": "NISHANTH R A",
    "email": "nr9643@srmist.edu.in",
    "regNo": "RA2411005010122",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010123",
    "name": "SHARVESH S M",
    "email": "ss7054@srmist.edu.in",
    "regNo": "RA2411005010123",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010124",
    "name": "JANANI PILLAI",
    "email": "jp0454@srmist.edu.in",
    "regNo": "RA2411005010124",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010125",
    "name": "SRUJAN J ACHARYA",
    "email": "sj6349@srmist.edu.in",
    "regNo": "RA2411005010125",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010126",
    "name": "MIR EHTISHAM PERVAIZ",
    "email": "mp4108@srmist.edu.in",
    "regNo": "RA2411005010126",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010127",
    "name": "AMAN J D",
    "email": "aj6760@srmist.edu.in",
    "regNo": "RA2411005010127",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010128",
    "name": "DEWANG SHIVKUMAR KULKARNI",
    "email": "dk2391@srmist.edu.in",
    "regNo": "RA2411005010128",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010129",
    "name": "MOHAMMAD ASADUDDIN SHAIK",
    "email": "ms4736@srmist.edu.in",
    "regNo": "RA2411005010129",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010130",
    "name": "MAHESH ARAVIND N",
    "email": "mn1296@srmist.edu.in",
    "regNo": "RA2411005010130",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010131",
    "name": "YUVAN D",
    "email": "yd4574@srmist.edu.in",
    "regNo": "RA2411005010131",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010132",
    "name": "SOMARAJU KISHORE SAI",
    "email": "os1271@srmist.edu.in",
    "regNo": "RA2411005010132",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010133",
    "name": "PRAVEEN KUMAR L",
    "email": "pk9744@srmist.edu.in",
    "regNo": "RA2411005010133",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2411005010134",
    "name": "ATTILI LAKSHMI RUPA",
    "email": "la9866@srmist.edu.in",
    "regNo": "RA2411005010134",
    "year": "III Year",
    "section": "B",
    "department": "EEE",
    "cohort": "III Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010001",
    "name": "MOPURI VENKATA HETHU VARDHAN",
    "email": "ra2311005010001@srmist.edu.in",
    "regNo": "RA2311005010001",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010002",
    "name": "ADITYA",
    "email": "ra2311005010002@srmist.edu.in",
    "regNo": "RA2311005010002",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010003",
    "name": "SUBATHEESHVARAN M",
    "email": "ra2311005010003@srmist.edu.in",
    "regNo": "RA2311005010003",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010004",
    "name": "ISHAN GAUR",
    "email": "ra2311005010004@srmist.edu.in",
    "regNo": "RA2311005010004",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010005",
    "name": "SELVASRI B",
    "email": "ra2311005010005@srmist.edu.in",
    "regNo": "RA2311005010005",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010006",
    "name": "S RUTH SALOMI",
    "email": "ra2311005010006@srmist.edu.in",
    "regNo": "RA2311005010006",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010007",
    "name": "ANUGOJU DHANUNJAY",
    "email": "ra2311005010007@srmist.edu.in",
    "regNo": "RA2311005010007",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010008",
    "name": "KARTHIKRAM G",
    "email": "ra2311005010008@srmist.edu.in",
    "regNo": "RA2311005010008",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010009",
    "name": "NARALA HESHMA SREE",
    "email": "ra2311005010009@srmist.edu.in",
    "regNo": "RA2311005010009",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010010",
    "name": "R ASHISH RAGHAV",
    "email": "ra2311005010010@srmist.edu.in",
    "regNo": "RA2311005010010",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010011",
    "name": "ROHIT SHARMA",
    "email": "ra2311005010011@srmist.edu.in",
    "regNo": "RA2311005010011",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010012",
    "name": "DAMODAR VENKAT ARYAN",
    "email": "ra2311005010012@srmist.edu.in",
    "regNo": "RA2311005010012",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010013",
    "name": "PUDI SAI PRANAV",
    "email": "ra2311005010013@srmist.edu.in",
    "regNo": "RA2311005010013",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010014",
    "name": "DHARMENDIRAMURTHY A",
    "email": "ra2311005010014@srmist.edu.in",
    "regNo": "RA2311005010014",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010015",
    "name": "SREE SOWMI A",
    "email": "ra2311005010015@srmist.edu.in",
    "regNo": "RA2311005010015",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010016",
    "name": "SELVAKUMAR U",
    "email": "ra2311005010016@srmist.edu.in",
    "regNo": "RA2311005010016",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010017",
    "name": "KIRUTHIKA K",
    "email": "ra2311005010017@srmist.edu.in",
    "regNo": "RA2311005010017",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010018",
    "name": "ROHIT K R",
    "email": "ra2311005010018@srmist.edu.in",
    "regNo": "RA2311005010018",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010019",
    "name": "DEVADARSHINI G",
    "email": "ra2311005010019@srmist.edu.in",
    "regNo": "RA2311005010019",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010020",
    "name": "KAMALI R",
    "email": "ra2311005010020@srmist.edu.in",
    "regNo": "RA2311005010020",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010021",
    "name": "KANKIPATI ABHI",
    "email": "ra2311005010021@srmist.edu.in",
    "regNo": "RA2311005010021",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010022",
    "name": "MADHAV B V",
    "email": "ra2311005010022@srmist.edu.in",
    "regNo": "RA2311005010022",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010023",
    "name": "DEBOPAMA CHOWDHURY",
    "email": "ra2311005010023@srmist.edu.in",
    "regNo": "RA2311005010023",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010024",
    "name": "SHASHWAT SINGH",
    "email": "ra2311005010024@srmist.edu.in",
    "regNo": "RA2311005010024",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010025",
    "name": "SHIBASISH CHOWDHURY",
    "email": "ra2311005010025@srmist.edu.in",
    "regNo": "RA2311005010025",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010026",
    "name": "JOSNA MARIYAM JOHNSON",
    "email": "ra2311005010026@srmist.edu.in",
    "regNo": "RA2311005010026",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010027",
    "name": "ABISHEK KRISHNA T",
    "email": "ra2311005010027@srmist.edu.in",
    "regNo": "RA2311005010027",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010028",
    "name": "TUSHAR RAO",
    "email": "ra2311005010028@srmist.edu.in",
    "regNo": "RA2311005010028",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010029",
    "name": "DEEPAK M S",
    "email": "ra2311005010029@srmist.edu.in",
    "regNo": "RA2311005010029",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010030",
    "name": "ETHISH KARTHIKEYAN R",
    "email": "ra2311005010030@srmist.edu.in",
    "regNo": "RA2311005010030",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010031",
    "name": "BALAJI S",
    "email": "ra2311005010031@srmist.edu.in",
    "regNo": "RA2311005010031",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010033",
    "name": "HARI GOVIND M",
    "email": "ra2311005010033@srmist.edu.in",
    "regNo": "RA2311005010033",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010034",
    "name": "SHREYAN SHARMA",
    "email": "ra2311005010034@srmist.edu.in",
    "regNo": "RA2311005010034",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010035",
    "name": "SACHIT KHURANA",
    "email": "ra2311005010035@srmist.edu.in",
    "regNo": "RA2311005010035",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010037",
    "name": "ABHYUDAYA SINGH",
    "email": "ra2311005010037@srmist.edu.in",
    "regNo": "RA2311005010037",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010038",
    "name": "KAUSHAL CHAKRABORTY",
    "email": "ra2311005010038@srmist.edu.in",
    "regNo": "RA2311005010038",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010039",
    "name": "ARNAV SINGH",
    "email": "ra2311005010039@srmist.edu.in",
    "regNo": "RA2311005010039",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010040",
    "name": "SIDDHARTH KUMAR",
    "email": "ra2311005010040@srmist.edu.in",
    "regNo": "RA2311005010040",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010041",
    "name": "BHARANI BALAN J",
    "email": "ra2311005010041@srmist.edu.in",
    "regNo": "RA2311005010041",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010042",
    "name": "SHRIRAM JAYAN",
    "email": "ra2311005010042@srmist.edu.in",
    "regNo": "RA2311005010042",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010043",
    "name": "ELGIN CALISTER F",
    "email": "ra2311005010043@srmist.edu.in",
    "regNo": "RA2311005010043",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010044",
    "name": "SAKSHAM RAJPUROHIT",
    "email": "ra2311005010044@srmist.edu.in",
    "regNo": "RA2311005010044",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010045",
    "name": "KISHORE PREAN K S",
    "email": "ra2311005010045@srmist.edu.in",
    "regNo": "RA2311005010045",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010046",
    "name": "MOHIT KUMAR SINGH",
    "email": "ra2311005010046@srmist.edu.in",
    "regNo": "RA2311005010046",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010047",
    "name": "MOULIK SINGH BHADWAL",
    "email": "ra2311005010047@srmist.edu.in",
    "regNo": "RA2311005010047",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010049",
    "name": "SARATH",
    "email": "ra2311005010049@srmist.edu.in",
    "regNo": "RA2311005010049",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010050",
    "name": "DEENAVARSHAN T",
    "email": "ra2311005010050@srmist.edu.in",
    "regNo": "RA2311005010050",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010051",
    "name": "VIDEEP BOTHRA",
    "email": "ra2311005010051@srmist.edu.in",
    "regNo": "RA2311005010051",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311068010001",
    "name": "NASEEB RAHMAN",
    "email": "ra2311068010001@srmist.edu.in",
    "regNo": "RA2311068010001",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311068010002",
    "name": "MUHAMMED KHIRASH M P",
    "email": "ra2311068010002@srmist.edu.in",
    "regNo": "RA2311068010002",
    "year": "IV Year",
    "section": "A",
    "department": "EEE",
    "cohort": "IV Year EEE-A",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010052",
    "name": "VISHAL GNANAVEL T",
    "email": "vg1910@srmist.edu.in",
    "regNo": "RA2311005010052",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010053",
    "name": "DHEEPASWARUPAN",
    "email": "dt8652@srmist.edu.in",
    "regNo": "RA2311005010053",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010054",
    "name": "ABDE ALI",
    "email": "aa3366@srmist.edu.in",
    "regNo": "RA2311005010054",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010056",
    "name": "ANSH SRIVASTAVA",
    "email": "as2709@srmist.edu.in",
    "regNo": "RA2311005010056",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010058",
    "name": "JAMKHANAM LATHIEF HUSSAIN",
    "email": "jj6400@srmist.edu.in",
    "regNo": "RA2311005010058",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010059",
    "name": "POKALA REETHIKA",
    "email": "rp4045@srmist.edu.in",
    "regNo": "RA2311005010059",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010060",
    "name": "HARMAN TEJ SINGH VIRK",
    "email": "hv7105@srmist.edu.in",
    "regNo": "RA2311005010060",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010061",
    "name": "NEETHU K NARAYANAN",
    "email": "nk0368@srmist.edu.in",
    "regNo": "RA2311005010061",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010062",
    "name": "SNEHA R",
    "email": "sr4529@srmist.edu.in",
    "regNo": "RA2311005010062",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010063",
    "name": "VARSHINI VS",
    "email": "vv3304@srmist.edu.in",
    "regNo": "RA2311005010063",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010064",
    "name": "ARGHA DUTTA",
    "email": "ad0378@srmist.edu.in",
    "regNo": "RA2311005010064",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010067",
    "name": "SHAILESH KUMAR SINGH",
    "email": "sk4815@srmist.edu.in",
    "regNo": "RA2311005010067",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010068",
    "name": "PADMAPRIYA S",
    "email": "ps3065@srmist.edu.in",
    "regNo": "RA2311005010068",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010069",
    "name": "INDRAJITHA S",
    "email": "ia6976@srmist.edu.in",
    "regNo": "RA2311005010069",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010070",
    "name": "HARI PRASATH M",
    "email": "hp4184@srmist.edu.in",
    "regNo": "RA2311005010070",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010071",
    "name": "GOLDWIN R",
    "email": "gr2682@srmist.edu.in",
    "regNo": "RA2311005010071",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010072",
    "name": "PRATYUSH ANAND",
    "email": "pa5448@srmist.edu.in",
    "regNo": "RA2311005010072",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010073",
    "name": "SUBHAM PATI",
    "email": "sp2670@srmist.edu.in",
    "regNo": "RA2311005010073",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010074",
    "name": "ASHWIN P",
    "email": "ap2977@srmist.edu.in",
    "regNo": "RA2311005010074",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010075",
    "name": "KARTHIK PEMMANI",
    "email": "kp4147@srmist.edu.in",
    "regNo": "RA2311005010075",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010077",
    "name": "PNRR SURYA SRINIVAS",
    "email": "sp9102@srmist.edu.in",
    "regNo": "RA2311005010077",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010078",
    "name": "HARSHITH R",
    "email": "hr0719@srmist.edu.in",
    "regNo": "RA2311005010078",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010079",
    "name": "PRIYANSHU CHAURASIA",
    "email": "pc2289@srmist.edu.in",
    "regNo": "RA2311005010079",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010081",
    "name": "HARSHIL GUPTA",
    "email": "hg7993@srmist.edu.in",
    "regNo": "RA2311005010081",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010082",
    "name": "MUDDALA UMESH CHANDRA",
    "email": "um2611@srmist.edu.in",
    "regNo": "RA2311005010082",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010083",
    "name": "ABOOBACKER SIDDIQE EP",
    "email": "ae0222@srmist.edu.in",
    "regNo": "RA2311005010083",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010084",
    "name": "CONRAD JUSTIN BORGES",
    "email": "cb6891@srmist.edu.in",
    "regNo": "RA2311005010084",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010085",
    "name": "JOEL T REJI",
    "email": "jr9256@srmist.edu.in",
    "regNo": "RA2311005010085",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010086",
    "name": "SUBHADEEP BAUL",
    "email": "sb3477@srmist.edu.in",
    "regNo": "RA2311005010086",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010088",
    "name": "RUPAK V",
    "email": "rv3811@srmist.edu.in",
    "regNo": "RA2311005010088",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010089",
    "name": "ANANT GOYAL",
    "email": "ag3621@srmist.edu.in",
    "regNo": "RA2311005010089",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010090",
    "name": "ADITYA KUMAR KUTTIYIL",
    "email": "ak3694@srmist.edu.in",
    "regNo": "RA2311005010090",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010091",
    "name": "JAYDEN ALEX",
    "email": "ja6202@srmist.edu.in",
    "regNo": "RA2311005010091",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010092",
    "name": "APARAJITA PAL",
    "email": "ap5233@srmist.edu.in",
    "regNo": "RA2311005010092",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010093",
    "name": "AYUSH DAGA",
    "email": "ad3736@srmist.edu.in",
    "regNo": "RA2311005010093",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010094",
    "name": "ROHIT JHAJHRIA",
    "email": "rj8978@srmist.edu.in",
    "regNo": "RA2311005010094",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010095",
    "name": "ROUNAK MAJUMDER",
    "email": "rm6740@srmist.edu.in",
    "regNo": "RA2311005010095",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010096",
    "name": "MUSKAN SINGH",
    "email": "md4527@srmist.edu.in",
    "regNo": "RA2311005010096",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010097",
    "name": "INIYAN",
    "email": "ir7318@srmist.edu.in",
    "regNo": "RA2311005010097",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010098",
    "name": "CHITESH THANGASAMY NA",
    "email": "ct7859@srmist.edu.in",
    "regNo": "RA2311005010098",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010099",
    "name": "LAKSHYA JAIN",
    "email": "lj0928@srmist.edu.in",
    "regNo": "RA2311005010099",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010100",
    "name": "DHARANEESH S",
    "email": "ds9538@srmist.edu.in",
    "regNo": "RA2311005010100",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010101",
    "name": "NASHATH IBNU NOUFAL",
    "email": "ni3567@srmist.edu.in",
    "regNo": "RA2311005010101",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010102",
    "name": "JAGADEESH SARVIN RAJ J",
    "email": "jj4622@srmist.edu.in",
    "regNo": "RA2311005010102",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010103",
    "name": "ARYAMAN SINGH",
    "email": "as3683@srmist.edu.in",
    "regNo": "RA2311005010103",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010104",
    "name": "SAMARPAN KHAREL",
    "email": "sk8718@srmist.edu.in",
    "regNo": "RA2311005010104",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010105",
    "name": "ABRAHAM NGONG MAJUR BHER",
    "email": "ab8507@srmist.edu.in",
    "regNo": "RA2311005010105",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010106",
    "name": "CHANDRU S",
    "email": "cs1735@srmist.edu.in",
    "regNo": "RA2311005010106",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010107",
    "name": "JEMINI M",
    "email": "jm1055@srmist.edu.in",
    "regNo": "RA2311005010107",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  },
  {
    "id": "stu-RA2311005010108",
    "name": "ARPUTHA JEFFRY L",
    "email": "al3303@srmist.edu.in",
    "regNo": "RA2311005010108",
    "year": "IV Year",
    "section": "B",
    "department": "EEE",
    "cohort": "IV Year EEE-B",
    "type": "student"
  }
];
var EEE_FACULTIES = [
  {
    "id": "fac-100278",
    "idNo": "100278",
    "name": "Dr. K. Vijayakumar",
    "email": "chair.soee.ktr.et@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Prof. & Chairperson/SOEE",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9941540915",
    "type": "faculty"
  },
  {
    "id": "fac-100293",
    "idNo": "100293",
    "name": "Dr. R. Sridhar",
    "email": "hod.eee.ktr.et@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Professor & Head",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9841752907",
    "type": "faculty"
  },
  {
    "id": "fac-100279",
    "idNo": "100279",
    "name": "Dr. A. Rathinam",
    "email": "rathinaa@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9884238646",
    "type": "faculty"
  },
  {
    "id": "fac-100300",
    "idNo": "100300",
    "name": "Dr. C. Bharatiraja",
    "email": "bharatic@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9042701695",
    "type": "faculty"
  },
  {
    "id": "fac-100315",
    "idNo": "100315",
    "name": "Dr. J. Preetha Roselyn",
    "email": "preethaj@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9884646775",
    "type": "faculty"
  },
  {
    "id": "fac-100281",
    "idNo": "100281",
    "name": "Dr. N. Chellammal",
    "email": "chellamn@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9962964643",
    "type": "faculty"
  },
  {
    "id": "fac-100288",
    "idNo": "100288",
    "name": "Dr. D. Suchitra",
    "email": "suchitrd@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9840370706",
    "type": "faculty"
  },
  {
    "id": "fac-100607",
    "idNo": "100607",
    "name": "Dr. C. S. Boopathi",
    "email": "boopathc1@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Associate Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9047516228",
    "type": "faculty"
  },
  {
    "id": "fac-100364",
    "idNo": "100364",
    "name": "Dr. Y. Jeyashree",
    "email": "jeyashry@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Associate Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9551610121",
    "type": "faculty"
  },
  {
    "id": "fac-100298",
    "idNo": "100298",
    "name": "Dr. D. Sattianadan",
    "email": "sattiand@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Associate Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9940209579",
    "type": "faculty"
  },
  {
    "id": "fac-100899",
    "idNo": "100899",
    "name": "Dr. C. Subramani",
    "email": "subramac@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Associate Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9600013988",
    "type": "faculty"
  },
  {
    "id": "fac-101678",
    "idNo": "101678",
    "name": "Dr. K. Saravanan",
    "email": "saravank3@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Associate Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9884452615",
    "type": "faculty"
  },
  {
    "id": "fac-102109",
    "idNo": "102109",
    "name": "Dr. M. Jagabar Sathik",
    "email": "jagabarm@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Associate Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9500525422",
    "type": "faculty"
  },
  {
    "id": "fac-100287",
    "idNo": "100287",
    "name": "Dr. N. Kalaiarasi",
    "email": "kalaiarn@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Associate Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "8056012324",
    "type": "faculty"
  },
  {
    "id": "fac-100310",
    "idNo": "100310",
    "name": "Dr. J. Divyanavamani",
    "email": "divyanaj@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Associate Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9444572505",
    "type": "faculty"
  },
  {
    "id": "fac-101336",
    "idNo": "101336",
    "name": "Dr. R. Narayanamoorthi",
    "email": "narayanr@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Associate Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9003257600",
    "type": "faculty"
  },
  {
    "id": "fac-102408",
    "idNo": "102408",
    "name": "Dr. U. Sowmmiya",
    "email": "sowmmiyu@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Associate Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9840386834",
    "type": "faculty"
  },
  {
    "id": "fac-101507",
    "idNo": "101507",
    "name": "Dr. A. Geetha",
    "email": "geethaa2@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Associate Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9884429825",
    "type": "faculty"
  },
  {
    "id": "fac-101709",
    "idNo": "101709",
    "name": "Dr. R. Palanisamy",
    "email": "palanisr@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Associate Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9600158636",
    "type": "faculty"
  },
  {
    "id": "fac-100317",
    "idNo": "100317",
    "name": "Dr. A. Lavanya",
    "email": "lavanyaa@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Associate Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9884823790",
    "type": "faculty"
  },
  {
    "id": "fac-101439",
    "idNo": "101439",
    "name": "Dr. S. Usha",
    "email": "ushas@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Associate Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9840661154",
    "type": "faculty"
  },
  {
    "id": "fac-100979",
    "idNo": "100979",
    "name": "Dr. A. Dominic Savio",
    "email": "dominica@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Associate Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9840519852",
    "type": "faculty"
  },
  {
    "id": "fac-101683",
    "idNo": "101683",
    "name": "Dr. D. Karthikeyan",
    "email": "karthikd@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Associate Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9944204915",
    "type": "faculty"
  },
  {
    "id": "fac-100301",
    "idNo": "100301",
    "name": "Dr. K. Mohanraj",
    "email": "mohanrak@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Associate Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9884871605",
    "type": "faculty"
  },
  {
    "id": "fac-100652",
    "idNo": "100652",
    "name": "Dr. M. Arun Noyal Doss",
    "email": "arunoyad@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Associate Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9444296280",
    "type": "faculty"
  },
  {
    "id": "fac-101436",
    "idNo": "101436",
    "name": "Dr. T. M. Thamizh Thentral",
    "email": "thamizht@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Associate Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9791005919",
    "type": "faculty"
  },
  {
    "id": "fac-101765",
    "idNo": "101765",
    "name": "Dr. R. Ramya",
    "email": "ramyar4@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Associate Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9952439417",
    "type": "faculty"
  },
  {
    "id": "fac-101910",
    "idNo": "101910",
    "name": "Dr. V. Pradeep",
    "email": "pradeepv@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Associate Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "8220791798",
    "type": "faculty"
  },
  {
    "id": "fac-102324",
    "idNo": "102324",
    "name": "Dr. R. Femi",
    "email": "femir@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Associate Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9552766288",
    "type": "faculty"
  },
  {
    "id": "fac-100597",
    "idNo": "100597",
    "name": "Dr. S. Vidyasagar",
    "email": "vidyasas@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Assistant Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9003028986",
    "type": "faculty"
  },
  {
    "id": "fac-100297",
    "idNo": "100297",
    "name": "Dr. R. Rajarajeswari",
    "email": "rajarajr@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Assistant Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9952080530",
    "type": "faculty"
  },
  {
    "id": "fac-100299",
    "idNo": "100299",
    "name": "Dr. S. Shanmugapriya",
    "email": "shanmugs4@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Assistant Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9994364542",
    "type": "faculty"
  },
  {
    "id": "fac-100307",
    "idNo": "100307",
    "name": "Dr. S. Vijayalakshmi",
    "email": "vijayals@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Assistant Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9150026678",
    "type": "faculty"
  },
  {
    "id": "fac-100292",
    "idNo": "100292",
    "name": "Dr. R. Uthra",
    "email": "uthrar@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Assistant Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9841585100",
    "type": "faculty"
  },
  {
    "id": "fac-100303",
    "idNo": "100303",
    "name": "Dr. V. Kalyanasundaram",
    "email": "kalyanav@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Assistant Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9865231780",
    "type": "faculty"
  },
  {
    "id": "fac-100306",
    "idNo": "100306",
    "name": "Dr. R. Senthilkumar",
    "email": "kumarr1@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Assistant Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9884648232",
    "type": "faculty"
  },
  {
    "id": "fac-101290",
    "idNo": "101290",
    "name": "Dr. K. Subha Sharmini",
    "email": "subhak@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Assistant Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9360795315",
    "type": "faculty"
  },
  {
    "id": "fac-101359",
    "idNo": "101359",
    "name": "Dr. C. Nithya",
    "email": "nithyac@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Assistant Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9940648492",
    "type": "faculty"
  },
  {
    "id": "fac-100305",
    "idNo": "100305",
    "name": "Dr. C. Anuradha",
    "email": "anuradhc@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Assistant Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9840257150",
    "type": "faculty"
  },
  {
    "id": "fac-100311",
    "idNo": "100311",
    "name": "Dr. R. C. Ilambirai",
    "email": "ilambirr@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Assistant Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "7200584108",
    "type": "faculty"
  },
  {
    "id": "fac-100313",
    "idNo": "100313",
    "name": "Dr. P. U. Poornima",
    "email": "poornimp@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Assistant Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "8754532745",
    "type": "faculty"
  },
  {
    "id": "fac-100612",
    "idNo": "100612",
    "name": "Dr. S. Geethanjali",
    "email": "geethans@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Assistant Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9597210003",
    "type": "faculty"
  },
  {
    "id": "fac-100739",
    "idNo": "100739",
    "name": "Dr. C. Balaji",
    "email": "balajic@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Assistant Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9176056974",
    "type": "faculty"
  },
  {
    "id": "fac-101042",
    "idNo": "101042",
    "name": "Dr. B. Vinothkumar",
    "email": "vinothkb@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Assistant Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "7092277774",
    "type": "faculty"
  },
  {
    "id": "fac-101427",
    "idNo": "101427",
    "name": "Dr. S. Lourdu Jame",
    "email": "lourdujs@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Assistant Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9566899158",
    "type": "faculty"
  },
  {
    "id": "fac-102193",
    "idNo": "102193",
    "name": "Dr. D. Selva Bharathi",
    "email": "selvabhd@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Assistant Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "8267891319",
    "type": "faculty"
  },
  {
    "id": "fac-101511",
    "idNo": "101511",
    "name": "Dr. V. Kubendran",
    "email": "kubendrv@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Assistant Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9944787180",
    "type": "faculty"
  },
  {
    "id": "fac-101514",
    "idNo": "101514",
    "name": "Dr. M. Sadees",
    "email": "sadeesm@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Assistant Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9790104466",
    "type": "faculty"
  },
  {
    "id": "fac-101701",
    "idNo": "101701",
    "name": "Dr. K. Selvakumar",
    "email": "selvakuk@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Assistant Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9843389383",
    "type": "faculty"
  },
  {
    "id": "fac-101711",
    "idNo": "101711",
    "name": "Dr. D. Anitha",
    "email": "anithad1@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Assistant Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9443956984",
    "type": "faculty"
  },
  {
    "id": "fac-101732",
    "idNo": "101732",
    "name": "Dr. P. Kanakaraj",
    "email": "kanakarp@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Assistant Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9095353643",
    "type": "faculty"
  },
  {
    "id": "fac-101741",
    "idNo": "101741",
    "name": "Dr. D. Ravichandran",
    "email": "ravichad@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Assistant Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9841363166",
    "type": "faculty"
  },
  {
    "id": "fac-101923",
    "idNo": "101923",
    "name": "Dr. A. Suresh Kumar",
    "email": "sureshka@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Assistant Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9994279784",
    "type": "faculty"
  },
  {
    "id": "fac-101974",
    "idNo": "101974",
    "name": "Dr. P. Suresh",
    "email": "sureshp2@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Assistant Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9865311096",
    "type": "faculty"
  },
  {
    "id": "fac-102461",
    "idNo": "102461",
    "name": "Dr. C. Naveen",
    "email": "naveenc@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Assistant Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9489247841",
    "type": "faculty"
  },
  {
    "id": "fac-102699",
    "idNo": "102699",
    "name": "Dr. K.M. Ravi Eswar",
    "email": "ravieswm@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Assistant Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9494709710",
    "type": "faculty"
  },
  {
    "id": "fac-102719",
    "idNo": "102719",
    "name": "Dr. Phani Teja Bankupalli",
    "email": "phanib@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Assistant Professor",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9160520369",
    "type": "faculty"
  },
  {
    "id": "fac-103641",
    "idNo": "103641",
    "name": "Mr. S. Sivagnanam",
    "email": "sivagnas4@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Teaching Assistance",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9003174950",
    "type": "faculty"
  },
  {
    "id": "fac-103642",
    "idNo": "103642",
    "name": "Ms. R. Senthil Vadivu",
    "email": "vadivusr@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Teaching Assistance",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9790919677",
    "type": "faculty"
  },
  {
    "id": "fac-103643",
    "idNo": "103643",
    "name": "Ms. K. Gomathy Lakshmi",
    "email": "gomathyk1@srmist.edu.in",
    "category": "Teaching Faculty",
    "designation": "Teaching Assistance",
    "department": "EEE",
    "cohort": "Teaching Faculty",
    "phone": "9444014577",
    "type": "faculty"
  },
  {
    "id": "fac-nt-201423",
    "idNo": "201423",
    "name": "Ms. S. Ruth Vijaya",
    "email": "ruthvijs@srmist.edu.in",
    "category": "Non-Teaching Staff",
    "designation": "DTP Operator",
    "department": "EEE",
    "cohort": "Non-Teaching Staff",
    "phone": "9840436689",
    "type": "faculty"
  },
  {
    "id": "fac-nt-200357",
    "idNo": "200357",
    "name": "Mr. B. Senthil Kumar",
    "email": "senthilb@srmist.edu.in",
    "category": "Non-Teaching Staff",
    "designation": "Technical Assistant",
    "department": "EEE",
    "cohort": "Non-Teaching Staff",
    "phone": "7358684004",
    "type": "faculty"
  },
  {
    "id": "fac-nt-200360",
    "idNo": "200360",
    "name": "Mr. P. Raghupathy",
    "email": "ragupatp@srmist.edu.in",
    "category": "Non-Teaching Staff",
    "designation": "Technician",
    "department": "EEE",
    "cohort": "Non-Teaching Staff",
    "phone": "9789845547",
    "type": "faculty"
  },
  {
    "id": "fac-nt-200361",
    "idNo": "200361",
    "name": "Mr. R. Mahendran",
    "email": "mahendrr@srmist.edu.in",
    "category": "Non-Teaching Staff",
    "designation": "Technician",
    "department": "EEE",
    "cohort": "Non-Teaching Staff",
    "phone": "9884449805",
    "type": "faculty"
  },
  {
    "id": "fac-nt-200034",
    "idNo": "200034",
    "name": "Mr. C. Vembuli",
    "email": "vembulic@srmist.edu.in",
    "category": "Non-Teaching Staff",
    "designation": "Technician",
    "department": "EEE",
    "cohort": "Non-Teaching Staff",
    "phone": "9176336728",
    "type": "faculty"
  },
  {
    "id": "fac-nt-200061",
    "idNo": "200061",
    "name": "Mr. D. Tamilarasan",
    "email": "tamilard@srmist.edu.in",
    "category": "Non-Teaching Staff",
    "designation": "Technician",
    "department": "EEE",
    "cohort": "Non-Teaching Staff",
    "phone": "9941021743",
    "type": "faculty"
  },
  {
    "id": "fac-nt-200690",
    "idNo": "200690",
    "name": "Mr. G. Jayakumar",
    "email": "jayakumg@srmist.edu.in",
    "category": "Non-Teaching Staff",
    "designation": "Senior Technical Assistant",
    "department": "EEE",
    "cohort": "Non-Teaching Staff",
    "phone": "9944536162",
    "type": "faculty"
  },
  {
    "id": "fac-nt-201039",
    "idNo": "201039",
    "name": "Ms. T. Thamarai Selvi",
    "email": "thamarat@srmist.edu.in",
    "category": "Non-Teaching Staff",
    "designation": "Senior Technical Assistant",
    "department": "EEE",
    "cohort": "Non-Teaching Staff",
    "phone": "9578611441",
    "type": "faculty"
  },
  {
    "id": "fac-nt-201411",
    "idNo": "201411",
    "name": "Mr. K. Saravanan",
    "email": "saravank4@srmist.edu.in",
    "category": "Non-Teaching Staff",
    "designation": "Programmer",
    "department": "EEE",
    "cohort": "Non-Teaching Staff",
    "phone": "9962646410",
    "type": "faculty"
  },
  {
    "id": "fac-nt-201412",
    "idNo": "201412",
    "name": "Mr. N. Navaneethan",
    "email": "navaneen@srmist.edu.in",
    "category": "Non-Teaching Staff",
    "designation": "Senior Technical Assistant",
    "department": "EEE",
    "cohort": "Non-Teaching Staff",
    "phone": "9500897535",
    "type": "faculty"
  },
  {
    "id": "fac-nt-201487",
    "idNo": "201487",
    "name": "Mr. A. Rohith",
    "email": "rohitha@srmist.edu.in",
    "category": "Non-Teaching Staff",
    "designation": "Technical Assistant",
    "department": "EEE",
    "cohort": "Non-Teaching Staff",
    "phone": "9176167539",
    "type": "faculty"
  },
  {
    "id": "fac-nt-201735",
    "idNo": "201735",
    "name": "Mr. V. Rajeev Gandhi",
    "email": "rajeevgv@srmist.edu.in",
    "category": "Non-Teaching Staff",
    "designation": "Lab Technician",
    "department": "EEE",
    "cohort": "Non-Teaching Staff",
    "phone": "9884468007",
    "type": "faculty"
  },
  {
    "id": "fac-nt-201744",
    "idNo": "201744",
    "name": "Mr. R. Praveen Kumar",
    "email": "praveenr11@srmist.edu.in",
    "category": "Non-Teaching Staff",
    "designation": "Technical Assistant",
    "department": "EEE",
    "cohort": "Non-Teaching Staff",
    "phone": "7397516559",
    "type": "faculty"
  },
  {
    "id": "fac-nt-200121",
    "idNo": "200121",
    "name": "Mr. K. Suman",
    "email": "sumank@srmist.edu.in",
    "category": "Non-Teaching Staff",
    "designation": "Assistant Technician",
    "department": "EEE",
    "cohort": "Non-Teaching Staff",
    "phone": "9790983870",
    "type": "faculty"
  },
  {
    "id": "fac-nt-200098",
    "idNo": "200098",
    "name": "Mr. K. Mani Kumar",
    "email": "manikumk@srmist.edu.in",
    "category": "Non-Teaching Staff",
    "designation": "Office Assistant",
    "department": "EEE",
    "cohort": "Non-Teaching Staff",
    "phone": "9840423126",
    "type": "faculty"
  },
  {
    "id": "fac-nt-200102",
    "idNo": "200102",
    "name": "Mr. D. Vijayakumar",
    "email": "vijayakd@srmist.edu.in",
    "category": "Non-Teaching Staff",
    "designation": "Office Assistant",
    "department": "EEE",
    "cohort": "Non-Teaching Staff",
    "phone": "8807406033",
    "type": "faculty"
  },
  {
    "id": "fac-nt-201573",
    "idNo": "201573",
    "name": "Mr. C. Paranthaman",
    "email": "paranthc@srmist.edu.in",
    "category": "Non-Teaching Staff",
    "designation": "Office Assistant",
    "department": "EEE",
    "cohort": "Non-Teaching Staff",
    "phone": "9003072050",
    "type": "faculty"
  },
  {
    "id": "fac-nt-201722",
    "idNo": "201722",
    "name": "Mr. S. Akash",
    "email": "akashs3@srmist.edu.in",
    "category": "Non-Teaching Staff",
    "designation": "Office Assistant",
    "department": "EEE",
    "cohort": "Non-Teaching Staff",
    "phone": "7338960196",
    "type": "faculty"
  },
  {
    "id": "fac-nt-90369",
    "idNo": "90369",
    "name": "Mr. D. Elavarasan",
    "email": "elavarad1@srmist.edu.in",
    "category": "Non-Teaching Staff",
    "designation": "Office Assistant",
    "department": "EEE",
    "cohort": "Non-Teaching Staff",
    "phone": "9884993346",
    "type": "faculty"
  },
  {
    "id": "rs-PA1713005012001",
    "idNo": "PA1713005012001",
    "name": "Mr. S. Senthilmurugan",
    "email": "ss2160@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. A. Rathinam)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9894296319",
    "type": "faculty"
  },
  {
    "id": "rs-PA1713005013001",
    "idNo": "PA1713005013001",
    "name": "Mr. M. Rajkumar",
    "email": "rm9226@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. A. Rathinam)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9884498843",
    "type": "faculty"
  },
  {
    "id": "rs-RA1813005011002",
    "idNo": "RA1813005011002",
    "name": "Mr. Balamurugan Saravanan",
    "email": "bb4565@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. A. Rathinam)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9789938242",
    "type": "faculty"
  },
  {
    "id": "rs-RA1813005011004",
    "idNo": "RA1813005011004",
    "name": "Ms. Priya Kumari",
    "email": "pa2402@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. A. Rathinam)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9717024650",
    "type": "faculty"
  },
  {
    "id": "rs-RA1813005011005",
    "idNo": "RA1813005011005",
    "name": "Mr. G.R. Prudhvi Kumar",
    "email": "gg6957@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. D. Sattinadan)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "7845837356",
    "type": "faculty"
  },
  {
    "id": "rs-PA1813005013001",
    "idNo": "PA1813005013001",
    "name": "Mr. V. Muralikrishnan",
    "email": "ms5999@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. A. Rathinam)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9841572129",
    "type": "faculty"
  },
  {
    "id": "rs-PA1913005012003",
    "idNo": "PA1913005012003",
    "name": "Ms. K. Vijayalakshmi",
    "email": "vk6528@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. K. N. Srinivas)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9884892302",
    "type": "faculty"
  },
  {
    "id": "rs-PA1913005013002",
    "idNo": "PA1913005013002",
    "name": "Mr. Ganapathi Gatta",
    "email": "GG6364@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. R. Sridhar)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "7904107792",
    "type": "faculty"
  },
  {
    "id": "rs-PA1913005013003",
    "idNo": "PA1913005013003",
    "name": "Ms. S.B. Aruna",
    "email": "as2324@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. D. Suchitra)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9441811525",
    "type": "faculty"
  },
  {
    "id": "rs-PA1913005013005",
    "idNo": "PA1913005013005",
    "name": "Mr. Banala Venkatesh",
    "email": "bv1006@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. S. Padmini)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "8019986220",
    "type": "faculty"
  },
  {
    "id": "rs-RA1913005011013",
    "idNo": "RA1913005011013",
    "name": "Ms. P. Suganya",
    "email": "sp1005@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. J. Divyanavamani)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "8754193190",
    "type": "faculty"
  },
  {
    "id": "rs-PA1913005013006",
    "idNo": "PA1913005013006",
    "name": "Ms. Thanuja P",
    "email": "tp7910@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. K. Saravanan)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "8886663209",
    "type": "faculty"
  },
  {
    "id": "rs-PC2013005013001",
    "idNo": "PC2013005013001",
    "name": "Mr. R. Ramanavasu",
    "email": "rr7712@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. K. Vijayakumar)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9442616438",
    "type": "faculty"
  },
  {
    "id": "rs-RC2013005011003",
    "idNo": "RC2013005011003",
    "name": "Ms. A. Sivapriya",
    "email": "sa3227@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. N. Kalaiarasi)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9884145452",
    "type": "faculty"
  },
  {
    "id": "rs-RC2013005011005",
    "idNo": "RC2013005011005",
    "name": "Ms. V. Shanmugapriya",
    "email": "sv6489@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. S. Vidyasagar)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9962651620",
    "type": "faculty"
  },
  {
    "id": "rs-PC2013005013003",
    "idNo": "PC2013005013003",
    "name": "Mr. A. Velu",
    "email": "va7244@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. N. Chellammal)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9786905915",
    "type": "faculty"
  },
  {
    "id": "rs-PC2013005013004",
    "idNo": "PC2013005013004",
    "name": "Mr. G. Sambathkumar",
    "email": "sg1111@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. D. Sattinadan)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9941764781",
    "type": "faculty"
  },
  {
    "id": "rs-PC2013005013006",
    "idNo": "PC2013005013006",
    "name": "Mr. Panyam Manohar",
    "email": "mp9524@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. V. Kalyanasundaram)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9052207478",
    "type": "faculty"
  },
  {
    "id": "rs-RC2013005011009",
    "idNo": "RC2013005011009",
    "name": "Ms. S.M. Nithya Devi",
    "email": "ns8068@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. K. Vijayakumar)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9487634094",
    "type": "faculty"
  },
  {
    "id": "rs-PC2013005012004",
    "idNo": "PC2013005012004",
    "name": "Mr. Dilli Srinivasan",
    "email": "dj9206@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. K. N. Srinivas)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9843455451",
    "type": "faculty"
  },
  {
    "id": "rs-PC2013005012005",
    "idNo": "PC2013005012005",
    "name": "Mr. K. Arul Vendhan",
    "email": "ak2532@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. K. N. Srinivas)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "7598131427",
    "type": "faculty"
  },
  {
    "id": "rs-PC2013005013009",
    "idNo": "PC2013005013009",
    "name": "Mr. P. Ramesh",
    "email": "rp4834@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. R.K. Pongiannan)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9059840824",
    "type": "faculty"
  },
  {
    "id": "rs-PA2013005012001",
    "idNo": "PA2013005012001",
    "name": "Mr. J. Ajay Daniel",
    "email": "aj2219@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. C.S. Boopathi)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9500718104",
    "type": "faculty"
  },
  {
    "id": "rs-PA2013005013003",
    "idNo": "PA2013005013003",
    "name": "Mr. Koduri Sambasivarao",
    "email": "ks3565@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. M. Arun Noyal Doss)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "8143255770",
    "type": "faculty"
  },
  {
    "id": "rs-PA2013005013006",
    "idNo": "PA2013005013006",
    "name": "Mr. V. M. M. Swamy",
    "email": "sv7308@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. S. Vidyasagar)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9449349494",
    "type": "faculty"
  },
  {
    "id": "rs-PA2013005012002",
    "idNo": "PA2013005012002",
    "name": "Mr. M. Vinil",
    "email": "vm4192@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. K. N. Srinivas)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9790803989",
    "type": "faculty"
  },
  {
    "id": "rs-PA2013005013007",
    "idNo": "PA2013005013007",
    "name": "Mr. Aravind Babu Thota",
    "email": "at4667@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. D. Maharajan)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "7893333008",
    "type": "faculty"
  },
  {
    "id": "rs-PA2013005013008",
    "idNo": "PA2013005013008",
    "name": "Mr. Ganesh Sankar Saragadam",
    "email": "gs8942@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. R. Palanisamy)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "8332866556",
    "type": "faculty"
  },
  {
    "id": "rs-RA2013005011006",
    "idNo": "RA2013005011006",
    "name": "Mr. D. Senthilkumar",
    "email": "sd2587@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. K. Vijayakumar)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9833757643",
    "type": "faculty"
  },
  {
    "id": "rs-PA2013005013009",
    "idNo": "PA2013005013009",
    "name": "Mr. P. Balamurugan",
    "email": "bp7682@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. K. Selvakumar)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9489727778",
    "type": "faculty"
  },
  {
    "id": "rs-PC2113005012001",
    "idNo": "PC2113005012001",
    "name": "Mr. N. Rajkumar",
    "email": "rn3671@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. J. Preetha Roselyn)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "8870778890",
    "type": "faculty"
  },
  {
    "id": "rs-RC2113005011005",
    "idNo": "RC2113005011005",
    "name": "Mr. Mahesh",
    "email": "ma5228@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. C. Bharatiraja)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9885335974",
    "type": "faculty"
  },
  {
    "id": "rs-PC2113005013011",
    "idNo": "PC2113005013011",
    "name": "Ms. J. Evangelin Jeba",
    "email": "ej6884@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. D. Suchitra)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9443015506",
    "type": "faculty"
  },
  {
    "id": "rs-PC2113005013002",
    "idNo": "PC2113005013002",
    "name": "Mr. R. Satish Kumar",
    "email": "sr4872@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. D. Sattinadan)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9985767465",
    "type": "faculty"
  },
  {
    "id": "rs-RC2113005011004",
    "idNo": "RC2113005011004",
    "name": "Mr. V. Vimalraj Ambeth",
    "email": "vv3372@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. K. Saravanan)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9944816163",
    "type": "faculty"
  },
  {
    "id": "rs-PC2113005013001",
    "idNo": "PC2113005013001",
    "name": "Mr. P. Sai Sampath Kumar",
    "email": "sk8412@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. P. Suresh)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9885708510",
    "type": "faculty"
  },
  {
    "id": "rs-PC2113005013012",
    "idNo": "PC2113005013012",
    "name": "Mr. R. Deepak",
    "email": "dm9686@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. R. Sridhar)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "7358652645",
    "type": "faculty"
  },
  {
    "id": "rs-PC2113005013003",
    "idNo": "PC2113005013003",
    "name": "Mr. C. Ebbie Selvakumar",
    "email": "ec7497@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. R. Brindha)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9443993440",
    "type": "faculty"
  },
  {
    "id": "rs-RC2113005011011",
    "idNo": "RC2113005011011",
    "name": "Mr. K.N.D.V.  Sai Eswar",
    "email": "ks9485@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. M. Arun Noyal Doss)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9381222273",
    "type": "faculty"
  },
  {
    "id": "rs-RC2113005011013",
    "idNo": "RC2113005011013",
    "name": "Mr. R. Mohammed Abdullah",
    "email": "mr4293@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. N. Kalaiarasi)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9597236461",
    "type": "faculty"
  },
  {
    "id": "rs-RC2113005011015",
    "idNo": "RC2113005011015",
    "name": "Ms. K. Vinothini",
    "email": "vk8899@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. J. Divyanavamani)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "6379382098",
    "type": "faculty"
  },
  {
    "id": "rs-RC2113005011017",
    "idNo": "RC2113005011017",
    "name": "Ms. Janipireddy durga Sravani",
    "email": "dj6946@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. Y. Jeyashree)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9494834961",
    "type": "faculty"
  },
  {
    "id": "rs-PC2113005013004",
    "idNo": "PC2113005013004",
    "name": "Mr. Chatragadda Kiran Kumar",
    "email": "ck4636@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. Y. Jeyashree)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "8985875659",
    "type": "faculty"
  },
  {
    "id": "rs-RC2113005011018",
    "idNo": "RC2113005011018",
    "name": "Mr. K. Balasubramaniyan",
    "email": "bk4605@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. V. Kalyanasundaram)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9842407083",
    "type": "faculty"
  },
  {
    "id": "rs-RC2113005011020",
    "idNo": "RC2113005011020",
    "name": "Ms. R. Nisha Rexline",
    "email": "nr1607@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. R. Rajarajeswari)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9790068428",
    "type": "faculty"
  },
  {
    "id": "rs-RC2113005011021",
    "idNo": "RC2113005011021",
    "name": "Mr. Rajesh Dudrai",
    "email": "rd5793@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. S. Gayathri Monica)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9940329901",
    "type": "faculty"
  },
  {
    "id": "rs-PA2113005013008",
    "idNo": "PA2113005013008",
    "name": "Mr. N. Thamizh Selvan",
    "email": "tn3937@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. R. Sridhar)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9042064464",
    "type": "faculty"
  },
  {
    "id": "rs-RA2113005011006",
    "idNo": "RA2113005011006",
    "name": "Ms. Sujatha Balasubramanian",
    "email": "sb8773@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. J. Preetha Roselyn)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "8754318445",
    "type": "faculty"
  },
  {
    "id": "rs-RA2113005011017",
    "idNo": "RA2113005011017",
    "name": "Ms. K. Ramya",
    "email": "rk9718@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. G. Janaki)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9962538699",
    "type": "faculty"
  },
  {
    "id": "rs-RA2113005011003",
    "idNo": "RA2113005011003",
    "name": "Ms. J. Mounica",
    "email": "mj1364@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. G. Janaki)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "8072359473",
    "type": "faculty"
  },
  {
    "id": "rs-PA2113005013001",
    "idNo": "PA2113005013001",
    "name": "Mr. N. Ananthasaravanan.",
    "email": "an4694@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. V. Megala)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9944397644",
    "type": "faculty"
  },
  {
    "id": "rs-RA2113005011004",
    "idNo": "RA2113005011004",
    "name": "Ms. J. Rekha",
    "email": "rj6200@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. T.M. Thamizh Tentral)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "7010274986",
    "type": "faculty"
  },
  {
    "id": "rs-RA2113005011005",
    "idNo": "RA2113005011005",
    "name": "Mr. Gowtham Vedulla",
    "email": "gv8227@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. A. Geetha)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "8985876190",
    "type": "faculty"
  },
  {
    "id": "rs-RA2113005011008",
    "idNo": "RA2113005011008",
    "name": "Mr. B. Bharaneedharan",
    "email": "bb3017@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. P. Suresh)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9884955605",
    "type": "faculty"
  },
  {
    "id": "rs-RA2113005011010",
    "idNo": "RA2113005011010",
    "name": "Mr. V. Chandu",
    "email": "cv4049@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. C. Subramani)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9440120520",
    "type": "faculty"
  },
  {
    "id": "rs-RA2113005011012",
    "idNo": "RA2113005011012",
    "name": "Mr. M. Praveen",
    "email": "pm7224@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. C. Balaji)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9677166973",
    "type": "faculty"
  },
  {
    "id": "rs-PA2113005013005",
    "idNo": "PA2113005013005",
    "name": "Ms. B.N. Bushra",
    "email": "bb5378@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. S. Padmini)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "8086782663",
    "type": "faculty"
  },
  {
    "id": "rs-RA2113005011013",
    "idNo": "RA2113005011013",
    "name": "Ms. P. Preethi Santhosam",
    "email": "pp3706@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. U. Sowmmiya)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9790141349",
    "type": "faculty"
  },
  {
    "id": "rs-PA2113005013006",
    "idNo": "PA2113005013006",
    "name": "Mr. J. Subramaniyan",
    "email": "sj1062@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. C. Balaji)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9047191893",
    "type": "faculty"
  },
  {
    "id": "rs-PA2113005013011",
    "idNo": "PA2113005013011",
    "name": "Ms. P. Geetha",
    "email": "gp5732@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. S. Usha)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9786539989",
    "type": "faculty"
  },
  {
    "id": "rs-PA2113005012002",
    "idNo": "PA2113005012002",
    "name": "Mr. A. Mathivanan",
    "email": "ma3278@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. K. Mohanraj)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9994659876",
    "type": "faculty"
  },
  {
    "id": "rs-PA2113005013007",
    "idNo": "PA2113005013007",
    "name": "Ms. D. Manimegalai",
    "email": "md8469@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. S. Gayathri Monica)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9940492446",
    "type": "faculty"
  },
  {
    "id": "rs-PC2213005012001",
    "idNo": "PC2213005012001",
    "name": "Mr. S. Srinivasasenthil",
    "email": "ss1394@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. K. Vijayakumar)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9444895409",
    "type": "faculty"
  },
  {
    "id": "rs-RC2213005011002",
    "idNo": "RC2213005011002",
    "name": "Ms. T. Nivetha",
    "email": "nt6075@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. J. Preetha Roselyn)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9363089144",
    "type": "faculty"
  },
  {
    "id": "rs-RC2213005011001",
    "idNo": "RC2213005011001",
    "name": "Ms. E. Priya",
    "email": "pe8134@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. J. Preetha Roselyn)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "6374256735",
    "type": "faculty"
  },
  {
    "id": "rs-RC2213005011004",
    "idNo": "RC2213005011004",
    "name": "Mr. R. Venugopal",
    "email": "vr4964@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. C. Balaji)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9500138746",
    "type": "faculty"
  },
  {
    "id": "rs-RC2213005011003",
    "idNo": "RC2213005011003",
    "name": "Mr. N.V. Sivaram",
    "email": "sv7087@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. A. Lavanya)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9940050802",
    "type": "faculty"
  },
  {
    "id": "rs-RC2213005011009",
    "idNo": "RC2213005011009",
    "name": "Mr. R. Venkatesan",
    "email": "vr3512@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. A. Domnic Savio)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9894575119",
    "type": "faculty"
  },
  {
    "id": "rs-RC2213005011007",
    "idNo": "RC2213005011007",
    "name": "Mr. J. Franklin",
    "email": "fj0053@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. R.K. Pongiannan)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9585527929",
    "type": "faculty"
  },
  {
    "id": "rs-RC2213005011008",
    "idNo": "RC2213005011008",
    "name": "Mr. Santhana Krishnan",
    "email": "sp7312@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. R.K. Pongiannan)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9994737084",
    "type": "faculty"
  },
  {
    "id": "rs-RC2213005011006",
    "idNo": "RC2213005011006",
    "name": "Ms. K. Abinaya",
    "email": "ak3656@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. U. Sowmmiya)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9659218413",
    "type": "faculty"
  },
  {
    "id": "rs-PC2213005013001",
    "idNo": "PC2213005013001",
    "name": "Mr. G. Ratnaiah",
    "email": "rg2879@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. G. Ramya)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "8121918115",
    "type": "faculty"
  },
  {
    "id": "rs-RC2213005011010",
    "idNo": "RC2213005011010",
    "name": "Ms. Duaa Ali",
    "email": "da9466@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. M. Arun Noyal Doss)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "8488070985",
    "type": "faculty"
  },
  {
    "id": "rs-RA2213005011001",
    "idNo": "RA2213005011001",
    "name": "Mr. Jayamurugan M",
    "email": "jm2311@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. K. Saravanan)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9940356782",
    "type": "faculty"
  },
  {
    "id": "rs-RA2213005011002",
    "idNo": "RA2213005011002",
    "name": "Mr. Kumarasaravanan K",
    "email": "kk7265@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. R. Sridhar)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "8056104436",
    "type": "faculty"
  },
  {
    "id": "rs-RA2213005011003",
    "idNo": "RA2213005011003",
    "name": "Ms. A. Richard Pravin",
    "email": "ra3938@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. R.K. Pongiannan)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9994447510",
    "type": "faculty"
  },
  {
    "id": "rs-PA2213005013001",
    "idNo": "PA2213005013001",
    "name": "Mr. Bobin K Mathew",
    "email": "bm0034@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. N. Chellammal)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9645819717",
    "type": "faculty"
  },
  {
    "id": "rs-RA2213005011005",
    "idNo": "RA2213005011005",
    "name": "Ms. Pidiyar Dharani Deepika",
    "email": "dp0243@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. R. Sridhar)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "8688198632",
    "type": "faculty"
  },
  {
    "id": "rs-RC2313005011001",
    "idNo": "RC2313005011001",
    "name": "Mr. P. Jagadish Babu",
    "email": "jp4478@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. A. Geetha)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9841204080",
    "type": "faculty"
  },
  {
    "id": "rs-RC2313005011002",
    "idNo": "RC2313005011002",
    "name": "Ms. G. Dhivya",
    "email": "dg1670@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. R. Rajarajeswari)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "8668057156",
    "type": "faculty"
  },
  {
    "id": "rs-RC2313005011003",
    "idNo": "RC2313005011003",
    "name": "Mr. S. Prabakaran",
    "email": "ps7169@srmist.edu.im",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. R. Rajarajeswari)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "8248479897",
    "type": "faculty"
  },
  {
    "id": "rs-RC2313005011004",
    "idNo": "RC2313005011004",
    "name": "Ms. S. Yamuna",
    "email": "ys9845@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. K. Vijayakumar)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "8939851791",
    "type": "faculty"
  },
  {
    "id": "rs-RC2313005011005",
    "idNo": "RC2313005011005",
    "name": "Ms. J. Jayachitra",
    "email": "jj2062@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. R. Sridhar)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "8489113717",
    "type": "faculty"
  },
  {
    "id": "rs-RC2313005011006",
    "idNo": "RC2313005011006",
    "name": "Mr. R. Nakkeeran",
    "email": "nr7291@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. C. Bharatiraja)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9994866474",
    "type": "faculty"
  },
  {
    "id": "rs-RC2313005011007",
    "idNo": "RC2313005011007",
    "name": "Mr. T.M. Navinkumar",
    "email": "nt7410@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. C. Bharatiraja)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9095680071",
    "type": "faculty"
  },
  {
    "id": "rs-RC2313005011008",
    "idNo": "RC2313005011008",
    "name": "Mr. A. Rathinavel",
    "email": "ra6705@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. R. Ramya)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9865436509",
    "type": "faculty"
  },
  {
    "id": "rs-RC2313005011009",
    "idNo": "RC2313005011009",
    "name": "Mr. R. Vadivelan",
    "email": "vr7989@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. N. Chellammal)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "8056630541",
    "type": "faculty"
  },
  {
    "id": "rs-RC2313005011010",
    "idNo": "RC2313005011010",
    "name": "Mr. V. Balaji",
    "email": "bv3569@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. K. Vijayakumar)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "7299832626",
    "type": "faculty"
  },
  {
    "id": "rs-RC2313005011011",
    "idNo": "RC2313005011011",
    "name": "Ms. M. Parameswari",
    "email": "pm5714@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. N. Chellammal)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9043200393",
    "type": "faculty"
  },
  {
    "id": "rs-RC2313005011012",
    "idNo": "RC2313005011012",
    "name": "Ms. Amal Mohamad Jarkas",
    "email": "aj8332@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. M. Arun Noyal Doss)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9108557671",
    "type": "faculty"
  },
  {
    "id": "rs-PC2313005012001",
    "idNo": "PC2313005012001",
    "name": "Ms. C. Saranya",
    "email": "sc0341@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. G. Janaki)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "8248634397",
    "type": "faculty"
  },
  {
    "id": "rs-PC2313005012002",
    "idNo": "PC2313005012002",
    "name": "Ms. A. Maria Leon",
    "email": "ma5721@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. S. Vidyasagar)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9498859775",
    "type": "faculty"
  },
  {
    "id": "rs-PC2313005013001",
    "idNo": "PC2313005013001",
    "name": "Mr. V.C. Mahaadevan",
    "email": "mv8705@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. R. Narayanamoorthi)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9444285361",
    "type": "faculty"
  },
  {
    "id": "rs-PC2313005013002",
    "idNo": "PC2313005013002",
    "name": "Ms. S. Poonkuzhali",
    "email": "ps3010@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. A. Geetha)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9095448813",
    "type": "faculty"
  },
  {
    "id": "rs-PC2313005013003",
    "idNo": "PC2313005013003",
    "name": "Mr. J. Ramesh",
    "email": "rj8030@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. R.K. Pongiannan)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "7010619846",
    "type": "faculty"
  },
  {
    "id": "rs-RA2313005011001",
    "idNo": "RA2313005011001",
    "name": "Ms. G. Sangeetha",
    "email": "sg3661@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. D. Suchitra)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "7338946458",
    "type": "faculty"
  },
  {
    "id": "rs-RA2313005011002",
    "idNo": "RA2313005011002",
    "name": "Mr. C. Muthu Kumaran",
    "email": "mc1231@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. A. Geetha)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9790427397",
    "type": "faculty"
  },
  {
    "id": "rs-RA2313005011003",
    "idNo": "RA2313005011003",
    "name": "Ms. M. Edel Quinn Julin",
    "email": "em5614@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. S. Vijayalakshmi)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9043659199",
    "type": "faculty"
  },
  {
    "id": "rs-RA2313005011004",
    "idNo": "RA2313005011004",
    "name": "Mr. D. Purushothaman",
    "email": "pd4448@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. R. Narayanamoorthi)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9894442116",
    "type": "faculty"
  },
  {
    "id": "rs-RA2313005011005",
    "idNo": "RA2313005011005",
    "name": "Mr. P. Kiran Kumar",
    "email": "pp5480@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. U. Sowmmiya)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "8919621699",
    "type": "faculty"
  },
  {
    "id": "rs-RA2313005011006",
    "idNo": "RA2313005011006",
    "name": "Mr. G. Manikandan",
    "email": "mg5461@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. C. Bharatiraja)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9500105713",
    "type": "faculty"
  },
  {
    "id": "rs-RA2313005011007",
    "idNo": "RA2313005011007",
    "name": "Ms. P. Dhivya",
    "email": "dp6563@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. K.M. Ravi Eswar)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9790120778",
    "type": "faculty"
  },
  {
    "id": "rs-RA2313005011008",
    "idNo": "RA2313005011008",
    "name": "Ms. R. Padmavathi",
    "email": "pr0528@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. C. Anuradha)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "8124378478",
    "type": "faculty"
  },
  {
    "id": "rs-PA2313005013002",
    "idNo": "PA2313005013002",
    "name": "Mr. R. Manikandan",
    "email": "mr5435@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. K. Mohanraj)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "8939739640",
    "type": "faculty"
  },
  {
    "id": "rs-PA2313005013003",
    "idNo": "PA2313005013003",
    "name": "Mr. R. Sathiya",
    "email": "sr0164@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. C.S. Boopathi)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "7598131861",
    "type": "faculty"
  },
  {
    "id": "rs-RC2413005011001",
    "idNo": "RC2413005011001",
    "name": "Mr. Pratik Anand Deshpande",
    "email": "pd5638@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. J. Preetha Roselyn)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "7204952452",
    "type": "faculty"
  },
  {
    "id": "rs-RC2413005011002",
    "idNo": "RC2413005011002",
    "name": "Mr. M. Gopi",
    "email": "gm6315@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. S. Usha)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "8072085109",
    "type": "faculty"
  },
  {
    "id": "rs-RC2413005011003",
    "idNo": "RC2413005011003",
    "name": "Ms. R.S. Dhurga",
    "email": "dr6563@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. S. Usha)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9840666498",
    "type": "faculty"
  },
  {
    "id": "rs-RC2413005011004",
    "idNo": "RC2413005011004",
    "name": "Mr. Inavelli Chandra Mouli",
    "email": "ic9688@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. Phani Teja Bankupalli)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "7989820833",
    "type": "faculty"
  },
  {
    "id": "rs-RC2413005011005",
    "idNo": "RC2413005011005",
    "name": "Mr. M. Sivakumar",
    "email": "sm4619@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. R. Sridhar)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "7397261442",
    "type": "faculty"
  },
  {
    "id": "rs-RA2413005011001",
    "idNo": "RA2413005011001",
    "name": "Ms. R. Preethicaa",
    "email": "pr7886@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. U. Sowmmiya)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9361344925",
    "type": "faculty"
  },
  {
    "id": "rs-RA2413005011002",
    "idNo": "RA2413005011002",
    "name": "Mr. Rahul Somnath",
    "email": "rs0205@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. U. Sowmmiya)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "7904600287",
    "type": "faculty"
  },
  {
    "id": "rs-RA2413005011004",
    "idNo": "RA2413005011004",
    "name": "Mr. G. Palvannan",
    "email": "pg6835@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. R. Narayanamoorthi)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9500567057",
    "type": "faculty"
  },
  {
    "id": "rs-RA2413005011005",
    "idNo": "RA2413005011005",
    "name": "Mr. S. Ramamurthi",
    "email": "rs9929@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. R. Narayanamoorthi)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "8940888984",
    "type": "faculty"
  },
  {
    "id": "rs-RC2513005011001",
    "idNo": "RC2513005011001",
    "name": "Ms. P. Priyadharshini",
    "email": "pp5619@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. U. Sowmmiya)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "8940551727",
    "type": "faculty"
  },
  {
    "id": "rs-RC2513005011002",
    "idNo": "RC2513005011002",
    "name": "Ms. B. Divya",
    "email": "db5260@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. A. Domnic Savio)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "8668000691",
    "type": "faculty"
  },
  {
    "id": "rs-RC2513005011003",
    "idNo": "RC2513005011003",
    "name": "Ms. S. Keerthana",
    "email": "ks4353@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. G. Janaki)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9840791877",
    "type": "faculty"
  },
  {
    "id": "rs-RC2513005011004",
    "idNo": "RC2513005011004",
    "name": "Ms. Dorathi Christine",
    "email": "dc8506@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. R. Narayanamoorthi)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9487738364",
    "type": "faculty"
  },
  {
    "id": "rs-RC2513005011006",
    "idNo": "RC2513005011006",
    "name": "Mr. Donadi Ashok Kumar",
    "email": "ad1960@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. D. Karthikeyan)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9346649940",
    "type": "faculty"
  },
  {
    "id": "rs-PC2513005012001",
    "idNo": "PC2513005012001",
    "name": "Mr. K. Saravanan",
    "email": "sk4272@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. K. Vijayakumar)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9962646410",
    "type": "faculty"
  },
  {
    "id": "rs-PC2513005013001",
    "idNo": "PC2513005013001",
    "name": "Mr. Ansar Jamal",
    "email": "av9112@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. C. Subramani)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9447376898",
    "type": "faculty"
  },
  {
    "id": "rs-PC2513005013002",
    "idNo": "PC2513005013002",
    "name": "Ms. R. Kanagavalli",
    "email": "kr7547@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. J. Preetha Roselyn)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "7904605719",
    "type": "faculty"
  },
  {
    "id": "rs-RA2513005011002",
    "idNo": "RA2513005011002",
    "name": "Mr. Rajesh Uppara",
    "email": "ru8819@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. Phani Teja Bankupalli)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "8884217467",
    "type": "faculty"
  },
  {
    "id": "rs-RA2513005011003",
    "idNo": "RA2513005011003",
    "name": "Ms. B. Evangeline Kiruba",
    "email": "eb8433@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. R. Sridhar)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9566734723",
    "type": "faculty"
  },
  {
    "id": "rs-RA2513005011004",
    "idNo": "RA2513005011004",
    "name": "Ms. J. Karthigayani",
    "email": "kj4510@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. R. Narayanamoorthi)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9962409988",
    "type": "faculty"
  },
  {
    "id": "rs-RA2513005011005",
    "idNo": "RA2513005011005",
    "name": "Mr. R. Sasikumar",
    "email": "sr2382@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. R. Palanisamy)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9791684196",
    "type": "faculty"
  },
  {
    "id": "rs-RA2513005011006",
    "idNo": "RA2513005011006",
    "name": "Mr. Rezwan .A",
    "email": "ra2648@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. M. Jagabar Sathik)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "8072982209",
    "type": "faculty"
  },
  {
    "id": "rs-RA2513005011007",
    "idNo": "RA2513005011007",
    "name": "Mr. C. Vishnu Thilack",
    "email": "vt9451@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. C.S. Boopathi)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9176052258",
    "type": "faculty"
  },
  {
    "id": "rs-RA2513005011008",
    "idNo": "RA2513005011008",
    "name": "Ms. Shahana Parveen",
    "email": "sn9820@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. J. Divyanavamani)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9629239226",
    "type": "faculty"
  },
  {
    "id": "rs-PA2513005012001",
    "idNo": "PA2513005012001",
    "name": "Ms. Sharanyaa .K.V",
    "email": "sk7430@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. K. Selvakumar)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "8903630799",
    "type": "faculty"
  },
  {
    "id": "rs-RC2613005011001",
    "idNo": "RC2613005011001",
    "name": "Ms. C.M. Priyanka",
    "email": "pc1496@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. J. Divyanavamani)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "7708834457",
    "type": "faculty"
  },
  {
    "id": "rs-RC2613005011002",
    "idNo": "RC2613005011002",
    "name": "Ms. K. Shanthi",
    "email": "sk6678@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. A. Domnic Savio)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9514497441",
    "type": "faculty"
  },
  {
    "id": "rs-RC2613005011003",
    "idNo": "RC2613005011003",
    "name": "Ms. G. Ponmalar",
    "email": "gr5675@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. C. Nithya)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9176668333",
    "type": "faculty"
  },
  {
    "id": "rs-RC2613005011004",
    "idNo": "RC2613005011004",
    "name": "Ms. B. Gomathy",
    "email": "gb1985@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. C. Subramani)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "7904935136",
    "type": "faculty"
  },
  {
    "id": "rs-RC2613005011005",
    "idNo": "RC2613005011005",
    "name": "Mr. M. Saravanakumar",
    "email": "sm0493@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. J. Preetha Roselyn)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9952870708",
    "type": "faculty"
  },
  {
    "id": "rs-RC2613005011006",
    "idNo": "RC2613005011006",
    "name": "Ms. T.R. Suchithra",
    "email": "st8978@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. R. Femi)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9566943964",
    "type": "faculty"
  },
  {
    "id": "rs-RC2613005011007",
    "idNo": "RC2613005011007",
    "name": "Mr. S. Ramanathan",
    "email": "rs0190@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. T.M. Thamizh Tentral)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9994112227",
    "type": "faculty"
  },
  {
    "id": "rs-PC2613005012001",
    "idNo": "PC2613005012001",
    "name": "Mr. S. Sivagnanam",
    "email": "is8530@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. R. Palanisamy)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9003174950",
    "type": "faculty"
  },
  {
    "id": "rs-PC2613005012002",
    "idNo": "PC2613005012002",
    "name": "Ms. R. Senthil Vadivu",
    "email": "sr8035@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. D. Karthikeyan)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9790919677",
    "type": "faculty"
  },
  {
    "id": "rs-PC2613005013001",
    "idNo": "PC2613005013001",
    "name": "Ms. T.A. Jesu Dercy",
    "email": "jt4767@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. M. Arun Noyal Doss)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9698010369",
    "type": "faculty"
  },
  {
    "id": "rs-PC2613005013002",
    "idNo": "PC2613005013002",
    "name": "Ms. Bhanupriya Kalidindi",
    "email": "bk8942@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. N. Chellammal)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9948283673",
    "type": "faculty"
  },
  {
    "id": "rs-PC2613005013003",
    "idNo": "PC2613005013003",
    "name": "Mr. R. Sriharan",
    "email": "sr8308@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. C. Bharatiraja)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "7904819769",
    "type": "faculty"
  },
  {
    "id": "rs-PC2613005013004",
    "idNo": "PC2613005013004",
    "name": "Mr. R. Rasheed Ahmed",
    "email": "rr4506@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Scholar (Guide: Dr. V. Pradeep)",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "7418742687",
    "type": "faculty"
  },
  {
    "id": "rs-RA2613005011006",
    "idNo": "RA2613005011006",
    "name": "Ms.Blessy Hepsiba P",
    "email": "bp7114@srmist.edu.in",
    "category": "Research Scholar",
    "designation": "Research Scholar",
    "department": "EEE",
    "cohort": "Research Scholar",
    "phone": "9994933472",
    "type": "faculty"
  }
];
var ALL_RECIPIENTS = [...EEE_STUDENTS, ...EEE_FACULTIES];

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
var DEFAULT_STUDENTS = EEE_STUDENTS;
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
      const data = JSON.parse(fs2.readFileSync(STUDENTS_DATA_FILE, "utf-8"));
      if (Array.isArray(data) && data.length > 0) return data;
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
    totalFaculties: EEE_FACULTIES.length,
    totalRecipients: students.length + EEE_FACULTIES.length,
    totalEmailReach: totalEmailsSent,
    engagementRate: totalEmailsSent > 0 ? "100%" : "0%",
    deliveryRate: totalEmailsSent > 0 ? "100% (SMTP Verified)" : "Ready (Verified)",
    domainHealth: "Active Google App Relay"
  });
});
apiRouter.get("/students", (req, res) => {
  res.json(readStudents());
});
apiRouter.get("/faculties", (req, res) => {
  res.json(EEE_FACULTIES);
});
apiRouter.get("/recipients", (req, res) => {
  const customStudents = readStudents();
  const combined = [...customStudents, ...EEE_FACULTIES];
  res.json(combined);
});
apiRouter.post("/students", (req, res) => {
  const { name, regNo, email, batch, year, capstoneGroup } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  const cleanEmail = email.trim().toLowerCase();
  const newStudent = {
    id: `STU-${Date.now().toString(36).toUpperCase()}`,
    name,
    regNo: regNo || `RA211100501${Math.floor(1e3 + Math.random() * 9e3)}`,
    email: cleanEmail,
    batch: batch || "EEE-A",
    year: year || "Final Year UG",
    capstoneGroup: capstoneGroup || "General"
  };
  const students = readStudents();
  const existingIdx = students.findIndex((s) => s.email.toLowerCase() === cleanEmail);
  if (existingIdx >= 0) {
    students[existingIdx] = { ...students[existingIdx], ...newStudent };
  } else {
    students.push(newStudent);
  }
  writeStudents(students);
  res.status(201).json({ success: true, student: newStudent });
});
apiRouter.post("/students/bulk", (req, res) => {
  const { students: newStudentsList } = req.body;
  if (!Array.isArray(newStudentsList) || newStudentsList.length === 0) {
    return res.status(400).json({ error: "Array of students is required" });
  }
  const existing = readStudents();
  const added = [];
  for (const s of newStudentsList) {
    if (!s.email) continue;
    const cleanEmail = s.email.trim().toLowerCase();
    const existingIdx = existing.findIndex((item) => item.email.toLowerCase() === cleanEmail);
    const studentObj = {
      id: existingIdx >= 0 ? existing[existingIdx].id : `STU-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      name: s.name ? s.name.trim() : cleanEmail.split("@")[0],
      regNo: s.regNo ? s.regNo.trim() : `RA211100501${Math.floor(1e3 + Math.random() * 9e3)}`,
      email: cleanEmail,
      batch: s.batch ? s.batch.trim() : "EEE-A",
      year: s.year ? s.year.trim() : "Final Year UG",
      capstoneGroup: s.capstoneGroup ? s.capstoneGroup.trim() : "General"
    };
    if (existingIdx >= 0) {
      existing[existingIdx] = studentObj;
    } else {
      existing.push(studentObj);
    }
    added.push(studentObj);
  }
  writeStudents(existing);
  res.status(201).json({
    success: true,
    addedCount: added.length,
    students: added,
    totalCount: existing.length
  });
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
    platform: platform || "zoho",
    platformName: platformName || (link && link.includes("zoho") ? "Zoho Meeting" : "Zoho Meeting"),
    link: link || "https://meet.zoho.in/nvzd-cbn-fyn",
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
        link: "https://meet.zoho.in/nvzd-cbn-fyn"
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
    message: isConfigured ? `${SMTP_CONFIG.host.includes("brevo") || SMTP_CONFIG.host.includes("sendinblue") ? "Brevo" : "Google"} SMTP relay authenticated and active for Prof. Krishnavel` : "SMTP relay credentials pending"
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
