/**
 * Academic Session & Advisory Portal - Unslopped Navigation & Core Logic
 */

(function () {
  function initToastContainer() {
    if (!document.getElementById('portal-toast-container')) {
      const container = document.createElement('div');
      container.id = 'portal-toast-container';
      document.body.appendChild(container);
    }
  }

  window.showPortalToast = function (title, message, type = 'info', duration = 3000) {
    initToastContainer();
    const container = document.getElementById('portal-toast-container');
    const toast = document.createElement('div');
    toast.className = `portal-toast ${type}`;

    let iconName = 'info';
    if (type === 'success') iconName = 'check_circle';
    if (type === 'error') iconName = 'error';
    if (type === 'warning') iconName = 'warning';

    toast.innerHTML = `
      <span class="material-symbols-outlined portal-toast-icon">${iconName}</span>
      <div class="portal-toast-content">
        <div class="portal-toast-title">${escapeHtml(title)}</div>
        ${message ? `<div class="portal-toast-message">${escapeHtml(message)}</div>` : ''}
      </div>
      <button class="portal-toast-close" aria-label="Close notification">
        <span class="material-symbols-outlined" style="font-size: 16px;">close</span>
      </button>
    `;

    const closeBtn = toast.querySelector('.portal-toast-close');
    closeBtn.addEventListener('click', () => dismissToast(toast));

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    const timer = setTimeout(() => dismissToast(toast), duration);

    function dismissToast(el) {
      clearTimeout(timer);
      el.classList.remove('show');
      el.classList.add('hide');
      setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 180);
    }
  };

  window.triggerToast = function (msg, type = 'info') {
    window.showPortalToast('Notice', msg, type);
  };
  window.showToast = function (title, message) {
    window.showPortalToast(title, message, 'success');
  };

  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  const ROUTE_MAP = {
    'dashboard-overview': '/dashboard',
    'schedule-session': '/schedule-session',
    'session-archive-history': '/session-archive-history',
    'email-dispatches-templates': '/student-faculty-email-template',
    'login': '/login',
    'email-preview': '/email-preview-confirmation-dialog'
  };

  function syncNavigation() {
    const currentPath = window.location.pathname.toLowerCase();

    // Brand click to dashboard
    const brandContainer = document.querySelector('header .portal-brand') || document.querySelector('header .flex.items-center.gap-space-md');
    if (brandContainer && !brandContainer.closest('a')) {
      brandContainer.style.cursor = 'pointer';
      brandContainer.addEventListener('click', () => {
        window.location.href = '/dashboard';
      });
    }

    // Nav links
    const navLinks = document.querySelectorAll('nav a[data-path]');
    navLinks.forEach((link) => {
      const pathKey = link.getAttribute('data-path');
      const targetUrl = ROUTE_MAP[pathKey] || '#';
      link.setAttribute('href', targetUrl);

      let isActive = false;
      if (pathKey === 'dashboard-overview' && (currentPath === '/' || currentPath.includes('dashboard'))) {
        isActive = true;
      } else if (pathKey === 'schedule-session' && (currentPath.includes('schedule') || currentPath.includes('create'))) {
        isActive = true;
      } else if (pathKey === 'session-archive-history' && (currentPath.includes('archive') || currentPath.includes('history'))) {
        isActive = true;
      } else if (pathKey === 'email-dispatches-templates' && (currentPath.includes('email') || currentPath.includes('template'))) {
        isActive = true;
      }

      if (isActive) {
        link.className = 'px-3 py-1.5 rounded text-sm font-medium bg-stone-100 text-stone-900 border border-stone-200 transition-colors';
        link.setAttribute('aria-current', 'page');
      } else {
        link.className = 'px-3 py-1.5 rounded text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors';
        link.removeAttribute('aria-current');
      }
    });

    // Logout button
    const logoutBtn = document.querySelector('header a[data-path="login"]');
    if (logoutBtn) {
      logoutBtn.setAttribute('href', '/login');
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('academic_portal_authenticated');
        window.showPortalToast('Session Ended', 'Faculty sign-out completed.', 'info');
        setTimeout(() => {
          window.location.href = '/login';
        }, 300);
      });
    }

    // Mobile drawer and notifications
    injectMobileMenu();
    injectNotificationsDropdown();
  }

  function injectMobileMenu() {
    const headerNavContainer = document.querySelector('header .max-w-7xl') || document.querySelector('header > div');
    if (!headerNavContainer || document.getElementById('mobile-menu-toggle')) return;

    const menuBtn = document.createElement('button');
    menuBtn.id = 'mobile-menu-toggle';
    menuBtn.className = 'xl:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors mr-2';
    menuBtn.setAttribute('aria-label', 'Open navigation menu');
    menuBtn.innerHTML = '<span class="material-symbols-outlined text-[20px]">menu</span>';

    const brand = headerNavContainer.querySelector('.flex.items-center.gap-space-lg') || headerNavContainer.firstElementChild;
    if (brand) {
      brand.insertBefore(menuBtn, brand.firstChild);
    }

    const backdrop = document.createElement('div');
    backdrop.id = 'mobile-nav-backdrop';
    document.body.appendChild(backdrop);

    const drawer = document.createElement('div');
    drawer.id = 'mobile-nav-drawer';
    drawer.innerHTML = `
      <div class="p-4 border-b border-stone-200 flex items-center justify-between bg-white">
        <div>
          <div class="text-sm font-semibold text-stone-900">Academic Advisory Portal</div>
          <div class="text-xs text-stone-500">Department of Engineering</div>
        </div>
        <button id="close-mobile-nav" class="p-1 text-stone-500 hover:text-stone-900 rounded">
          <span class="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
      <div class="flex flex-col p-3 gap-1 flex-1 overflow-y-auto">
        <a class="px-3 py-2 rounded text-sm text-stone-700 hover:bg-stone-100" href="/dashboard">Dashboard</a>
        <a class="px-3 py-2 rounded text-sm text-stone-700 hover:bg-stone-100" href="/schedule-session">Schedule Session</a>
        <a class="px-3 py-2 rounded text-sm text-stone-700 hover:bg-stone-100" href="/session-archive-history">Session Archive</a>
        <a class="px-3 py-2 rounded text-sm text-stone-700 hover:bg-stone-100" href="/student-faculty-email-template">Email Templates</a>
        <a class="px-3 py-2 rounded text-sm text-stone-700 hover:bg-stone-100" href="/email-preview-confirmation-dialog">Email Preview</a>
      </div>
      <div class="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs">
        <span class="text-stone-600 font-medium">Prof. Krishnavel</span>
        <a href="/login" class="text-stone-700 hover:text-stone-900 font-medium">Sign Out</a>
      </div>
    `;
    document.body.appendChild(drawer);

    const closeBtn = drawer.querySelector('#close-mobile-nav');
    function openDrawer() {
      backdrop.classList.add('active');
      drawer.classList.add('active');
    }
    function closeDrawer() {
      backdrop.classList.remove('active');
      drawer.classList.remove('active');
    }
    menuBtn.addEventListener('click', openDrawer);
    closeBtn.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);
  }

  function injectNotificationsDropdown() {
    const notifBtn = document.querySelector('header button[aria-label="Notifications"]');
    if (!notifBtn) return;

    const parent = notifBtn.parentElement;
    parent.classList.add('relative');

    const dropdown = document.createElement('div');
    dropdown.id = 'notifications-dropdown';
    dropdown.innerHTML = `
      <div class="p-3 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
        <span class="text-xs font-semibold text-stone-900">Notifications</span>
        <span class="text-[11px] text-stone-500 font-mono">3 unread</span>
      </div>
      <div class="flex flex-col divide-y divide-stone-100 max-h-72 overflow-y-auto">
        <div class="p-3 hover:bg-stone-50 cursor-pointer" onclick="window.location.href='/student-faculty-email-template'">
          <div class="flex items-center justify-between text-[11px] text-stone-500 mb-1">
            <span class="font-medium text-stone-800">Dispatch Verified</span>
            <span class="font-mono">10m ago</span>
          </div>
          <p class="text-xs text-stone-700 leading-snug">Seminar IV Robotics dispatch confirmed for 368 recipients.</p>
        </div>
        <div class="p-3 hover:bg-stone-50 cursor-pointer" onclick="window.location.href='/session-archive-history'">
          <div class="flex items-center justify-between text-[11px] text-stone-500 mb-1">
            <span class="font-medium text-stone-800">Roster Synchronized</span>
            <span class="font-mono">1h ago</span>
          </div>
          <p class="text-xs text-stone-700 leading-snug">320 undergraduate candidate entries confirmed in registrar database.</p>
        </div>
        <div class="p-3 hover:bg-stone-50 cursor-pointer" onclick="window.location.href='/dashboard'">
          <div class="flex items-center justify-between text-[11px] text-stone-500 mb-1">
            <span class="font-medium text-stone-800">Curriculum Review</span>
            <span class="font-mono">3h ago</span>
          </div>
          <p class="text-xs text-stone-700 leading-snug">Department Senate session scheduled for Friday, 16:00 IST.</p>
        </div>
      </div>
      <div class="p-2 border-t border-stone-200 bg-white text-center">
        <a href="/session-archive-history" class="text-xs text-stone-700 hover:text-stone-900 font-medium">View all logs</a>
      </div>
    `;
    parent.appendChild(dropdown);

    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && e.target !== notifBtn) {
        dropdown.classList.remove('active');
      }
    });
  }

  window.copyMeetingLink = function (url) {
    if (!url) url = 'https://meet.google.com/eng-krish-pract';
    navigator.clipboard.writeText(url).then(() => {
      window.showPortalToast('Link Copied', url, 'success');
    }).catch(() => {
      window.showPortalToast('Meeting URL', url, 'info');
    });
  };

  window.downloadIcsCalendar = function (title, dateStr, timeStr, meetUrl) {
    const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Dept of Engineering//Academic Portal//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
UID:${Date.now()}@engineering.edu.in
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${title || 'Academic Session'}
DESCRIPTION:Official Academic Session conducted by Prof. of Practice Engr. Krishnavel.\\nTeleconference: ${meetUrl || 'https://meet.google.com/eng-krish-pract'}
LOCATION:${meetUrl || 'Department Advisory Suite'}
ORGANIZER;CN="Prof. Krishnavel":mailto:krishnavel.practice@engineering.edu.in
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${(title || 'session').replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.showPortalToast('Calendar File Ready', 'Calendar invitation (.ics) downloaded.', 'success');
  };

  window.exportSessionsCSV = function () {
    const rows = document.querySelectorAll('.session-row');
    let csv = 'ID,Session Title,Cohort,Schedule,Platform,Status,Recipients\n';

    if (rows && rows.length > 0) {
      rows.forEach((row, i) => {
        const title = row.querySelector('.session-title')?.innerText || `Session ${i + 1}`;
        const cohort = row.querySelector('.session-cohort')?.innerText || 'Cohort';
        const date = row.children[1]?.innerText.replace(/[\r\n]+/g, ' ') || '';
        const plat = row.children[2]?.innerText.replace(/[\r\n]+/g, ' ') || '';
        const st = row.getAttribute('data-status') || '';
        const rec = row.getAttribute('data-recipient') || '';
        csv += `ACAD-${String(i + 1).padStart(3, '0')},"${title.replace(/"/g, '""')}","${cohort.replace(/"/g, '""')}","${date.trim()}","${plat.trim()}","${st}","${rec}"\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `academic_session_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.showPortalToast('Export Completed', 'Session archive downloaded as CSV.', 'success');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncNavigation);
  } else {
    syncNavigation();
  }
})();
