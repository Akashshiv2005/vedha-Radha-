import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function validateSafeReturnUrl(url) {
  if (!url || typeof url !== 'string') return '/admin';
  const clean = decodeURIComponent(url).trim();
  
  // Must start with /admin and must not contain external protocols or backslashes
  if (
    clean.startsWith('/admin') &&
    !clean.startsWith('//') &&
    !clean.includes('\\') &&
    !clean.includes(':')
  ) {
    return clean;
  }
  return '/admin';
}

export default function AdminLoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // If already authenticated, redirect immediately
  React.useEffect(() => {
    if (isAuthenticated) {
      const returnUrl = validateSafeReturnUrl(searchParams.get('returnUrl'));
      navigate(returnUrl, { replace: true });
    }
  }, [isAuthenticated, navigate, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser || !trimmedPass) {
      setErrorMessage('Please enter both staff username/email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login({ username: trimmedUser, password: trimmedPass });

      if (result.success) {
        const returnUrl = validateSafeReturnUrl(searchParams.get('returnUrl'));
        navigate(returnUrl, { replace: true });
      } else {
        setErrorMessage(result.error || 'Unable to sign in. Check your details and try again.');
      }
    } catch {
      setErrorMessage('An unexpected connection error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2420] flex flex-col justify-between selection:bg-[#5C1D27] selection:text-white">
      {/* Top Header Navigation */}
      <header className="px-6 py-4 border-b border-[#E8DFD3] flex items-center justify-between">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#5C1D27] hover:text-[#44131B] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Showroom Storefront</span>
        </Link>

        <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Secure Staff Portal</span>
        </div>
      </header>

      {/* Main Centered Login Section */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-md bg-white border border-[#E3D9CC] rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          {/* Subtle antique-gold decorative border bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7A5826] via-[#C5A059] to-[#7A5826]" />

          {/* Brand Wordmark & Emblem */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF5EE] border border-[#C5A059]/40 p-2 flex items-center justify-center text-[#5C1D27] shadow-sm mb-3">
              <Sparkles className="w-6 h-6 text-[#C5A059]" />
            </div>

            <div className="space-y-0.5">
              <h1 className="font-serif font-bold text-xl tracking-wider text-[#1C1614]">
                VEDA RADHA
              </h1>
              <span className="text-[10px] font-sans tracking-[0.25em] text-[#7A5B20] font-semibold block uppercase">
                THANGAMAALIGAI
              </span>
            </div>

            <div className="mt-4">
              <h2 className="text-lg font-serif font-bold text-[#1C1614]">
                Admin Sign In
              </h2>
              <p className="text-xs text-gray-600 mt-1 max-w-xs leading-relaxed">
                Sign in to manage products, reservations, orders and delivery.
              </p>
            </div>
          </div>

          {/* Error Alert Box */}
          {errorMessage && (
            <div 
              role="alert" 
              aria-live="polite"
              className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-950 flex items-start gap-2.5 animate-in fade-in duration-200"
            >
              <AlertCircle className="w-4 h-4 text-rose-700 flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-[11px] leading-relaxed">
                {errorMessage}
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Staff Username / Email */}
            <div>
              <label 
                htmlFor="admin-username" 
                className="block text-[11px] font-bold uppercase tracking-wider text-[#5C1D27] mb-1.5"
              >
                Staff Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="admin-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  disabled={isLoading}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. staff@vedaradha.com or admin"
                  className="w-full bg-[#FAF7F2] border border-[#D5C7B3] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#2C2420] focus:ring-2 focus:ring-[#C5A059] focus:bg-white focus:outline-none transition placeholder:text-gray-400 disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password with accessible toggle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label 
                  htmlFor="admin-password" 
                  className="block text-[11px] font-bold uppercase tracking-wider text-[#5C1D27]"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter staff password"
                  className="w-full bg-[#FAF7F2] border border-[#D5C7B3] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#2C2420] focus:ring-2 focus:ring-[#C5A059] focus:bg-white focus:outline-none transition placeholder:text-gray-400 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#5C1D27] hover:bg-[#44131B] text-white font-semibold text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-[#5C1D27]"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A059]" />
                </>
              )}
            </button>
          </form>

          {/* Credential Assistance Safe Notice */}
          <div className="mt-6 pt-4 border-t border-[#EFE8DD] text-center">
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Need credential assistance? Contact the showroom manager or system administrator.
            </p>
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="py-4 text-center text-xs text-gray-500 border-t border-[#E8DFD3]">
        <p className="text-[11px] text-gray-500">
          Authorized staff only • <strong>Veda Radha Thangamaaligai</strong>
        </p>
      </footer>
    </div>
  );
}
