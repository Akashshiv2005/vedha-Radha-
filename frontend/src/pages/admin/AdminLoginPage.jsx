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
    <div className="min-h-screen bg-admin-bg text-admin-main flex flex-col justify-between selection:bg-admin-primary selection:text-white font-admin-body">
      {/* Top Header Navigation */}
      <header className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-[13px] font-medium text-admin-primary hover:text-admin-primary-hover transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </Link>

        <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium">
          <ShieldCheck className="w-4 h-4 text-admin-success" />
          <span>Authorized Staff Portal</span>
        </div>
      </header>

      {/* Main Centered Login Section */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          {/* Subtle antique-gold decorative top bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-admin-sidebar via-admin-gold to-admin-sidebar" />

          {/* Brand Wordmark & Emblem */}
          <div className="flex flex-col items-center text-center mb-6 pt-2">
            <div className="w-12 h-12 rounded-2xl bg-admin-sidebar border border-admin-gold/30 p-2 flex items-center justify-center text-admin-gold shadow-sm mb-3">
              <Sparkles className="w-6 h-6 text-admin-gold" />
            </div>

            <div className="space-y-0.5">
              <h1 className="font-admin-heading font-semibold text-[20px] tracking-wide text-admin-main">
                Vedha Radha Thangamaaligai
              </h1>
              <span className="text-[11px] font-admin-body text-admin-gold font-medium block">
                Luxury Jewellery Admin Portal
              </span>
            </div>

            <div className="mt-4">
              <h2 className="text-[22px] font-admin-heading font-semibold text-admin-main">
                Admin Sign In
              </h2>
              <p className="text-[14px] font-admin-body text-gray-500 mt-1 max-w-xs leading-relaxed">
                Sign in to manage showroom inventory, online reservations, orders, and logistics.
              </p>
            </div>
          </div>

          {/* Error Alert Box */}
          {errorMessage && (
            <div 
              role="alert" 
              aria-live="polite"
              className="mb-5 p-3.5 bg-admin-error-bg border border-admin-error/30 rounded-xl text-[13px] text-admin-main flex items-start gap-2.5 animate-in fade-in duration-200"
            >
              <AlertCircle className="w-4 h-4 text-admin-error flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-[12px] leading-relaxed">
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
                className="block text-[12px] font-medium text-admin-main mb-1.5"
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
                  className="w-full bg-[#F5F6F8] border border-gray-200 rounded-xl pl-10 pr-3.5 py-2.5 text-[14px] text-admin-main focus:ring-2 focus:ring-admin-gold focus:bg-white focus:outline-none transition placeholder:text-gray-400 disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password with accessible toggle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label 
                  htmlFor="admin-password" 
                  className="block text-[12px] font-medium text-admin-main"
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
                  className="w-full bg-[#F5F6F8] border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-[14px] text-admin-main focus:ring-2 focus:ring-admin-gold focus:bg-white focus:outline-none transition placeholder:text-gray-400 disabled:opacity-60"
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
              className="w-full mt-2 py-3 px-4 rounded-xl bg-admin-primary hover:bg-admin-primary-hover text-white font-semibold text-[14px] shadow-md flex items-center justify-center gap-2 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-admin-gold"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 text-admin-gold" />
                </>
              )}
            </button>
          </form>

          {/* Credential Assistance Safe Notice */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-[12px] text-gray-500 leading-relaxed">
              Need credential assistance? Contact the showroom manager or system administrator.
            </p>
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="py-4 bg-white text-center text-xs text-gray-500 border-t border-gray-200">
        <p className="text-[11px] text-gray-500">
          Authorized staff only • <strong>Vedha Radha Thangamaaligai Management System</strong>
        </p>
      </footer>
    </div>
  );
}
