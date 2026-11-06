import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  ExternalLink, 
  Trash2, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Filter
} from 'lucide-react';
import { api } from '../services/api';
import { Session } from '../types';
import { useToast } from '../context/ToastContext';

export const SessionArchivePage: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'completed' | 'drafts'>('all');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getSessions();
        setSessions(data);
      } catch (err) {
        showToast('Offline Mode', 'Showing local session ledger', 'info');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [showToast]);

  const handleDelete = async (id: string) => {
    if (!confirm(`Archive and remove session ${id}?`)) return;
    try {
      await api.deleteSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      showToast('Record Archived', `Session ${id} removed from register`, 'success');
    } catch (e: any) {
      showToast('Error', e.message, 'error');
    }
  };

  const handleExportCSV = () => {
    let csv = 'Session ID,Title,Cohort,Date,Time,Status,Recipients\n';
    sessions.forEach((s) => {
      csv += `"${s.id}","${s.title.replace(/"/g, '""')}","${s.cohort}","${s.date}","${s.time}","${s.status}","${s.recipientCount || 1}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `srm_eee_sessions_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Export Completed', 'Downloaded session archive CSV ledger', 'success');
  };

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.cohort.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.notes && s.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
        <div>
          <div className="text-xs text-stone-500 font-medium mb-1">Faculty Records · AY 2024–25</div>
          <h1 className="font-serif text-2xl font-normal text-stone-900">Session Archive & Records</h1>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl">
            Directory of scheduled convocations, completed research reviews, and working drafts distributed to SRM EEE students.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-stone-600">
          <span className="tabular-nums font-semibold text-stone-900">{sessions.length}</span> total sessions recorded
        </div>
      </div>

      {/* Controls Hub */}
      <div className="bg-white border border-[#e6e2da] rounded-lg p-4 mb-6 space-y-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, cohort, or syllabus topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-400"
            />
          </div>

          {/* Filters & Export */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-stone-50 border border-stone-200 p-1 rounded text-xs">
              <Filter className="w-3 h-3 text-stone-400 ml-1" />
              {(['all', 'upcoming', 'completed', 'drafts'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-medium capitalize transition-colors ${
                    statusFilter === st
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <button
              onClick={handleExportCSV}
              className="h-8 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>

        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white border border-[#e6e2da] rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-medium">
                <th className="p-3.5 pl-4">Session Details</th>
                <th className="p-3.5">Schedule (IST)</th>
                <th className="p-3.5">Platform & Coordinates</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Recipients</th>
                <th className="p-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-stone-400">
                    Loading session archive records...
                  </td>
                </tr>
              ) : sessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-2 text-stone-400">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-semibold text-stone-800">Session Archive is Clean</p>
                    <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                      No academic convocations or advisory meetings recorded yet. When Prof. Krishnavel schedules a session, it will be catalogued here.
                    </p>
                  </td>
                </tr>
              ) : filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-400">
                    No sessions matched the search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="p-3.5 pl-4">
                      <div className="text-[10px] font-mono text-stone-400">{session.id}</div>
                      <div className="font-semibold text-stone-900 mt-0.5">{session.title}</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">{session.cohort}</div>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="text-stone-800 font-medium">{session.date}</div>
                      <div className="text-[11px] text-stone-500">{session.time}</div>
                    </td>
                    <td className="p-3.5">
                      <a
                        href={session.link.startsWith('http') ? session.link : '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-700 hover:underline font-mono text-[11px] inline-flex items-center gap-1"
                      >
                        {session.link.length > 32 ? `${session.link.substring(0, 32)}...` : session.link}
                        <ExternalLink className="w-3 h-3 text-stone-400" />
                      </a>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium uppercase ${
                          session.status === 'upcoming'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : session.status === 'completed'
                            ? 'bg-stone-100 text-stone-700'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {session.status}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono text-stone-700">
                        {session.recipientCount || 1} candidates
                      </span>
                    </td>
                    <td className="p-3.5 pr-4 text-right">
                      <button
                        onClick={() => handleDelete(session.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-700 rounded transition-colors"
                        title="Delete Session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
