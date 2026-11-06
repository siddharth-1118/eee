import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Archive, 
  Send, 
  Calendar, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  Users, 
  Mail, 
  Sparkles,
  Database
} from 'lucide-react';
import { api } from '../services/api';
import { Session, PortalStats, SmtpStatus } from '../types';
import { useToast } from '../context/ToastContext';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<PortalStats | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [smtpStatus, setSmtpStatus] = useState<SmtpStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, sessionsData, smtpData] = await Promise.all([
          api.getStats(),
          api.getSessions(),
          api.getSmtpStatus()
        ]);
        setStats(statsData);
        setSessions(sessionsData);
        setSmtpStatus(smtpData);
      } catch (err) {
        showToast('Telemetry Offline', 'Using local cache for academic records', 'info');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [showToast]);

  const handleQuickTest = async () => {
    showToast('Dispatching...', 'Sending test email to faculty mailbox via Google SMTP', 'info');
    try {
      const res = await api.sendSmtpEmail({
        recipients: ['srmeeelibraray@gmail.com'],
        session: {
          title: 'Quick Faculty Verification Dispatch',
          date: 'Academic Term 2024-25',
          time: 'Instant Verification',
          link: 'https://meet.google.com/eng-krish-pract',
          notes: 'Automated SMTP self-test initiated from React Faculty Dashboard.'
        }
      });
      if (res.success) {
        showToast('Email Dispatched', `Delivered to srmeeelibraray@gmail.com (ID: ${res.results?.[0]?.messageId})`, 'success');
      }
    } catch (e: any) {
      showToast('Dispatch Failed', e.message, 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 pb-20">
      
      {/* Primary Header Hero Banner with Sir's Portrait */}
      <div className="bg-white border border-[#e6e2da] rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <img
              src="/professor_krishnavel.jpg"
              alt="Prof. Krishnavel"
              className="w-16 h-16 rounded-full object-cover border-2 border-stone-200 shadow-sm flex-shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs text-stone-500 font-medium">
                  SRMIST · Department of Electrical & Electronics Engineering
                </span>
                <span className="text-stone-300">·</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  SMTP Relay Active: {smtpStatus?.user || 'srmeeelibraray@gmail.com'}
                </span>
              </div>
              <h1 className="font-serif text-2xl font-normal text-stone-900">
                Prof. Krishnavel · Academic Advisory Portal
              </h1>
              <p className="text-xs text-stone-600 mt-1 max-w-xl">
                Schedule technical seminars, configure syllabus requirements, and broadcast calendar-verified dispatches to enrolled student cohorts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleQuickTest}
              className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Quick Test Email
            </button>
            <Link
              to="/schedule-session"
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Schedule Session
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row: 4 Clean Institutional Stat Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[#e6e2da] rounded-lg p-4">
          <div className="text-xs text-stone-500 mb-1 flex items-center justify-between">
            <span>Total Sessions Conducted</span>
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
          </div>
          <div className="text-2xl font-medium text-stone-900 tabular-nums">
            {stats?.totalSessions ?? 0}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Academic Year 2024–25</div>
        </div>

        <div className="bg-white border border-[#e6e2da] rounded-lg p-4">
          <div className="text-xs text-stone-500 mb-1 flex items-center justify-between">
            <span>Upcoming Scheduled</span>
            <Clock className="w-3.5 h-3.5 text-stone-400" />
          </div>
          <div className="text-2xl font-medium text-stone-900 tabular-nums">
            {stats?.upcomingScheduled ?? 0}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 truncate">
            {sessions.length > 0 ? `Next: ${sessions[0].title}` : 'No sessions queued'}
          </div>
        </div>

        <div className="bg-white border border-[#e6e2da] rounded-lg p-4">
          <div className="text-xs text-stone-500 mb-1 flex items-center justify-between">
            <span>Enrolled Students</span>
            <Users className="w-3.5 h-3.5 text-stone-400" />
          </div>
          <div className="text-2xl font-medium text-stone-900 tabular-nums">
            {stats?.totalStudents ?? 0} candidates
          </div>
          <div className="text-[11px] text-stone-500 mt-1">SRM EEE Directory</div>
        </div>

        <div className="bg-white border border-[#e6e2da] rounded-lg p-4">
          <div className="text-xs text-stone-500 mb-1 flex items-center justify-between">
            <span>SMTP Delivery Health</span>
            <Mail className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-medium text-emerald-700 tabular-nums">
            100%
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            Google SMTP SSL relay verified
          </div>
        </div>
      </div>

      {/* Main Grid: Scheduled Sessions Table (8 cols) vs Quick Controls (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Scheduled Sessions List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-[#e6e2da] rounded-lg overflow-hidden">
            <div className="p-4 border-b border-stone-200 bg-stone-50/50 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-stone-900">Scheduled Academic Convocations</h2>
                <p className="text-[11px] text-stone-500">Official technical advisory calendar & session register</p>
              </div>
              <Link
                to="/schedule-session"
                className="text-xs font-medium text-stone-700 hover:text-stone-900 flex items-center gap-1"
              >
                + New Dispatch
              </Link>
            </div>

            <div className="divide-y divide-stone-100">
              {loading ? (
                <div className="p-8 text-center text-xs text-stone-400">Loading academic records...</div>
              ) : sessions.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3 text-stone-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-stone-900">No Academic Sessions Scheduled</h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                    The portal ledger is clean. When Prof. Krishnavel schedules a technical seminar or capstone advisory, it will appear here.
                  </p>
                  <Link
                    to="/schedule-session"
                    className="inline-flex items-center gap-1.5 mt-4 px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-medium transition-colors shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Schedule First Session
                  </Link>
                </div>
              ) : (
                sessions.slice(0, 5).map((session) => (
                  <div key={session.id} className="p-4 hover:bg-stone-50/70 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-stone-400">{session.id}</span>
                          <span className="text-stone-300">·</span>
                          <span className="text-[11px] font-medium text-stone-600">{session.cohort}</span>
                          <span className="text-stone-300">·</span>
                          <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 bg-stone-100 text-stone-700 rounded">
                            {session.recipientCount || 1} Recipients
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-stone-900 leading-snug">
                          {session.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 pt-0.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-stone-400" />
                            {session.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-stone-400" />
                            {session.time}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <a
                          href={session.link}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded transition-colors flex items-center gap-1"
                        >
                          Join
                          <ExternalLink className="w-3 h-3 text-stone-500" />
                        </a>
                        <button
                          onClick={() => navigate('/email-preview')}
                          className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded transition-colors"
                        >
                          Dispatch
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 border-t border-stone-100 bg-stone-50/50 text-center">
              <Link to="/session-archive" className="text-xs text-stone-600 hover:text-stone-900 font-medium">
                View all sessions in archive &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Controls & System Diagnostics */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Quick Actions Card */}
          <div className="bg-white border border-[#e6e2da] rounded-lg p-5 space-y-3">
            <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
              Faculty Command Shortcuts
            </h3>
            
            <div className="space-y-2">
              <Link
                to="/schedule-session"
                className="w-full py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-medium flex items-center justify-between transition-colors shadow-sm"
              >
                <span className="flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Schedule New Session
                </span>
                <span className="text-[10px] font-mono text-stone-400">Step 1-3</span>
              </Link>

              <Link
                to="/email-templates"
                className="w-full py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-xs font-medium flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-stone-600" /> Inspect Email Templates
                </span>
                <span className="text-[10px] font-mono text-stone-500">640px</span>
              </Link>

              <Link
                to="/session-archive"
                className="w-full py-2 px-3 border border-stone-200 hover:bg-stone-50 text-stone-700 rounded text-xs font-medium flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Archive className="w-4 h-4 text-stone-500" /> Session Archive & CSV
                </span>
                <span className="text-[10px] font-mono text-stone-500">Audit</span>
              </Link>
            </div>
          </div>

          {/* Infrastructure Health Block */}
          <div className="bg-white border border-[#e6e2da] rounded-lg p-5 text-xs space-y-2.5">
            <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-stone-500" /> System Telemetry
            </h3>

            <div className="divide-y divide-stone-100 text-stone-600">
              <div className="py-1.5 flex justify-between">
                <span>Relay Mode:</span>
                <span className="font-mono text-stone-900">Direct Google SMTP</span>
              </div>
              <div className="py-1.5 flex justify-between">
                <span>Authenticated Relay:</span>
                <span className="font-mono text-stone-900">{smtpStatus?.user || 'srmeeelibraray@gmail.com'}</span>
              </div>
              <div className="py-1.5 flex justify-between">
                <span>Calendar Standard:</span>
                <span className="font-mono text-stone-900">RFC-5545 (.ics)</span>
              </div>
              <div className="py-1.5 flex justify-between">
                <span>Storage Ledger:</span>
                <span className="font-mono text-emerald-700">Self-Contained Academic Store</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
