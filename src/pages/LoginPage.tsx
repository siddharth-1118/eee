import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Key, Eye, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('srmeeelibraray@gmail.com');
  const [password, setPassword] = useState('4321');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Validation Error', 'Email and PIN / passkey are required', 'error');
      return;
    }

    setIsSubmitting(true);
    showToast('Authenticating...', 'Verifying faculty credentials against SRM institutional registry', 'info');

    try {
      const success = await login(email, password);
      if (success) {
        showToast('Authentication Granted', 'Welcome Prof. Krishnavel (Senior Faculty Advisor)', 'success');
        navigate('/dashboard', { replace: true });
      } else {
        showToast('Access Denied', 'Invalid credentials. Please enter PIN 4321 or faculty passkey.', 'error');
      }
    } catch (err: any) {
      showToast('Authentication Error', err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-6 antialiased">
      <main className="w-full max-w-sm bg-white border border-[#e6e2da] rounded-lg p-8 shadow-sm">
        
        {/* Header with Sir's Portrait */}
        <div className="flex flex-col items-center text-center">
          <img
            alt="Prof. Krishnavel"
            className="w-16 h-16 rounded-full object-cover border-2 border-[#d6d0c4] shadow-sm mb-3"
            src="/professor_krishnavel.jpg"
          />
          <div className="text-xs text-[#78716c] font-medium tracking-normal mb-1">
            SRMIST · Department of EEE
          </div>
          <h1 className="font-serif text-2xl font-normal text-[#1c1917]">
            Faculty Access Portal
          </h1>
          <p className="text-xs text-[#57534e] mt-1 max-w-xs">
            Sign in to schedule advisory hours and manage student session dispatches
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#57534e] mb-1" htmlFor="faculty-email">
              Faculty Relay Email
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-[#78716c] absolute left-3 pointer-events-none" />
              <input
                id="faculty-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="srmeeelibraray@gmail.com"
                className="w-full bg-[#fbfaf8] text-[#1c1917] text-sm pl-9 pr-3 py-2 rounded border border-[#e6e2da] focus:outline-none focus:border-[#1c1917] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-1">
              <label className="text-xs font-medium text-[#57534e]" htmlFor="faculty-passkey">
                Faculty PIN / Passkey
              </label>
              <span className="text-[10px] text-stone-500 font-mono">PIN: 4321</span>
            </div>
            <div className="relative flex items-center">
              <Key className="w-4 h-4 text-[#78716c] absolute left-3 pointer-events-none" />
              <input
                id="faculty-passkey"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter PIN (e.g. 4321)"
                className="w-full bg-white text-[#1c1917] text-sm pl-9 pr-9 py-2 rounded border border-[#e6e2da] focus:outline-none focus:border-[#1c1917] transition-colors font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 p-1 text-[#78716c] hover:text-[#1c1917]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Portal'}</span>
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[11px] text-stone-500 text-center">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Faculty Principal: Prof. of Practice Engr. Krishnavel</span>
        </div>
      </main>
    </div>
  );
};
