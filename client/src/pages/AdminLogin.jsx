import React, { useState } from 'react';
import { Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';
import logoImage from '../assets/logo.jpg';

const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Pass logged-in admin data upward
        onLoginSuccess(data.admin);
      } else {
        setErrorMessage(data.message || 'Invalid credentials.');
      }
    } catch (err) {
      console.error('Login submit error:', err);
      setErrorMessage('Network error connecting to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-warm-bg dark:bg-zinc-950 text-text-slate dark:text-zinc-100">
      <div className="absolute inset-0 crate-pattern pointer-events-none opacity-[0.02]" />

      <div className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <div className="flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-xl bg-brand-green flex items-center justify-center text-white shadow-md">
                <Lock size={20} />
              </div>
            </div>

            <h2 className="mt-6 text-center text-3xl font-extrabold text-text-slate dark:text-zinc-50">
              Admin Portal / સંચાલક પ્રવેશ
            </h2>
            <p className="mt-2 text-center text-sm text-gray-505 dark:text-zinc-400 font-semibold">
              Manage products, availability, and settings.
            </p>

            <div className="mt-8 bg-white dark:bg-zinc-900 py-8 px-4 shadow-sm border border-brand-green/5 dark:border-zinc-800 rounded-2xl sm:px-10">
              {errorMessage && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl flex items-center gap-2 text-sm font-semibold">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-xs font-bold text-gray-505 dark:text-zinc-400 uppercase tracking-wider mb-1" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-zinc-550">
                      <Mail size={16} />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@hn-greens.com"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-zinc-700 rounded-xl bg-transparent placeholder:text-black dark:placeholder:text-white focus:outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 text-sm transition-all text-text-slate dark:text-zinc-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-550 dark:text-zinc-400 uppercase tracking-wider mb-1" htmlFor="password">
                    Password
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-zinc-550">
                      <Lock size={16} />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-zinc-700 rounded-xl bg-transparent placeholder:text-black dark:placeholder:text-white focus:outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 text-sm transition-all text-text-slate dark:text-zinc-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-zinc-400 hover:text-text-slate dark:hover:text-zinc-100 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-brand-green hover:bg-brand-green/95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    {loading ? 'Logging in...' : 'Log In / લૉગ ઇન'}
                  </button>
                </div>
              </form>

              <div className="mt-6 pt-5 border-t border-gray-150 dark:border-zinc-850 text-center">
                <p className="text-[11px] text-gray-450 dark:text-zinc-500 font-medium">
                  💡 Account credentials were created during the initial setup. Contact system administrator if you forgot your credentials.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-12 bg-white dark:bg-zinc-950">
          <div className="text-center">
            <img
              src={logoImage}
              alt="HN Greens Logo"
              className="mx-auto mb-6 w-24 h-24 rounded-2xl border-4 border-zinc-100 shadow-xl object-cover dark:border-zinc-700"
            />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-text-slate dark:text-zinc-50 animate-[pulse_2.5s_ease-in-out_infinite]">
              Welcome Admin
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;



