import React, { useState, useEffect, useRef } from 'react';
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
  ShieldCheck,
  FileSpreadsheet,
  UploadCloud,
  Download,
  GraduationCap,
  Briefcase,
  Building2,
  BookOpen,
  Filter,
  Check
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { api } from '../services/api';
import { Recipient } from '../types';
import { useToast } from '../context/ToastContext';
import { 
  ALL_RECIPIENTS, 
  EEE_STUDENTS, 
  EEE_FACULTIES 
} from '../data/recipientsData';

export const ScheduleSessionPage: React.FC = () => {
  // Target Audience Mode: 'students' | 'faculties' | 'both'
  const [recipientMode, setRecipientMode] = useState<'students' | 'faculties' | 'both'>('both');

  // Master Roster (initialized from verified SRM EEE dataset + API)
  const [recipients, setRecipients] = useState<Recipient[]>(ALL_RECIPIENTS);
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [customEmails, setCustomEmails] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'students' | 'faculties' | 'selected'>('all');
  const [customEmailInput, setCustomEmailInput] = useState('');

  // Register Member Inline Form State
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [newMemberType, setNewMemberType] = useState<'student' | 'faculty'>('student');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberId, setNewMemberId] = useState('');
  const [newMemberCohort, setNewMemberCohort] = useState('I Year EEE-A');
  const [newMemberDesignation, setNewMemberDesignation] = useState('Assistant Professor');

  // Excel / CSV Upload State
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State (Blank by default - only filled when professor adds)
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [link, setLink] = useState('');
  const [platform, setPlatform] = useState('zoho');
  const [notes, setNotes] = useState('');

  // Restrict past dates & times
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const minTime = date === todayStr ? currentTimeStr : undefined;

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [sendRealEmail, setSendRealEmail] = useState(true);
  const [isDispatching, setIsDispatching] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  // Load any backend customized students or recipients
  useEffect(() => {
    async function load() {
      try {
        const data = await api.getStudents();
        if (data && data.length > 0) {
          setRecipients((prev) => {
            const existingEmails = new Set(prev.map((r) => r.email.toLowerCase()));
            const newOnes = data.filter((s) => !existingEmails.has(s.email.toLowerCase()));
            return [...prev, ...newOnes];
          });
        }
      } catch (e) {
        // Safe fallback
      }
    }
    load();
  }, []);

  // Toggle single recipient
  const toggleRecipient = (email: string) => {
    setSelectedEmails((prev) => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email);
      else next.add(email);
      return next;
    });
  };

  // Select all in current mode
  const handleSelectModeAll = () => {
    const subset =
      recipientMode === 'students'
        ? recipients.filter((r) => r.type === 'student')
        : recipientMode === 'faculties'
        ? recipients.filter((r) => r.type === 'faculty')
        : recipients;

    setSelectedEmails((prev) => {
      const next = new Set(prev);
      subset.forEach((r) => next.add(r.email));
      return next;
    });

    const label =
      recipientMode === 'students'
        ? 'All Students'
        : recipientMode === 'faculties'
        ? 'All Faculty & Scholars'
        : 'All Department Recipients';

    showToast(label, `Queued ${subset.length} candidates for dispatch`, 'info');
  };

  // Select only students
  const handleSelectAllStudents = () => {
    setSelectedEmails((prev) => {
      const next = new Set(prev);
      recipients.filter((r) => r.type === 'student').forEach((r) => next.add(r.email));
      return next;
    });
    const count = recipients.filter((r) => r.type === 'student').length;
    showToast('Students Selected', `Queued all ${count} student candidates`, 'info');
  };

  // Select only faculty
  const handleSelectAllFaculty = () => {
    setSelectedEmails((prev) => {
      const next = new Set(prev);
      recipients.filter((r) => r.type === 'faculty').forEach((r) => next.add(r.email));
      return next;
    });
    const count = recipients.filter((r) => r.type === 'faculty').length;
    showToast('Faculty Selected', `Queued all ${count} faculty members & scholars`, 'info');
  };

  // Select specific cohort / year / category
  const handleSelectCohort = (key: string) => {
    const matching = recipients.filter(
      (r) =>
        r.cohort === key ||
        r.year === key ||
        r.category === key ||
        r.section === key
    );
    if (matching.length === 0) {
      showToast('No Matches', `No records found matching ${key}`, 'info');
      return;
    }
    setSelectedEmails((prev) => {
      const next = new Set(prev);
      matching.forEach((r) => next.add(r.email));
      return next;
    });
    showToast(`Cohort Selected: ${key}`, `Queued ${matching.length} candidates`, 'info');
  };

  // Clear selections
  const handleClearAll = () => {
    setSelectedEmails(new Set());
    setCustomEmails(new Set());
    showToast('Cleared', 'All recipient queues cleared', 'info');
  };

  // Add custom individual email
  const handleAddCustomEmail = () => {
    const email = customEmailInput.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      showToast('Invalid Email', 'Please enter a valid email address', 'error');
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

  // Add member directly
  const handleRegisterMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newMemberName.trim();
    const email = newMemberEmail.trim().toLowerCase();
    if (!name || !email || !email.includes('@')) {
      showToast('Validation Error', 'Name and valid email are required', 'error');
      return;
    }

    const newRecord: Recipient = {
      id: `manual-${Date.now().toString(36)}`,
      name,
      email,
      regNo: newMemberType === 'student' ? newMemberId : undefined,
      idNo: newMemberType === 'faculty' ? newMemberId : undefined,
      type: newMemberType,
      category: newMemberType === 'faculty' ? 'Teaching Faculty' : undefined,
      designation: newMemberType === 'faculty' ? newMemberDesignation : undefined,
      cohort: newMemberType === 'student' ? newMemberCohort : 'Teaching Faculty',
      department: 'EEE'
    };

    setRecipients((prev) => [newRecord, ...prev]);
    setSelectedEmails((prev) => new Set(prev).add(email));

    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberId('');
    setShowAddMemberForm(false);
    showToast('Member Added', `${name} added to directory and queued`, 'success');
  };

  // Download Sample Template
  const handleDownloadSampleCsv = () => {
    const csvContent = `Name,Email,Register_or_ID,Role,Cohort_or_Designation
Dr. K. Vijayakumar,chair.soee.ktr.et@srmist.edu.in,100278,Faculty,Prof. & Chairperson/SOEE
Dr. R. Sridhar,hod.eee.ktr.et@srmist.edu.in,100293,Faculty,Professor & Head
MOHAMMAD KHAJA SAQIB AHAMED,ma6024@srmist.edu.in,RA2611005010001,Student,I Year EEE-A
HANSIKA DAS,hd6174@srmist.edu.in,RA2511005010068,Student,II Year EEE-B
SHRUTI SINGH,ss7759@srmist.edu.in,RA2411005010026,Student,III Year EEE-B`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'srm_eee_recipients_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Template Downloaded', 'Template CSV saved to downloads', 'info');
  };

  // Intelligent multi-sheet Excel / CSV processor
  const processFile = async (file: File) => {
    setIsUploading(true);
    showToast('Processing File', `Parsing records from ${file.name}...`, 'info');

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const newRecords: Recipient[] = [];

      for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (!rows || rows.length === 0) continue;

        let headerRow = -1;
        let regCol = -1;
        let nameCol = -1;
        let emailCol = -1;
        let desigCol = -1;

        for (let r = 0; r < Math.min(12, rows.length); r++) {
          const row = rows[r];
          if (!row || !Array.isArray(row)) continue;
          let curReg = -1;
          let curName = -1;
          let curEmail = -1;
          let curDesig = -1;

          for (let c = 0; c < row.length; c++) {
            const cell = String(row[c] || '').toLowerCase().trim();
            if (cell.includes('parent')) continue;

            if (cell.includes('reg') || cell.includes('registration') || cell.includes('id. no') || cell.includes('id no')) {
              curReg = c;
            } else if (cell === 'name' || cell.includes('student name') || cell.includes('faculty name') || cell.includes('candidate')) {
              curName = c;
            } else if (cell.includes('mail') || cell.includes('email') || cell.includes('e-mail')) {
              curEmail = c;
            } else if (cell.includes('designation') || cell.includes('category') || cell.includes('guide')) {
              curDesig = c;
            }
          }

          if (curName !== -1 && (curReg !== -1 || curEmail !== -1)) {
            headerRow = r;
            regCol = curReg;
            nameCol = curName;
            emailCol = curEmail;
            desigCol = curDesig;
            break;
          }
        }

        if (headerRow !== -1) {
          const isFacultySheet =
            sheetName.toLowerCase().includes('faculty') ||
            sheetName.toLowerCase().includes('tf') ||
            sheetName.toLowerCase().includes('rs') ||
            desigCol !== -1;

          for (let r = headerRow + 1; r < rows.length; r++) {
            const row = rows[r];
            if (!row || !Array.isArray(row)) continue;
            const name = nameCol !== -1 && row[nameCol] ? String(row[nameCol]).trim() : '';
            let email = emailCol !== -1 && row[emailCol] ? String(row[emailCol]).trim() : '';
            const idVal = regCol !== -1 && row[regCol] ? String(row[regCol]).trim() : '';
            const desigVal = desigCol !== -1 && row[desigCol] ? String(row[desigCol]).trim() : '';

            if (!name || name === 'null' || name.length < 2) continue;

            if (!email.includes('@')) {
              for (let c = 0; c < row.length; c++) {
                const val = String(row[c] || '').trim();
                if (val.includes('@srmist.edu.in') || (val.includes('@') && !val.includes('parent'))) {
                  email = val;
                  break;
                }
              }
            }

            if (!email && idVal) {
              email = `${idVal.toLowerCase()}@srmist.edu.in`;
            }

            if (name && email.includes('@')) {
              newRecords.push({
                id: `up-${Date.now().toString(36)}-${newRecords.length + 1}`,
                name,
                email: email.toLowerCase(),
                regNo: !isFacultySheet ? idVal : undefined,
                idNo: isFacultySheet ? idVal : undefined,
                type: isFacultySheet ? 'faculty' : 'student',
                category: isFacultySheet ? 'Teaching Faculty' : undefined,
                designation: desigVal || (isFacultySheet ? 'Faculty' : undefined),
                cohort: sheetName,
                department: 'EEE'
              });
            }
          }
        }
      }

      if (newRecords.length === 0) {
        showToast('No Records Found', 'Could not detect any valid rows with name and email', 'error');
        return;
      }

      setRecipients((prev) => {
        const existingEmails = new Set(prev.map((p) => p.email.toLowerCase()));
        const unique = newRecords.filter((n) => !existingEmails.has(n.email.toLowerCase()));
        return [...prev, ...unique];
      });

      setSelectedEmails((prev) => {
        const next = new Set(prev);
        newRecords.forEach((r) => next.add(r.email));
        return next;
      });

      setShowUploadPanel(false);
      showToast(
        'Import Successful',
        `Successfully imported & queued ${newRecords.length} records from ${file.name}`,
        'success',
        6000
      );
    } catch (err: any) {
      showToast('Parsing Error', err.message || 'Failed to read spreadsheet file', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    e.target.value = '';
  };

  const allRecipients = Array.from(new Set([...Array.from(selectedEmails), ...Array.from(customEmails)]));

  const totalStudentsSelected = Array.from(selectedEmails).filter((e) =>
    recipients.some((r) => r.email === e && r.type === 'student')
  ).length;

  const totalFacultySelected = Array.from(selectedEmails).filter((e) =>
    recipients.some((r) => r.email === e && r.type === 'faculty')
  ).length;

  const totalCustomSelected = customEmails.size;
  const totalSelectedCount = selectedEmails.size + totalCustomSelected;

  const handlePlatformChange = (pId: string) => {
    setPlatform(pId);
    if (pId === 'zoho') {
      if (!link || link.includes('google.com') || link.includes('teams.microsoft')) {
        setLink('https://meet.zoho.in/nvzd-cbn-fyn');
      }
    } else if (pId === 'meet') {
      if (!link || link.includes('zoho.in') || link.includes('teams.microsoft')) {
        setLink('https://meet.google.com/eng-krish-pract');
      }
    } else if (pId === 'teams') {
      if (!link || link.includes('zoho.in') || link.includes('google.com')) {
        setLink('https://teams.microsoft.com/l/meetup-join/academic-portal');
      }
    }
  };

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      showToast('Draft Requires Title', 'Please enter a preliminary session title', 'warning');
      return;
    }
    try {
      const cohortTag =
        recipientMode === 'students'
          ? 'Students Only'
          : recipientMode === 'faculties'
          ? 'Faculties Only'
          : 'Students & Faculties';

      await api.createSession({
        title,
        cohort: cohortTag,
        recipientGroup: cohortTag,
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
    if (date && date < todayStr) {
      showToast('Invalid Date', 'Session date cannot be in the past', 'warning');
      return;
    }
    if (date === todayStr && time && time < currentTimeStr) {
      showToast('Invalid Time', 'Session time cannot be in the past for today', 'warning');
      return;
    }
    if (allRecipients.length === 0) {
      showToast('No Recipients', 'Please select at least one student or faculty recipient', 'warning');
      return;
    }

    setIsDispatching(true);
    try {
      const cohortTag =
        recipientMode === 'students'
          ? 'Students Only'
          : recipientMode === 'faculties'
          ? 'Faculties Only'
          : 'Students & Faculties';

      const res = await api.createSession({
        title,
        cohort: cohortTag,
        recipientGroup: cohortTag,
        date: date || 'Scheduled Date',
        time: time || 'Scheduled Time',
        link: link || 'https://meet.zoho.in/nvzd-cbn-fyn',
        notes,
        status: 'upcoming',
        sendMail: sendRealEmail,
        selectedRecipients: allRecipients,
        recipientCount: allRecipients.length
      });

      setModalOpen(false);
      if (res.dispatchResult && res.dispatchResult.success) {
        showToast(
          'Dispatches Delivered',
          `Sent to ${res.dispatchResult.deliveredCount} recipient(s) via SMTP Relay!`,
          'success',
          5000
        );
      } else {
        showToast('Session Scheduled', `${allRecipients.length} recipient(s) enrolled`, 'success');
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

  // Filtered recipients list based on mode, sub-tab, and search
  const filteredRecipients = recipients.filter((r) => {
    // Mode constraint
    if (recipientMode === 'students' && r.type !== 'student') return false;
    if (recipientMode === 'faculties' && r.type !== 'faculty') return false;

    // Sub-tab constraint
    if (activeTab === 'students' && r.type !== 'student') return false;
    if (activeTab === 'faculties' && r.type !== 'faculty') return false;
    if (activeTab === 'selected' && !selectedEmails.has(r.email)) return false;

    // Search query constraint
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      r.name.toLowerCase().includes(q) ||
      (r.regNo && r.regNo.toLowerCase().includes(q)) ||
      (r.idNo && r.idNo.toLowerCase().includes(q)) ||
      r.email.toLowerCase().includes(q) ||
      (r.cohort && r.cohort.toLowerCase().includes(q)) ||
      (r.designation && r.designation.toLowerCase().includes(q)) ||
      (r.category && r.category.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Page Title & Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-3">
        <div>
          <div className="text-xs text-stone-500 font-mono tracking-wider uppercase mb-1">
            Department of Electrical & Electronics Engineering
          </div>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight">
            Schedule Academic Session & Advisory Dispatch
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Configure seminar timetable, notes, and send verified dispatches to <strong>Students</strong>, <strong>Faculties</strong>, or <strong>Both</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-medium rounded transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded transition-colors"
          >
            Save Draft
          </button>
        </div>
      </div>

      {/* Main Grid: Form (7 cols) vs Live Dispatch Preview (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Form: Steps 1, 2, 3 */}
        <div className="lg:col-span-7 space-y-6">

          {/* Section 1: Timetable & Teleconference */}
          <section className="bg-white border border-[#e6e2da] rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="text-sm font-semibold text-stone-900">1. Timetable & Teleconference Coordinates</h2>
              <span className="text-xs text-stone-400">Step 1 of 3</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1" htmlFor="sessionTitle">
                  Session Title / Advisory Subject
                </label>
                <input
                  id="sessionTitle"
                  type="text"
                  placeholder="e.g., EEE Capstone Design Review & Practical Guidance"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-9 px-3 bg-white text-stone-900 border border-stone-200 rounded text-xs focus:outline-none focus:border-stone-400 placeholder:text-stone-400"
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
                      type="date"
                      min={todayStr}
                      value={date}
                      onClick={(e) => e.currentTarget.showPicker?.()}
                      onChange={(e) => {
                        const newDate = e.target.value;
                        setDate(newDate);
                        if (newDate === todayStr && time && time < currentTimeStr) {
                          setTime('');
                          showToast('Time Reset', 'Please select a future time slot for today', 'info');
                        }
                      }}
                      className="w-full h-9 pl-8 pr-3 bg-white text-stone-900 border border-stone-200 rounded text-xs focus:outline-none focus:border-stone-400"
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
                      type="time"
                      min={minTime}
                      value={time}
                      onClick={(e) => e.currentTarget.showPicker?.()}
                      onChange={(e) => {
                        const newTime = e.target.value;
                        if (date === todayStr && newTime < currentTimeStr) {
                          showToast('Past Time', 'Please select a future time slot for today', 'warning');
                          return;
                        }
                        setTime(newTime);
                      }}
                      className="w-full h-9 pl-8 pr-3 bg-white text-stone-900 border border-stone-200 rounded text-xs focus:outline-none focus:border-stone-400"
                    />
                    <Clock className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-stone-700" htmlFor="meetingLink">
                    Teleconference URL (Zoho Meeting)
                  </label>
                  <span className="text-[11px] text-stone-500 font-mono">
                    {platform === 'zoho' ? 'Zoho Meeting' : platform === 'meet' ? 'Google Meet' : 'MS Teams'}
                  </span>
                </div>
                <input
                  id="meetingLink"
                  type="text"
                  placeholder="e.g., https://meet.zoho.in/nvzd-cbn-fyn"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full h-9 px-3 bg-white text-stone-900 border border-stone-200 rounded text-xs focus:outline-none focus:border-stone-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1.5">Platform Preset</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'zoho', label: 'Zoho Meeting (Default)', badge: 'meet.zoho.in' },
                    { id: 'meet', label: 'Google Meet', badge: 'meet.google.com' },
                    { id: 'teams', label: 'MS Teams', badge: 'teams.microsoft' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handlePlatformChange(p.id)}
                      className={`h-8 px-2.5 rounded text-xs font-medium transition-colors border flex items-center justify-between ${
                        platform === p.id
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Syllabus Notes (Optional) */}
          <section className="bg-white border border-[#e6e2da] rounded-lg p-6">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-stone-900">2. Syllabus Brief & Preparation Notes</h2>
                <span className="text-[10px] font-medium uppercase tracking-wider text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                  Optional
                </span>
              </div>
              <span className="text-xs text-stone-400">Step 2 of 3</span>
            </div>

            <textarea
              rows={4}
              placeholder="(Optional) Enter session agenda, preparation directives, reading materials, or prerequisites..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 bg-white text-stone-900 border border-stone-200 rounded text-xs leading-relaxed focus:outline-none focus:border-stone-400 placeholder:text-stone-400"
            />
          </section>

          {/* Section 3: Target Audience & Recipient Cohort Dispatch */}
          <section className="bg-white border border-[#e6e2da] rounded-lg p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-stone-900">3. Target Recipient Selection & Delivery</h2>
                <span className="text-[11px] font-mono bg-stone-100 text-stone-800 px-2 py-0.5 rounded border border-stone-200">
                  {totalSelectedCount} Queued
                  {totalSelectedCount > 0 && ` (${totalStudentsSelected} Students · ${totalFacultySelected} Faculty${totalCustomSelected > 0 ? ` · ${totalCustomSelected} Custom` : ''})`}
                </span>
              </div>
              <span className="text-xs text-stone-400">Step 3 of 3</span>
            </div>

            {/* Target Audience Mode: Students Only | Faculties Only | Both */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                Who should receive this session notice?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                
                {/* Mode 1: Students Only */}
                <button
                  type="button"
                  onClick={() => setRecipientMode('students')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    recipientMode === 'students'
                      ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className={`w-4 h-4 ${recipientMode === 'students' ? 'text-blue-600' : 'text-stone-500'}`} />
                      <span className="text-xs font-semibold text-stone-900">Students Only</span>
                    </div>
                    {recipientMode === 'students' && (
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500">
                    500 EEE students across I, II, III & IV Years
                  </p>
                </button>

                {/* Mode 2: Faculties Only */}
                <button
                  type="button"
                  onClick={() => setRecipientMode('faculties')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    recipientMode === 'faculties'
                      ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Briefcase className={`w-4 h-4 ${recipientMode === 'faculties' ? 'text-emerald-700' : 'text-stone-500'}`} />
                      <span className="text-xs font-semibold text-stone-900">Faculties Only</span>
                    </div>
                    {recipientMode === 'faculties' && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500">
                    223 Faculty members, staff & research scholars
                  </p>
                </button>

                {/* Mode 3: Both Students & Faculties */}
                <button
                  type="button"
                  onClick={() => setRecipientMode('both')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    recipientMode === 'both'
                      ? 'border-purple-600 bg-purple-50/70 ring-1 ring-purple-600'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Users className={`w-4 h-4 ${recipientMode === 'both' ? 'text-purple-600' : 'text-stone-500'}`} />
                      <span className="text-xs font-semibold text-stone-900">Send to Both</span>
                    </div>
                    {recipientMode === 'both' && (
                      <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Full department convocation (723 total)
                  </p>
                </button>

              </div>
            </div>

            {/* Quick Cohort Selectors & Actions */}
            <div className="bg-[#faf9f6] border border-stone-200 rounded-lg p-3.5 space-y-3">
              
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[11px] font-semibold text-stone-700 uppercase tracking-wider">
                  Quick Cohort Selection:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSelectModeAll}
                    className="px-2.5 py-1 bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 rounded text-[11px] font-medium"
                  >
                    Select All in Mode
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    disabled={totalSelectedCount === 0}
                    className="px-2.5 py-1 bg-white hover:bg-stone-100 disabled:opacity-40 text-stone-800 border border-stone-200 rounded text-[11px]"
                  >
                    Clear All
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadPanel(!showUploadPanel);
                      if (showAddMemberForm) setShowAddMemberForm(false);
                    }}
                    className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded text-[11px] font-medium flex items-center gap-1.5 shadow-sm"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" /> Upload Excel / CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddMemberForm(!showAddMemberForm);
                      if (showUploadPanel) setShowUploadPanel(false);
                    }}
                    className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 rounded text-[11px] font-medium flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Member
                  </button>
                </div>
              </div>

              {/* Dynamic Buttons depending on Mode */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                
                {/* If Students or Both: Show Year and Section pills */}
                {(recipientMode === 'students' || recipientMode === 'both') && (
                  <>
                    <button
                      type="button"
                      onClick={handleSelectAllStudents}
                      className="px-2 py-0.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded text-[11px] font-medium"
                    >
                      All Students (500)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectCohort('I Year')}
                      className="px-2 py-0.5 bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 rounded text-[11px]"
                    >
                      I Year (210)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectCohort('II Year')}
                      className="px-2 py-0.5 bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 rounded text-[11px]"
                    >
                      II Year (63)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectCohort('III Year')}
                      className="px-2 py-0.5 bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 rounded text-[11px]"
                    >
                      III Year (127)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectCohort('IV Year')}
                      className="px-2 py-0.5 bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 rounded text-[11px]"
                    >
                      IV Year (100)
                    </button>
                  </>
                )}

                {/* If Faculties or Both: Show Faculty Tier pills */}
                {(recipientMode === 'faculties' || recipientMode === 'both') && (
                  <>
                    <button
                      type="button"
                      onClick={handleSelectAllFaculty}
                      className="px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded text-[11px] font-medium"
                    >
                      All Faculty & Scholars (223)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectCohort('Teaching Faculty')}
                      className="px-2 py-0.5 bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 rounded text-[11px]"
                    >
                      Teaching Faculty (54)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectCohort('Non-Teaching Staff')}
                      className="px-2 py-0.5 bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 rounded text-[11px]"
                    >
                      Non-Teaching Staff (19)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectCohort('Research Scholar')}
                      className="px-2 py-0.5 bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 rounded text-[11px]"
                    >
                      Research Scholars (150)
                    </button>
                  </>
                )}

              </div>

              {/* Sub-sections pills (EEE-A, EEE-B, etc.) for granular student selection */}
              {(recipientMode === 'students' || recipientMode === 'both') && (
                <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-stone-200/60 text-[10px]">
                  <span className="text-stone-400 mr-1">Sections:</span>
                  {[
                    'I Year EEE-A', 'I Year EEE-B', 'I Year EEE-C', 'I Year EEE-D',
                    'II Year EEE-B', 'III Year EEE-A', 'III Year EEE-B',
                    'IV Year EEE-A', 'IV Year EEE-B'
                  ].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => handleSelectCohort(sec)}
                      className="px-1.5 py-0.5 bg-white hover:bg-stone-100 border border-stone-200 text-stone-600 rounded text-[10px]"
                    >
                      {sec}
                    </button>
                  ))}
                </div>
              )}

            </div>

            {/* Bulk Excel / CSV Upload Panel */}
            {showUploadPanel && (
              <div className="p-4 bg-white border border-stone-300 rounded-md space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-semibold text-stone-900">
                      Upload Department Excel File (.xlsx, .xls, .csv)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleDownloadSampleCsv}
                      className="text-[11px] text-stone-600 hover:text-stone-900 flex items-center gap-1 underline font-medium"
                    >
                      <Download className="w-3 h-3 text-stone-500" /> Sample Format
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowUploadPanel(false)}
                      className="text-stone-400 hover:text-stone-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    const droppedFile = e.dataTransfer.files?.[0];
                    if (droppedFile) processFile(droppedFile);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    dragActive
                      ? 'border-emerald-600 bg-emerald-50/50'
                      : 'border-stone-300 hover:border-stone-400 bg-stone-50/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv, .xlsx, .xls"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-2 text-emerald-700">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-semibold text-stone-800">
                    {isUploading ? 'Parsing Department Records...' : 'Click to Browse or Drag & Drop Excel File'}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1 max-w-sm mx-auto">
                    Supports <strong>.xlsx</strong>, <strong>.xls</strong>, or <strong>.csv</strong> files. Handles all student namelists and faculty registers automatically.
                  </p>
                </div>
              </div>
            )}

            {/* Inline Add Member Form */}
            {showAddMemberForm && (
              <form onSubmit={handleRegisterMember} className="p-4 bg-white border border-stone-300 rounded-md space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="text-xs font-semibold text-stone-900">Add Member to Institutional Directory</span>
                  <button
                    type="button"
                    onClick={() => setShowAddMemberForm(false)}
                    className="text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-4 text-xs font-medium">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="mType"
                      checked={newMemberType === 'student'}
                      onChange={() => setNewMemberType('student')}
                    />
                    <span>Student</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="mType"
                      checked={newMemberType === 'faculty'}
                      onChange={() => setNewMemberType('faculty')}
                    />
                    <span>Faculty Member</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Dr. R. Sridhar or Student Name"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      className="w-full h-8 px-2.5 text-xs border border-stone-200 rounded bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">Official Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g., faculty@srmist.edu.in"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      className="w-full h-8 px-2.5 text-xs border border-stone-200 rounded bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      {newMemberType === 'student' ? 'Register Number' : 'Employee ID'}
                    </label>
                    <input
                      type="text"
                      placeholder={newMemberType === 'student' ? 'e.g., RA2611005010001' : 'e.g., 100293'}
                      value={newMemberId}
                      onChange={(e) => setNewMemberId(e.target.value)}
                      className="w-full h-8 px-2.5 text-xs border border-stone-200 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      {newMemberType === 'student' ? 'Cohort / Section' : 'Designation'}
                    </label>
                    {newMemberType === 'student' ? (
                      <input
                        type="text"
                        placeholder="e.g., I Year EEE-A"
                        value={newMemberCohort}
                        onChange={(e) => setNewMemberCohort(e.target.value)}
                        className="w-full h-8 px-2.5 text-xs border border-stone-200 rounded bg-white"
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder="e.g., Professor & Head"
                        value={newMemberDesignation}
                        onChange={(e) => setNewMemberDesignation(e.target.value)}
                        className="w-full h-8 px-2.5 text-xs border border-stone-200 rounded bg-white"
                      />
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddMemberForm(false)}
                    className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded transition-colors"
                  >
                    Save & Queue
                  </button>
                </div>
              </form>
            )}

            {/* Roster Table Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              
              {/* Tabs: All / Students / Faculty / Selected */}
              <div className="flex items-center gap-1 text-xs border border-stone-200 rounded-md p-0.5 bg-stone-100">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                    activeTab === 'all' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  All ({recipients.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('students')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                    activeTab === 'students' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Students ({recipients.filter((r) => r.type === 'student').length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('faculties')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                    activeTab === 'faculties' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Faculty & Scholars ({recipients.filter((r) => r.type === 'faculty').length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('selected')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                    activeTab === 'selected' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Queued ({selectedEmails.size})
                </button>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search name, ID, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 bg-white text-stone-900 border border-stone-200 rounded text-xs focus:outline-none focus:border-stone-400"
                />
              </div>

            </div>

            {/* Recipient Roster List */}
            <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1 divide-y divide-stone-100 border border-stone-200 rounded-lg p-2 bg-[#faf9f6]">
              {filteredRecipients.length === 0 ? (
                <div className="text-center py-6 text-xs text-stone-400">
                  No members matched the filter or search criteria.
                </div>
              ) : (
                filteredRecipients.map((r) => {
                  const isChecked = selectedEmails.has(r.email);
                  const isStudent = r.type === 'student';
                  return (
                    <label
                      key={r.id}
                      className={`flex items-center justify-between p-2 rounded hover:bg-white cursor-pointer transition-colors ${
                        isChecked ? 'bg-white border border-stone-300 shadow-xs' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleRecipient(r.email)}
                          className="rounded text-stone-900 border-stone-300 focus:ring-0"
                        />
                        <div className="truncate">
                          <div className="text-xs font-medium text-stone-900 flex items-center gap-1.5">
                            <span className="truncate">{r.name}</span>
                            {r.designation && (
                              <span className="text-[10px] text-stone-500 font-normal truncate">
                                · {r.designation}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-stone-500 font-mono truncate">
                            {r.regNo || r.idNo ? `${r.regNo || r.idNo} · ` : ''}{r.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 pl-2">
                        {isStudent ? (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                            {r.cohort || 'Student'}
                          </span>
                        ) : (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ${
                            r.category === 'Teaching Faculty'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : r.category === 'Non-Teaching Staff'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-purple-50 text-purple-800 border-purple-200'
                          }`}>
                            {r.category || 'Faculty'}
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })
              )}
            </div>

            {/* Custom Recipient Box */}
            <div className="pt-2 border-t border-stone-100">
              <label className="block text-xs font-medium text-stone-700 mb-1" htmlFor="customEmail">
                Add External Recipient Email Address:
              </label>
              <div className="flex gap-2">
                <input
                  id="customEmail"
                  type="email"
                  placeholder="e.g., observer@gmail.com"
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

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-4">
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
                  if (date && date < todayStr) {
                    showToast('Invalid Date', 'Session date cannot be in the past', 'warning');
                    return;
                  }
                  if (date === todayStr && time && time < currentTimeStr) {
                    showToast('Invalid Time', 'Session time cannot be in the past for today', 'warning');
                    return;
                  }
                  if (allRecipients.length === 0) {
                    showToast('No Recipients', 'Please select at least one student or faculty recipient', 'warning');
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

        {/* Right Preview Column: Live Dispatched Preview */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-4">
          <div className="bg-[#fcfbf9] border border-[#e6e2da] rounded-lg p-5 shadow-xs space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <span className="text-xs font-semibold text-stone-900">Pre-Flight Dispatch Preview</span>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Verified SMTP Relay
              </span>
            </div>

            {/* Preview Card */}
            <div className="space-y-3 bg-white p-4 rounded-md border border-stone-200 shadow-2xs">
              <div className="flex items-center gap-2.5 pb-2 border-b border-stone-100">
                <img
                  src="/professor_krishnavel.jpg"
                  alt="Prof. of Practice Engr. Krishnavel"
                  className="w-9 h-9 rounded-full object-cover border border-stone-200"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div>
                  <div className="font-medium text-stone-900 text-xs">Prof. of Practice Engr. Krishnavel</div>
                  <div className="text-[11px] text-stone-500">From: <code>srmeeelibraray@gmail.com</code></div>
                </div>
              </div>

              {/* Target Mode & Count Badge */}
              <div className="flex items-center justify-between text-[11px] bg-stone-50 p-2 rounded border border-stone-200">
                <span className="text-stone-500 font-medium">Target Audience:</span>
                <span className="font-semibold text-stone-900">
                  {recipientMode === 'students' ? '🎓 Students Only' : recipientMode === 'faculties' ? '👨‍🏫 Faculties Only' : '👥 Students & Faculties'}
                </span>
              </div>

              {/* Recipient summary */}
              <div className="text-[11px] text-stone-600 bg-stone-50 p-2 rounded border border-stone-200 font-mono">
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

              <div className="p-3 bg-stone-50/50 border border-stone-200 rounded text-stone-700 whitespace-pre-wrap leading-relaxed text-[11px] min-h-[50px]">
                {notes || <span className="text-stone-400 italic">No syllabus directives entered yet.</span>}
              </div>

              <div className="pt-1">
                <a
                  href={link.startsWith('http') ? link : (link ? `https://${link}` : 'https://meet.zoho.in/nvzd-cbn-fyn')}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full py-2 bg-stone-900 hover:bg-stone-800 text-white text-center rounded text-xs font-medium transition-colors"
                >
                  Join Teleconference ({link.includes('zoho') || platform === 'zoho' ? 'Zoho Meeting' : platform === 'meet' ? 'Google Meet' : 'MS Teams'})
                </a>
              </div>
            </div>

            <div className="text-[11px] text-stone-500 text-center flex items-center justify-center gap-1.5 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sends verified email with calendar (.ics) invite attached</span>
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
                <span className="text-stone-500">Audience Mode:</span>
                <span className="font-medium text-stone-900">
                  {recipientMode === 'students' ? 'Students Only' : recipientMode === 'faculties' ? 'Faculties Only' : 'Both (Students & Faculties)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Target Recipients:</span>
                <span className="font-semibold text-stone-900">
                  {allRecipients.length} addresses queued
                  {allRecipients.length > 0 && ` (${totalStudentsSelected} Students · ${totalFacultySelected} Faculty${totalCustomSelected > 0 ? ` · ${totalCustomSelected} Custom` : ''})`}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-200">
                <div className="max-h-28 overflow-y-auto bg-white p-2 rounded border border-stone-200 font-mono text-[11px] text-stone-700 divide-y divide-stone-100">
                  {allRecipients.map((r) => (
                    <div key={r} className="py-0.5 truncate">{r}</div>
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
                Dispatch real email notifications via authenticated SMTP immediately
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
                <span>{isDispatching ? 'Dispatching via SMTP Relay...' : 'Confirm & Dispatch via SMTP'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
