const path = require('path');
const fs = require('fs');
const { transporter } = require('../config/smtp');

const SENDER_NAME = 'Prof. Krishnavel (SRM EEE)';
const SENDER_EMAIL = 'srmeeelibraray@gmail.com';
const DISPATCH_LOG_FILE = path.join(__dirname, '..', 'data', 'dispatches.json');
const PROF_PHOTO_PATH = path.join(__dirname, '..', 'public', 'professor_krishnavel.jpg');

function readDispatches() {
  try {
    if (!fs.existsSync(DISPATCH_LOG_FILE)) return [];
    return JSON.parse(fs.readFileSync(DISPATCH_LOG_FILE, 'utf-8'));
  } catch (e) {
    return [];
  }
}

function writeDispatches(logs) {
  try {
    fs.writeFileSync(DISPATCH_LOG_FILE, JSON.stringify(logs, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error logging dispatch:', e);
  }
}

function generateIcsCalendar(session) {
  const title = session.title || 'Academic Advisory Session';
  const meetUrl = session.link || 'https://meet.google.com/eng-krish-pract';
  const dateStr = session.date || 'Scheduled Date';
  const timeStr = session.time || '15:30 - 17:00 IST';
  const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const uid = `acad-${Date.now()}@srmist.edu.in`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SRMIST EEE//Academic Advisory Portal//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${stamp}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:Academic Session conducted by Prof. Krishnavel, Senior Faculty Advisor, SRM EEE.\\nMeeting Link: ${meetUrl}`,
    `LOCATION:${meetUrl}`,
    `ORGANIZER;CN="Prof. Krishnavel":mailto:${SENDER_EMAIL}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

function generateHtmlEmail(session, recipientEmail) {
  const title = session.title || 'Advanced Industrial Robotics & Digital Twin Architecture · Seminar IV';
  const date = session.date || 'Thursday, Oct 24, 2024';
  const time = session.time || '03:30 PM - 05:00 PM IST';
  const link = session.link || 'https://meet.google.com/eng-krish-pract';
  const notes = session.notes || session.announcementBody || 'Please review preparatory notes before attending the session.';

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
    
    <!-- Institutional Header -->
    <div style="padding: 20px 24px; border-bottom: 1px solid #f5f5f4; background-color: #ffffff;">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #78716c; font-weight: 600;">
        SRM Institute of Science and Technology · Department of EEE
      </div>
      <div style="font-size: 13px; color: #44403c; margin-top: 2px;">
        Academic Advisory & Session Dispatch Notice
      </div>
    </div>

    <!-- Main Content -->
    <div style="padding: 24px;">
      
      <div style="font-size: 12px; color: #a8a29e; font-family: monospace; margin-bottom: 8px;">
        OFFICIAL ACADEMIC NOTICE
      </div>

      <h1 style="font-size: 20px; line-height: 1.35; color: #0c0a09; margin: 0 0 16px 0; font-weight: 600;">
        ${title}
      </h1>

      <p style="font-size: 13px; color: #44403c; margin: 0 0 20px 0;">
        Dear Student, you have been designated to attend this upcoming session convened by <strong>Prof. Krishnavel</strong>. Please find the timetable and teleconference coordinates below.
      </p>

      <!-- Coordinates Box -->
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

      <!-- Syllabus / Agenda Notes -->
      <div style="margin-bottom: 24px;">
        <div style="font-size: 12px; font-weight: 600; color: #1c1917; margin-bottom: 6px;">
          Session Syllabus & Directives:
        </div>
        <div style="font-size: 13px; color: #44403c; line-height: 1.6; white-space: pre-line; background: #ffffff; padding: 12px; border: 1px solid #f5f5f4; border-radius: 4px;">
          ${notes}
        </div>
      </div>

      <!-- Calendar Notice -->
      <div style="background-color: #f5f5f4; border-radius: 4px; padding: 10px 14px; font-size: 12px; color: #57534e; margin-bottom: 24px;">
        📅 <strong>Calendar Invitation Attached:</strong> An RFC-5545 <code>.ics</code> calendar file is attached to this notice to sync with your institutional Google or Outlook Calendar.
      </div>

      <!-- Faculty Signature with Sir's Photo -->
      <div style="padding-top: 20px; border-top: 1px solid #e7e5e4; display: table; width: 100%;">
        <table style="border-collapse: collapse;">
          <tr>
            <td style="vertical-align: middle; padding-right: 14px; width: 64px;">
              <img src="cid:prof_photo" alt="Prof. Krishnavel" style="width: 56px; height: 56px; border-radius: 50%; object-fit: cover; border: 1px solid #d6d3d1; display: block;" />
            </td>
            <td style="vertical-align: middle;">
              <div style="font-size: 13px; font-weight: 600; color: #0c0a09; line-height: 1.3;">Prof. of Practice Engr. Krishnavel</div>
              <div style="font-size: 11px; color: #78716c; margin-top: 2px;">Senior Faculty Advisor · Automation & Robotics</div>
              <div style="font-size: 11px; color: #a8a29e; margin-top: 1px;">Department of Electrical & Electronics Engineering · SRMIST</div>
              <div style="font-size: 11px; color: #78716c; margin-top: 2px;">Relay: <code>srmeeelibraray@gmail.com</code></div>
            </td>
          </tr>
        </table>
      </div>

    </div>

    <!-- Institutional Footer -->
    <div style="padding: 14px 24px; background-color: #fbfaf8; border-top: 1px solid #f5f5f4; font-size: 11px; color: #a8a29e; text-align: center;">
      Academic Advisory Portal · Automated Student Dispatch Relay · SRMIST EEE
    </div>

  </div>
</body>
</html>
  `;
}

async function sendAcademicEmail({ recipients, session }) {
  if (!recipients) {
    throw new Error('No recipients specified for dispatch');
  }

  const recipientList = Array.isArray(recipients)
    ? recipients.filter(Boolean)
    : recipients.split(',').map(s => s.trim()).filter(Boolean);

  if (recipientList.length === 0) {
    throw new Error('Recipient list is empty');
  }

  const title = session.title || 'Academic Session Notification';
  const icsData = generateIcsCalendar(session);

  const attachments = [
    {
      filename: `${(session.title || 'academic_session').replace(/[^a-zA-Z0-9]/g, '_')}.ics`,
      content: icsData,
      contentType: 'text/calendar; charset=utf-8; method=REQUEST'
    }
  ];

  if (fs.existsSync(PROF_PHOTO_PATH)) {
    attachments.push({
      filename: 'professor_krishnavel.jpg',
      path: PROF_PHOTO_PATH,
      cid: 'prof_photo'
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
        text: `Official Academic Notice from Prof. Krishnavel:\n\n${title}\nDate: ${session.date}\nTime: ${session.time}\nLink: ${session.link}\n\n${session.notes || ''}`,
        html,
        attachments
      };

      const info = await transporter.sendMail(mailOptions);
      results.push({
        recipient,
        messageId: info.messageId,
        status: 'delivered'
      });
    } catch (err) {
      console.error(`Failed to send to ${recipient}:`, err.message);
      errors.push({
        recipient,
        error: err.message
      });
    }
  }

  // Record dispatch log
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
    timestamp: new Date().toISOString()
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

module.exports = {
  sendAcademicEmail,
  generateIcsCalendar,
  generateHtmlEmail,
  readDispatches
};
