import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Send, 
  CheckCircle2, 
  ExternalLink, 
  Calendar, 
  Clock, 
  Plus, 
  Trash2,
  Mail
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export const PreviewConfirmationPage: React.FC = () => {
  const [recipients, setRecipients] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleAddEmail = () => {
    const val = newEmail.trim().toLowerCase();
    if (!val || !val.includes('@')) {
      showToast('Invalid Email', 'Please enter a valid email address', 'error');
      return;
    }
    if (recipients.includes(val)) {
      showToast('Duplicate Email', 'This recipient is already in the list', 'info');
      return;
    }
    setRecipients((prev) => [...prev, val]);
    setNewEmail('');
    showToast('Recipient Queued', val, 'success');
  };

  const handleRemoveEmail = (index: number) => {
    setRecipients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDispatch = async () => {
    if (recipients.length === 0) {
      showToast('No Recipients', 'Please add at least one recipient email address', 'warning');
      return;
    }

    setIsSending(true);
    try {
      const res = await api.sendSmtpEmail({
        recipients,
        session: {
          title: 'Advanced Industrial Robotics & Digital Twin Architecture · Seminar IV',
          date: 'Thursday, Oct 24, 2024',
          time: '03:30 PM - 05:00 PM IST',
          link: 'https://meet.google.com/eng-krish-pract',
          notes: 'Pre-flight verified dispatch distributed via Google SMTP relay. Mandated for enrolled Capstone candidates.'
        }
      });

      if (res.success) {
        showToast(
          'Dispatches Delivered',
          `Successfully distributed to ${res.deliveredCount} recipients via srmeeelibraray@gmail.com!`,
          'success',
          5000
        );
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      } else {
        showToast('Dispatch Error', res.error || 'Failed to dispatch notices', 'error');
      }
    } catch (err: any) {
      showToast('Transmission Error', err.message, 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 pb-20">
      <div className="bg-white border border-[#e6e2da] rounded-lg p-8 shadow-sm space-y-6">
        
        {/* Header */}
        <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs text-stone-500 font-medium mb-1">Pre-Flight Dispatch Review</div>
            <h1 className="font-serif text-2xl font-normal text-stone-900">Verification & Recipient Summary</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span className="text-xs text-stone-600 font-mono">SMTP: srmeeelibraray@gmail.com</span>
          </div>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-stone-50 border border-stone-200 rounded text-center">
            <div className="text-xs text-stone-500 mb-1">Target Recipients</div>
            <div className="text-2xl font-medium text-stone-900 tabular-nums">{recipients.length}</div>
            <div className="text-[11px] text-stone-500 mt-1">Enrolled Scholars & Faculty</div>
          </div>
          <div className="p-4 bg-stone-50 border border-stone-200 rounded text-center">
            <div className="text-xs text-stone-500 mb-1">Faculty Principal</div>
            <div className="text-sm font-semibold text-stone-900 mt-1">Prof. Krishnavel</div>
            <div className="text-[11px] text-stone-500 mt-1">SRM EEE Advisory</div>
          </div>
          <div className="p-4 bg-stone-50 border border-stone-200 rounded text-center">
            <div className="text-xs text-stone-500 mb-1">Relay Protocol</div>
            <div className="text-2xl font-medium text-emerald-700 tabular-nums">100%</div>
            <div className="text-[11px] text-stone-500 mt-1">Direct Google SMTP (SSL)</div>
          </div>
        </div>

        {/* Session Overview Card */}
        <div className="p-5 border border-stone-200 rounded-lg bg-[#faf9f6] space-y-3 text-xs">
          <div className="flex items-start gap-4">
            <img
              alt="Prof. Krishnavel"
              className="w-12 h-12 rounded-full object-cover border border-stone-300 mt-0.5 flex-shrink-0"
              src="/professor_krishnavel.jpg"
            />
            <div className="space-y-1 flex-1">
              <div className="text-[11px] text-stone-500 font-medium uppercase">Session Agenda & Dispatch Payload</div>
              <div className="text-sm font-semibold text-stone-900 leading-snug">
                Academic Session Notification & Calendar Synchronizer
              </div>
              <div className="text-xs text-stone-600 font-medium flex items-center gap-2">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Scheduled Term 2024–25</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> RFC-5545 Attached</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-stone-700 pt-2 border-t border-stone-200">
            <div>
              <span className="text-stone-500">Teleconference Gateway:</span>
              <a
                href="https://meet.google.com/eng-krish-pract"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-blue-700 hover:underline ml-1 inline-flex items-center gap-0.5"
              >
                Google Meet <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div>
              <span className="text-stone-500">Calendar Invitation:</span>
              <span className="font-medium text-stone-800 ml-1">Attached RFC-5545 .ics</span>
            </div>
          </div>

          <div className="pt-2 text-stone-600 leading-relaxed border-t border-stone-200/80">
            <strong>Faculty Directive:</strong> Pre-flight verification dispatch for academic communications and verified student dispatches.
          </div>
        </div>

        {/* Recipients List Manager */}
        <div className="p-4 border border-stone-200 rounded-lg bg-white space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-medium text-stone-900">Selected Recipient Mailboxes:</span>
            <span className="text-[11px] text-stone-500 font-mono">{recipients.length} addresses queued</span>
          </div>

          <div className="max-h-40 overflow-y-auto space-y-1 bg-stone-50 p-2.5 rounded border border-stone-200 text-stone-700 font-mono text-[11px] divide-y divide-stone-100">
            {recipients.length === 0 ? (
              <div className="text-center py-4 text-stone-400 font-sans">
                No recipient mailboxes queued yet. Add an email address below to test pre-flight verification.
              </div>
            ) : (
              recipients.map((email, idx) => (
                <div key={email} className="flex items-center justify-between py-1">
                  <span>{email}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(idx)}
                    className="text-stone-400 hover:text-stone-700 p-0.5"
                    title="Remove"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Quick Add */}
          <div className="flex gap-2 pt-1">
            <input
              type="email"
              placeholder="Add another recipient address..."
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddEmail();
                }
              }}
              className="flex-1 h-8 px-3 bg-white text-stone-900 border border-stone-200 rounded text-xs focus:outline-none focus:border-stone-400"
            />
            <button
              type="button"
              onClick={handleAddEmail}
              className="h-8 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-medium text-xs transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>

        {/* Checklist */}
        <div className="p-4 border border-stone-200 rounded-lg bg-white space-y-2 text-xs">
          <div className="font-medium text-stone-900">Pre-Flight Verification Checklist:</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-stone-600">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>SMTP relay verified</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Calendar invite attached (.ics)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Prof. Krishnavel portrait embedded</span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate('/schedule-session')}
            className="w-full sm:w-auto px-4 py-2 border border-stone-200 text-stone-700 hover:bg-stone-50 rounded text-xs font-medium transition-colors"
          >
            Cancel & Return to Schedule
          </button>
          
          <button
            type="button"
            onClick={handleDispatch}
            disabled={isSending}
            className="w-full sm:w-auto px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Send className="w-4 h-4" />
            <span>{isSending ? 'Dispatching via Google SMTP...' : 'Confirm & Dispatch via SMTP'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
