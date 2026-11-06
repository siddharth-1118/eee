import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/Header';
import { DashboardPage } from './pages/DashboardPage';
import { ScheduleSessionPage } from './pages/ScheduleSessionPage';
import { PreviewConfirmationPage } from './pages/PreviewConfirmationPage';
import { EmailTemplatesPage } from './pages/EmailTemplatesPage';
import { SessionArchivePage } from './pages/SessionArchivePage';
import { LoginPage } from './pages/LoginPage';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1c1917] font-sans antialiased flex flex-col">
      {!isAuthPage && <Header />}
      <main className={`flex-1 w-full ${!isAuthPage ? 'pt-20' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard-overview" element={<Navigate to="/dashboard" replace />} />
            <Route path="/schedule-session" element={<ScheduleSessionPage />} />
            <Route path="/create-session" element={<Navigate to="/schedule-session" replace />} />
            <Route path="/email-preview" element={<PreviewConfirmationPage />} />
            <Route path="/email-preview-confirmation-dialog" element={<Navigate to="/email-preview" replace />} />
            <Route path="/email-templates" element={<EmailTemplatesPage />} />
            <Route path="/student-faculty-email-template" element={<Navigate to="/email-templates" replace />} />
            <Route path="/session-archive" element={<SessionArchivePage />} />
            <Route path="/session-archive-history" element={<Navigate to="/session-archive" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ToastProvider>
  );
};

export default App;
