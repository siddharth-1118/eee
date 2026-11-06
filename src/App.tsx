import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { DashboardPage } from './pages/DashboardPage';
import { ScheduleSessionPage } from './pages/ScheduleSessionPage';
import { PreviewConfirmationPage } from './pages/PreviewConfirmationPage';
import { EmailTemplatesPage } from './pages/EmailTemplatesPage';
import { SessionArchivePage } from './pages/SessionArchivePage';
import { LoginPage } from './pages/LoginPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const RootRedirect: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isAuthPage = location.pathname === '/login' || !isAuthenticated;

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
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/dashboard-overview" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="/schedule-session"
                element={
                  <ProtectedRoute>
                    <ScheduleSessionPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/create-session" element={<Navigate to="/schedule-session" replace />} />
              <Route
                path="/email-preview"
                element={
                  <ProtectedRoute>
                    <PreviewConfirmationPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/email-preview-confirmation-dialog" element={<Navigate to="/email-preview" replace />} />
              <Route
                path="/email-templates"
                element={
                  <ProtectedRoute>
                    <EmailTemplatesPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/student-faculty-email-template" element={<Navigate to="/email-templates" replace />} />
              <Route
                path="/session-archive"
                element={
                  <ProtectedRoute>
                    <SessionArchivePage />
                  </ProtectedRoute>
                }
              />
              <Route path="/session-archive-history" element={<Navigate to="/session-archive" replace />} />
              <Route path="*" element={<RootRedirect />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
