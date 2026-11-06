import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Send, 
  Calendar, 
  Clock, 
  ExternalLink, 
  Search, 
  CheckCircle2, 
  UserPlus, 
  X, 
  Users,
  Plus,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';
import { Student } from '../types';
import { useToast } from '../context/ToastContext';

export const ScheduleSessionPage: React.FC = () => {
  // Recipient and Roster State
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [customEmails, setCustomEmails] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [customEmailInput, setCustomEmailInput] = useState('');

  // Register Student Inline Form State
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentRegNo, setNewStudentRegNo] = useState('');
  const [newStudentBatch, setNewStudentBatch] = useState('EEE-A');
  const [newStudentGroup, setNewStudentGroup] = useState('Group 04');

  // Form State (Blank by default - only filled when professor adds)
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [link, setLink] = useState('');
  const [platform, setPlatform] = useState('meet');
  const [notes, setNotes] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [sendRealEmail, setSendRealEmail] = useState(true);
  const [isDispatching, setIsDispatching] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadStudents() {
      try {
        const data = await api.getStudents();
        setStudents(data);
        setSelectedEmails(new Set());
      } catch (e) {
        // Safe fallback
      }
    }
    loadStudents();
  }, []);

  const toggleStudent = (email: string) => {
    setSelectedEmails((prev) => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email);
      else next.add(email);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (students.length === 0) return;
    const all = new Set<string>();
    students.forEach((s) => all.add(s.email));
    setSelectedEmails(all);
    showToast('All Students Selected', `${students.length} candidates marked`, 'info');
  };

  const handleClearAll = () => {
    setSelectedEmails(new Set());
    setCustomEmails(new Set());
  };

  const handleSelectGroup = (groupName: string) => {
    const groupEmails = new Set<string>();
    students.filter((s) => s.capstoneGroup === groupName).forEach((s) => groupEmails.add(s.email));
    if (groupEmails.size === 0) {
      showToast('Empty Group', `No students found in ${groupName}`, 'info');
      return;
    }
    setSelectedEmails(groupEmails);
    showToast(`Selected ${groupName}`, `${groupEmails.size} candidates queued`, 'info');
  };

  const handleAddCustomEmail = () => {
    const email = customEmailInput.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      showToast('Invalid Email', 'Please provide a valid recipient address', 'error');
      return;
    }
    setCustomEmails((prev) => new Set(prev).add(email));
    setCustomEmailInput('');
    showToast('Recipient Queued', email, 'success');
  };

  const removeCustomEmail = (email: string) => {
    setCustomEmails((prev) => {
      const next = new Set(prev);
      next.delete(email);
      return next;
    });
  };

  const handleRegisterStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newStudentName.trim();
    const email = newStudentEmail.trim().toLowerCase();
    if (!name || !email || !email.includes('@')) {
      showToast('Validation Error', 'Name and a valid email are required', 'error');
      return;
    }

    try {
      const res = await api.addStudent({
        name,
        email,
        regNo: newStudentRegNo.trim() || undefined,
        batch: newStudentBatch,
        year: 'Final Year UG',
        capstoneGroup: newStudentGroup
      });

      if (res.success && res.student) {
        setStudents((prev) => [...prev, res.student]);
        setSelectedEmails((prev) => new Set(prev).add(res.student.email));
        setNewStudentName('');
        setNewStudentEmail('');
        setNewStudentRegNo('');
        setShowAddStudentForm(false);
        showToast('Student Registered', `${res.student.name} saved to directory`, 'success');
      }
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  const allRecipients = Array.from(new Set([...Array.from(selectedEmails), ...Array.from(customEmails)]));

  const handlePlatformChange = (pId: string) => {
    setPlatform(pId);
    if (!link) {
      if (pId === 'meet') setLink('https://meet.google.com/eng-krish-pract');
      if (pId === 'teams') setLink('https://teams.microsoft.com/l/meetup-join/academic-portal');
      if (pId === 'zoom') setLink('https://zoom.us/j/8842194829');
      if (pId === 'hybrid') setLink('Hall C, EEE Wing 2 (In-Person)');
    }
  };

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      showToast('Title Required', 'Please provide a session title to save as draft', 'warning');
      return;
    }
    try {
      await api.createSession({
        title,
        date: date || 'Date TBD',
        time: time || 'Time TBD',
        link: link || 'Link TBD',
        notes,
        status: 'drafts',
        sendMail: false,
        recipientCount: allRecipients.length
      });
      showToast('Draft Saved', 'Session saved to drafts ledger', 'success');
      navigate('/session-archive');
    } catch (e: any) {
      showToast('Error', e.message, 'error');
    }
  };

  const handleConfirmDispatch = async () => {
    if (!title.trim()) {
      showToast('Title Required', 'Please enter a session title', 'warning');
      return;
    }
    if (allRecipients.length === 0) {
      showToast('No Recipients', 'Please select or add at least one recipient email', 'warning');
      return;
    }

    setIsDispatching(true);
    try {
      const res = await api.createSession({
        title,
        date: date || 'Scheduled Date',
        time: time || 'Scheduled Time',
        link: link || 'https://meet.google.com/eng-krish-pract',
        notes,
        status: 'upcoming',
        sendMail: sendRealEmail,
        selectedRecipients: allRecipients,
        recipientCount: allRecipients.length
      });

      setModalOpen(false);
      if (res.dispatchResult && res.dispatchResult.success) {
        showToast(
          'SMTP Dispatches Delivered',
          `Sent to ${res.dispatchResult.deliveredCount} student inbox(es) via srmeeelibraray@gmail.com!`,
          'success',
          5000
        );
      } else {
        showToast('Session Scheduled', `${allRecipients.length} student(s) enrolled`, 'success');
      }

      setTimeout(() => {
        navigate('/session-archive');
      }, 800);
    } catch (err: any) {
      showToast('Dispatch Error', err.message, 'error');
    } finally {
      setIsDispatching(false);
    }
  };

  const filteredStudents = students.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      s.name.toLowerCase().includes(q) ||
      s.regNo.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      (s.capstoneGroup && s.capstoneGroup.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 pb-20">
      
      {/* Banner */}
      <div className="bg-white border border-[#e6e2da] rounded-lg p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-stone-500 font-medium mb-1">Session Configuration & Roster Dispatch</div>
          <h1 className="font-serif text-2xl font-normal text-stone-900">Schedule Academic Session</h1>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl">
            Configure timetable parameters, specify teleconference coordinates, select target students, and distribute calendar-verified email notices via SMTP.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-stone-600 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded">
          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
          <span>SMTP: <strong>srmeeelibraray@gmail.com</strong></span>
        </div>
      </div>

      {/* Main Grid: Form (8 cols) vs Preview (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Form */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Timetable */}
          <section className="bg-white border border-[#e6e2da] rounded-lg p-6">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
              <h2 className="text-sm font-semibold text-stone-900">1. Timetable & Teleconference Coordinates</h2>
              <span className="text-xs text-stone-400">Step 1 of 3</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1" htmlFor="sessionTitle">
                  Session Title & Agenda
                </label>
                <input
                  id="sessionTitle"
                  type="text"
                  placeholder="e.g., Electrical Machines Laboratory Advisory & Review"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-9 px-3 bg-white text-stone-900 border border-stone-200 rounded text-sm focus:outline-none focus:border-stone-400 placeholder:text-stone-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1" htmlFor="sessionDate">
                    Date
                  </label>
                  <div className="relative">
                    <input
                      id="sessionDate"
                      type="text"
                      placeholder="e.g., Thursday, Nov 14, 2024"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full h-9 pl-8 pr-3 bg-white text-stone-900 border border-stone-200 rounded text-xs focus:outline-none focus:border-stone-400 placeholder:text-stone-400"
                    />
                    <Calendar className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1" htmlFor="sessionTime">
                    Time Interval (IST)
                  </label>
                  <div className="relative">
                    <input
                      id="sessionTime"
                      type="text"
                      placeholder="e.g., 03:30 PM - 05:00 PM IST"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full h-9 pl-8 pr-3 bg-white text-stone-900 border border-stone-200 rounded text-xs focus:outline-none focus:border-stone-400 placeholder:text-stone-400"
                    />
                    <Clock className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-stone-700" htmlFor="meetingLink">
                    Teleconference URL or Hall Gateway
                  </label>
                  <span className="text-[11px] text-stone-500 font-mono">
                    {platform === 'meet' ? 'Google Meet' : platform === 'teams' ? 'MS Teams' : platform === 'zoom' ? 'Zoom Room' : 'Hall C'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    id="meetingLink"
                    type="text"
                    placeholder="e.g., https://meet.google.com/eng-krish-pract"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="flex-1 h-9 px-3 bg-white text-stone-900 border border-stone-200 rounded text-xs focus:outline-none focus:border-stone-400 placeholder:text-stone-400"
                  />
                  {link && link.startsWith('http') && (
                    <a
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="h-9 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded transition-colors flex items-center gap-1"
                    >
                      Test <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1.5">Platform Preset</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'meet', label: 'Google Meet' },
                    { id: 'teams', label: 'MS Teams' },
                    { id: 'zoom', label: 'Zoom Room' },
                    { id: 'hybrid', label: 'Hall C (In-Person)' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handlePlatformChange(p.id)}
                      className={`py-1.5 px-3 rounded text-xs font-medium transition-colors ${
                        platform === p.id
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Syllabus Notes */}
          <section className="bg-white border border-[#e6e2da] rounded-lg p-6">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
              <h2 className="text-sm font-semibold text-stone-900">2. Syllabus Brief & Preparation Notes</h2>
              <span className="text-xs text-stone-400">Step 2 of 3</span>
            </div>

            <textarea
              rows={5}
              placeholder="Enter session agenda, preparation directives, reading materials, or prerequisites for students..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 bg-white text-stone-900 border border-stone-200 rounded text-xs leading-relaxed focus:outline-none focus:border-stone-400 placeholder:text-stone-400"
            />
          </section>

          {/* Section 3: Student Selection Roster */}
          <section className="bg-white border border-[#e6e2da] rounded-lg p-6">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-stone-900">3. Target Student Selection & Delivery</h2>
                <span className="text-[11px] font-mono bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                  {allRecipients.length} Recipient{allRecipients.length === 1 ? '' : 's'} Queued
                </span>
              </div>
              <span className="text-xs text-stone-400">Step 3 of 3</span>
            </div>

            <div className="border border-stone-200 rounded-lg p-4 bg-[#faf9f6] space-y-4">
              
              {/* Header with Quick Select & Register Student */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-stone-500 mr-1 text-[11px]">Quick:</span>
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    disabled={students.length === 0}
                    className="px-2.5 py-1 bg-white hover:bg-stone-100 disabled:opacity-40 text-stone-800 border border-stone-200 rounded text-[11px] font-medium"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    disabled={allRecipients.length === 0}
                    className="px-2.5 py-1 bg-white hover:bg-stone-100 disabled:opacity-40 text-stone-800 border border-stone-200 rounded text-[11px]"
                  >
                    Clear All
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddStudentForm(!showAddStudentForm)}
                    className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded text-[11px] font-medium flex items-center gap-1 ml-1"
                  >
                    <Plus className="w-3 h-3" /> Register Student
                  </button>
                </div>

                {students.length > 0 && (
                  <div className="relative w-full sm:w-60">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Filter roster..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-8 pl-8 pr-3 bg-white text-stone-900 border border-stone-200 rounded text-xs focus:outline-none focus:border-stone-400"
                    />
                  </div>
                )}
              </div>

              {/* Inline Student Registration Form */}
              {showAddStudentForm && (
                <form onSubmit={handleRegisterStudent} className="p-4 bg-white border border-stone-300 rounded-md space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="text-xs font-semibold text-stone-900">Add Student to Institutional Directory</span>
                    <button
                      type="button"
                      onClick={() => setShowAddStudentForm(false)}
                      className="text-stone-400 hover:text-stone-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g., Sai Siddharth Vooka"
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        className="w-full h-8 px-2.5 text-xs border border-stone-200 rounded bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">Official Email Address</label>
                      <input
                        type="email"
                        placeholder="e.g., student@srmist.edu.in"
                        value={newStudentEmail}
                        onChange={(e) => setNewStudentEmail(e.target.value)}
                        className="w-full h-8 px-2.5 text-xs border border-stone-200 rounded bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">Registration No. (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g., RA2111005010001"
                        value={newStudentRegNo}
                        onChange={(e) => setNewStudentRegNo(e.target.value)}
                        className="w-full h-8 px-2.5 text-xs border border-stone-200 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">Batch / Capstone Group</label>
                      <input
                        type="text"
                        placeholder="e.g., Group 04 / EEE-A"
                        value={newStudentGroup}
                        onChange={(e) => setNewStudentGroup(e.target.value)}
                        className="w-full h-8 px-2.5 text-xs border border-stone-200 rounded bg-white"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddStudentForm(false)}
                      className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded transition-colors"
                    >
                      Save to Directory
                    </button>
                  </div>
                </form>
              )}

              {/* Checkbox Roster List */}
              <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1 divide-y divide-stone-100">
                {students.length === 0 ? (
                  <div className="text-center py-6 px-4 bg-white rounded border border-dashed border-stone-200">
                    <Users className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                    <div className="text-xs font-semibold text-stone-700">No Students in Directory Yet</div>
                    <p className="text-[11px] text-stone-500 mt-1 max-w-sm mx-auto">
                      Click <strong>"Register Student"</strong> above to add students to your permanent roster, or enter email addresses directly below.
                    </p>
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="text-center py-4 text-xs text-stone-400">No students matched search criteria.</div>
                ) : (
                  filteredStudents.map((s) => {
                    const isChecked = selectedEmails.has(s.email);
                    return (
                      <label
                        key={s.id}
                        className={`flex items-center justify-between p-2 rounded hover:bg-white cursor-pointer transition-colors ${
                          isChecked ? 'bg-white border border-stone-200' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleStudent(s.email)}
                            className="rounded text-stone-900 border-stone-300 focus:ring-0"
                          />
                          <div>
                            <div className="text-xs font-medium text-stone-900">{s.name}</div>
                            <div className="text-[11px] text-stone-500 font-mono">
                              {s.regNo ? `${s.regNo} · ` : ''}{s.email}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-mono">
                            {s.capstoneGroup || s.batch || 'General'}
                          </span>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>

              {/* Add Custom Recipient Box */}
              <div className="pt-3 border-t border-stone-200">
                <label className="block text-xs font-medium text-stone-700 mb-1" htmlFor="customEmail">
                  Add Recipient / Student Email Address:
                </label>
                <div className="flex gap-2">
                  <input
                    id="customEmail"
                    type="email"
                    placeholder="e.g., student@gmail.com"
                    value={customEmailInput}
                    onChange={(e) => setCustomEmailInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomEmail();
                      }
                    }}
                    className="flex-1 h-8 px-2.5 bg-white text-stone-900 border border-stone-200 rounded text-xs focus:outline-none focus:border-stone-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomEmail}
                    className="px-3 h-8 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-xs font-medium transition-colors flex items-center gap-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Queue
                  </button>
                </div>

                {customEmails.size > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {Array.from(customEmails).map((email) => (
                      <span
                        key={email}
                        className="inline-flex items-center gap-1 text-[11px] bg-stone-200 text-stone-800 px-2 py-0.5 rounded-full font-mono"
                      >
                        {email}
                        <button
                          type="button"
                          onClick={() => removeCustomEmail(email)}
                          className="text-stone-500 hover:text-stone-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded transition-colors"
              >
                Save Draft
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!title.trim()) {
                    showToast('Title Required', 'Please enter a session title', 'warning');
                    return;
                  }
                  if (allRecipients.length === 0) {
                    showToast('No Recipients', 'Select or queue at least one recipient email address', 'warning');
                    return;
                  }
                  setModalOpen(true);
                }}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" /> Review & Send via SMTP
              </button>
            </div>
          </section>

        </div>

        {/* Right: Live Preview Panel */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="bg-white border border-[#e6e2da] rounded-lg p-5">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
              <span className="text-xs font-semibold text-stone-900">Live Email Dispatch Preview</span>
              <span className="text-[11px] text-stone-500 font-mono">SMTP Payload</span>
            </div>

            <div className="border border-stone-100 rounded bg-[#faf9f6] p-4 text-xs space-y-3">
              {/* Sender Header with Sir's Photo */}
              <div className="border-b border-stone-200 pb-2.5 flex items-center gap-3">
                <img
                  alt="Prof. Krishnavel"
                  className="w-10 h-10 rounded-full object-cover border border-stone-200"
                  src="/professor_krishnavel.jpg"
                />
                <div>
                  <div className="font-medium text-stone-900">Prof. of Practice Engr. Krishnavel</div>
                  <div className="text-[11px] text-stone-500">From: <code>srmeeelibraray@gmail.com</code></div>
                </div>
              </div>

              {/* Recipient summary */}
              <div className="text-[11px] text-stone-600 bg-white p-2 rounded border border-stone-200 font-mono">
                To: {allRecipients.length === 0 ? (
                  <span className="text-stone-400 italic">No recipients selected</span>
                ) : (
                  <span className="font-semibold text-stone-800">
                    {allRecipients.slice(0, 2).join(', ')}
                    {allRecipients.length > 2 && ` +${allRecipients.length - 2} more`}
                  </span>
                )}
              </div>

              <div>
                <div className="text-sm font-semibold text-stone-900 leading-snug">
                  {title || <span className="text-stone-400 italic">Untitled Session</span>}
                </div>
                <div className="text-[11px] text-stone-600 mt-1">
                  {date || time ? `${date || 'Date TBD'} · ${time || 'Time TBD'}` : <span className="text-stone-400 italic">Date & Time pending</span>}
                </div>
              </div>

              <div className="p-3 bg-white border border-stone-200 rounded text-stone-700 whitespace-pre-wrap leading-relaxed text-[11px] min-h-[60px]">
                {notes || <span className="text-stone-400 italic">No syllabus directives entered yet.</span>}
              </div>

              <div className="pt-1">
                <a
                  href={link.startsWith('http') ? link : '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full py-2 bg-stone-900 text-white text-center rounded text-xs font-medium"
                >
                  Join Academic Teleconference
                </a>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-stone-500 text-center flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sends verified email with calendar (.ics) attached</span>
            </div>
          </div>
        </div>

      </div>

      {/* Pre-Flight Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-lg max-w-lg w-full p-6 shadow-xl space-y-4">
            <div>
              <div className="text-xs text-stone-500 mb-1">Pre-Flight Dispatch Review</div>
              <h3 className="text-base font-semibold text-stone-900">Confirm Academic Dispatch</h3>
              <p className="text-xs text-stone-600 mt-1">{date || 'Scheduled Date'} · {time || 'Scheduled Time'}</p>
            </div>

            <div className="p-3.5 bg-stone-50 border border-stone-200 rounded text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Relay Account:</span>
                <span className="font-mono text-stone-900 font-medium bg-white px-2 py-0.5 rounded border border-stone-200">
                  srmeeelibraray@gmail.com
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Protocol:</span>
                <span className="font-medium text-emerald-700">Google SMTP (SSL:465)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Target Recipients:</span>
                <span className="font-medium text-stone-900">{allRecipients.length} addresses queued</span>
              </div>
              <div className="pt-2 border-t border-stone-200">
                <div className="max-h-24 overflow-y-auto bg-white p-2 rounded border border-stone-200 font-mono text-[11px] text-stone-700 divide-y divide-stone-100">
                  {allRecipients.map((r) => (
                    <div key={r} className="py-0.5">{r}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                id="chkSendRealEmail"
                type="checkbox"
                checked={sendRealEmail}
                onChange={(e) => setSendRealEmail(e.target.checked)}
                className="rounded text-stone-900 border-stone-300"
              />
              <label htmlFor="chkSendRealEmail" className="text-xs text-stone-700 font-medium cursor-pointer">
                Dispatch real email notifications via Google SMTP immediately
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-3.5 py-2 text-xs font-medium text-stone-700 hover:text-stone-900"
                disabled={isDispatching}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDispatch}
                disabled={isDispatching}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isDispatching ? 'Dispatching via Google SMTP...' : 'Confirm & Dispatch via SMTP'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
