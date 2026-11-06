import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Bell, LogOut, CheckCircle2, Calendar, FileText } from 'lucide-react';

export const Header: React.FC = () => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1.5 rounded text-sm transition-colors ${
      isActive
        ? 'font-medium bg-stone-100 text-stone-900 border border-stone-200'
        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-white border-b border-[#e6e2da]">
      <div className="h-16 max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img
              alt="Prof. Krishnavel"
              className="w-9 h-9 rounded-full object-cover border border-stone-200 shadow-sm"
              src="/professor_krishnavel.jpg"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[#1c1917] leading-tight">
                Prof. Krishnavel · Academic Portal
              </span>
              <span className="text-[11px] text-[#78716c]">
                Department of Electrical & Electronics Engineering
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 ml-4">
            <NavLink to="/dashboard" className={navItemClass}>
              Dashboard
            </NavLink>
            <NavLink to="/schedule-session" className={navItemClass}>
              Schedule Session
            </NavLink>
            <NavLink to="/session-archive" className={navItemClass}>
              Session Archive
            </NavLink>
            <NavLink to="/email-templates" className={navItemClass}>
              Email Templates
            </NavLink>
            <NavLink to="/email-preview" className={navItemClass}>
              Pre-Flight Preview
            </NavLink>
          </nav>
        </div>

        {/* Right Section: Notifications + Profile + Sign Out */}
        <div className="flex items-center gap-3">
          
          {/* Notification Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-[#e6e2da] rounded-lg shadow-lg overflow-hidden z-50 text-xs">
                <div className="p-3 border-b border-stone-100 bg-stone-50 flex items-center justify-between">
                  <span className="font-semibold text-stone-900">Institutional Alerts</span>
                  <span className="text-[11px] text-stone-500 font-mono">3 unread</span>
                </div>
                <div className="divide-y divide-stone-100 max-h-64 overflow-y-auto">
                  <div
                    onClick={() => {
                      setNotificationsOpen(false);
                      navigate('/email-templates');
                    }}
                    className="p-3 hover:bg-stone-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between text-[11px] text-stone-500 mb-0.5">
                      <span className="font-medium text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Dispatch Verified
                      </span>
                      <span className="font-mono">10m ago</span>
                    </div>
                    <p className="text-xs text-stone-700">Seminar IV Robotics notice verified for Google SMTP relay.</p>
                  </div>
                  <div
                    onClick={() => {
                      setNotificationsOpen(false);
                      navigate('/session-archive');
                    }}
                    className="p-3 hover:bg-stone-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between text-[11px] text-stone-500 mb-0.5">
                      <span className="font-medium text-stone-800 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Roster Synchronized
                      </span>
                      <span className="font-mono">1h ago</span>
                    </div>
                    <p className="text-xs text-stone-700">SRM EEE student directory updated with Capstone Groups.</p>
                  </div>
                  <div
                    onClick={() => {
                      setNotificationsOpen(false);
                      navigate('/schedule-session');
                    }}
                    className="p-3 hover:bg-stone-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between text-[11px] text-stone-500 mb-0.5">
                      <span className="font-medium text-stone-800 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Senate Advising
                      </span>
                      <span className="font-mono">3h ago</span>
                    </div>
                    <p className="text-xs text-stone-700">Department technical symposium timetable approved.</p>
                  </div>
                </div>
                <div className="p-2 border-t border-stone-100 bg-stone-50 text-center">
                  <Link
                    to="/session-archive"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-stone-700 hover:text-stone-900 font-medium text-[11px]"
                  >
                    View All Activity Logs &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="h-5 w-[1px] bg-stone-200"></div>

          {/* Profile Identity */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-xs font-semibold text-stone-900 leading-tight">Prof. Krishnavel</span>
              <span className="text-[11px] text-stone-500">Senior Faculty Advisor</span>
            </div>
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border border-stone-200"
              src="/professor_krishnavel.jpg"
            />
            <Link
              to="/login"
              className="p-1.5 text-stone-500 hover:text-stone-900 rounded transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>
    </header>
  );
};
