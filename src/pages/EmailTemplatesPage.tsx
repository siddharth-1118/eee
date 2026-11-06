import React, { useState } from 'react';
import { 
  Code, 
  Download, 
  Send, 
  Edit, 
  Check, 
  ExternalLink,
  Laptop,
  Columns
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export const EmailTemplatesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'desktop' | 'split'>('split');
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { showToast } = useToast();

  const handleCopyHtml = () => {
    const rawHtml = `<!-- SRM EEE Official Academic Session Dispatch Notice -->
<table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f6;font-family:Inter,sans-serif;">
  <tr><td align="center" style="padding:24px;">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e6e2da;border-radius:6px;padding:24px;">
      <tr><td>
        <h2 style="font-size:16px;color:#1c1917;margin:0 0 8px 0;">Academic Advisory Session & Teleconference Notice</h2>
        <p style="font-size:13px;color:#57534e;line-height:1.5;">Date: Scheduled Date & Time (IST)</p>
        <p style="font-size:13px;color:#57534e;"><a href="https://meet.google.com/eng-krish-pract" style="color:#1e3a8a;font-weight:600;">Join Teleconference Gateway</a></p>
        <p style="font-size:11px;color:#78716c;margin-top:16px;">Prof. of Practice Engr. Krishnavel · SRMIST EEE</p>
      </td></tr>
    </table>
  </td></tr>
</table>`;
    navigator.clipboard.writeText(rawHtml).then(() => {
      setCopied(true);
      showToast('HTML Copied', 'Template source copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadIcs = () => {
    const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//SRMIST EEE//Academic Portal//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:REQUEST',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@srmist.edu.in`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${stamp}`,
      'SUMMARY:Official Academic Advisory Session',
      'DESCRIPTION:Conducted by Prof. Krishnavel, Senior Faculty Advisor, SRM EEE.\\nMeeting: https://meet.google.com/eng-krish-pract',
      'LOCATION:https://meet.google.com/eng-krish-pract',
      'ORGANIZER;CN="Prof. Krishnavel":mailto:srmeeelibraray@gmail.com',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'seminar_iv_robotics.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Calendar Ready', 'Downloaded seminar_iv_robotics.ics', 'success');
  };

  const handleSendTestEmail = async () => {
    const email = prompt('Enter destination email for live test dispatch:', 'srmeeelibraray@gmail.com');
    if (!email) return;

    setIsSending(true);
    showToast('Sending...', `Dispatching to ${email} via Google SMTP`, 'info');
    try {
      const res = await api.sendSmtpEmail({
        recipients: [email],
        session: {
          title: 'Advanced Industrial Robotics & Digital Twin Architecture · Seminar IV',
          date: 'Thursday, Oct 24, 2024',
          time: '03:30 PM - 05:00 PM IST',
          link: 'https://meet.google.com/eng-krish-pract',
          notes: 'Preparatory brief on kinematic inverse solvers and digital twin ROS2 testbed in Lab 4B. Mandatory for Capstone Groups 04, 09, and 12.'
        }
      });

      if (res.success) {
        showToast('Email Dispatched', `Test email delivered to ${email} via srmeeelibraray@gmail.com!`, 'success', 5000);
      } else {
        showToast('Failed', res.error || 'Delivery failed', 'error');
      }
    } catch (e: any) {
      showToast('Error', e.message, 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 pb-20">
      
      {/* Utility Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-lg font-semibold text-stone-900">Email Dispatch Template Inspection</h1>
          <p className="text-xs text-stone-500">
            Preview formatted student and faculty notices rendered across institutional mail clients
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('desktop')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
              viewMode === 'desktop'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" /> Full Width
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
              viewMode === 'split'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
            }`}
          >
            <Columns className="w-3.5 h-3.5" /> Side Inspector
          </button>
          <button
            onClick={handleCopyHtml}
            className="px-3 py-1.5 rounded text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Code className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy HTML'}</span>
          </button>
        </div>
      </div>

      {/* Main Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Email Canvas Window */}
        <div className={`${viewMode === 'desktop' ? 'lg:col-span-12' : 'lg:col-span-8'} bg-white border border-[#e6e2da] rounded-lg overflow-hidden transition-all duration-200 shadow-sm`}>
          
          {/* Client Header Chrome */}
          <div className="bg-stone-50 border-b border-stone-200 px-4 py-2.5 flex items-center justify-between text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-medium text-stone-800">Faculty Advisory Bulletin</span>
            </div>
            <div className="text-[11px] text-stone-500 font-mono">640px Responsive Canvas</div>
          </div>

          {/* Envelope Header */}
          <div className="p-5 border-b border-stone-100 bg-[#fdfbf7] space-y-2 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h2 className="text-sm font-semibold text-stone-900 leading-snug">
                [Academic Session] Advanced Industrial Robotics & Digital Twin Architecture · Seminar IV
              </h2>
              <span className="text-[11px] text-stone-500 tabular-nums whitespace-nowrap">
                Thu, Oct 24, 2024 · 08:15 AM
              </span>
            </div>
            <div className="text-stone-600 flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
              <div>
                <span className="text-stone-400">From:</span> Prof. Krishnavel &lt;srmeeelibraray@gmail.com&gt;
              </div>
              <div>
                <span className="text-stone-400">To:</span> Selected SRM EEE Students &lt;roster-relay@srmist.edu.in&gt;
              </div>
            </div>
          </div>

          {/* Rendered Email Body Canvas */}
          <div className="p-6 sm:p-8 bg-white max-w-2xl mx-auto space-y-6 text-xs text-stone-800">
            
            {/* Institutional Brand Crest */}
            <div className="border-b border-stone-200 pb-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-semibold text-stone-500 tracking-wider uppercase">
                  SRM Institute of Science & Technology
                </div>
                <div className="text-sm font-medium text-stone-900">
                  Department of Electrical & Electronics Engineering
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                Official Advisory Bulletin
              </span>
            </div>

            {/* Session Headline */}
            <div>
              <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wide mb-1">
                Seminar Series AY 2024–25
              </div>
              <h2 className="font-serif text-xl font-normal text-stone-900 leading-snug">
                Seminar IV: Advanced Industrial Robotics & Digital Twin Architecture
              </h2>
            </div>

            <p className="text-stone-600 leading-relaxed text-xs">
              Dear Scholar, this formal convocation notice confirms your registration for the upcoming engineering seminar led by <strong>Prof. of Practice Engr. Krishnavel</strong>.
            </p>

            {/* Coordinates Box */}
            <div className="p-4 bg-[#faf9f6] border border-stone-200 rounded-lg space-y-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-stone-700">
                <div>
                  <span className="text-stone-500 block text-[11px]">Scheduled Timetable:</span>
                  <span className="font-medium text-stone-900">Thursday, Oct 24, 2024 · 03:30 PM - 05:00 PM IST</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">Gateway Location:</span>
                  <span className="font-medium text-stone-900">Google Meet / Lab 4B Mechatronics Wing</span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200/70 flex items-center justify-between">
                <a
                  href="https://meet.google.com/eng-krish-pract"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-medium transition-colors"
                >
                  Join Teleconference Gateway <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-[11px] text-stone-500 font-mono">ID: eng-krish-pract</span>
              </div>
            </div>

            {/* Syllabus Notes */}
            <div className="space-y-1 pt-1">
              <div className="font-semibold text-stone-900">Preparatory Reading & Prerequisites:</div>
              <ul className="list-disc list-inside space-y-1 text-stone-600 pl-1">
                <li>Kinematic Inverse Solvers technical brief (accessible on department portal).</li>
                <li>ROS2 testbed environment access verification.</li>
                <li>Mandatory project milestone check for Capstone Groups 04, 09, and 12.</li>
              </ul>
            </div>

            {/* RSVP Block */}
            <div className="p-3 bg-stone-50 border border-stone-200 rounded text-center space-y-2">
              <div className="text-[11px] text-stone-600 font-medium">Please confirm your attendance status for the session register:</div>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => showToast('RSVP Confirmed', 'Recorded as Attending', 'success')}
                  className="px-3 py-1 bg-white hover:bg-stone-100 text-stone-900 border border-stone-200 rounded text-xs font-medium"
                >
                  Attending
                </button>
                <button
                  type="button"
                  onClick={() => showToast('RSVP Logged', 'Marked as Tentative', 'info')}
                  className="px-3 py-1 bg-white hover:bg-stone-100 text-stone-900 border border-stone-200 rounded text-xs"
                >
                  Tentative
                </button>
                <button
                  type="button"
                  onClick={() => showToast('RSVP Logged', 'Marked as Unable to Attend', 'warning')}
                  className="px-3 py-1 bg-white hover:bg-stone-100 text-stone-600 border border-stone-200 rounded text-xs"
                >
                  Unable to Attend
                </button>
              </div>
            </div>

            {/* Faculty Signature with Sir's Portrait */}
            <div className="pt-4 border-t border-stone-200 flex items-center gap-3">
              <img
                src="/professor_krishnavel.jpg"
                alt="Prof. Krishnavel"
                className="w-12 h-12 rounded-full object-cover border border-stone-300 flex-shrink-0"
              />
              <div className="text-[11px] text-stone-600 space-y-0.5">
                <div className="font-semibold text-stone-900 text-xs">Prof. of Practice Engr. Krishnavel</div>
                <div>Senior Faculty Advisor · Automation & Robotics</div>
                <div>Department of Electrical & Electronics Engineering · SRMIST</div>
                <div className="text-[10px] text-stone-500 font-mono">Relay: srmeeelibraray@gmail.com</div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Side Inspector Panel */}
        {viewMode === 'split' && (
          <div className="lg:col-span-4 space-y-4">
            
            <div className="bg-white border border-[#e6e2da] rounded-lg p-5 space-y-4 shadow-sm">
              <h3 className="text-sm font-semibold text-stone-900">Dispatch Controls</h3>
              
              <div className="space-y-2 text-xs">
                <button
                  type="button"
                  onClick={handleDownloadIcs}
                  className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download .ics Calendar
                </button>

                <button
                  type="button"
                  onClick={handleSendTestEmail}
                  disabled={isSending}
                  className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSending ? 'Sending via SMTP...' : 'Send Live Test Email'}</span>
                </button>
              </div>

              <div className="pt-3 border-t border-stone-100 text-xs space-y-2 text-stone-600">
                <div className="font-semibold text-stone-900">Dispatch Parameters:</div>
                <div className="flex justify-between">
                  <span>Relay Account:</span>
                  <span className="font-mono text-stone-800">srmeeelibraray@gmail.com</span>
                </div>
                <div className="flex justify-between">
                  <span>Encryption:</span>
                  <span className="font-mono text-stone-800">SSL (Port 465)</span>
                </div>
                <div className="flex justify-between">
                  <span>Calendar Invite:</span>
                  <span className="font-mono text-stone-800">RFC-5545 Attached</span>
                </div>
                <div className="flex justify-between">
                  <span>Signature Badge:</span>
                  <span className="font-mono text-stone-800">Sir's Portrait (CID)</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
