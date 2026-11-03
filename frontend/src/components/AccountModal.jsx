import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  UserCheck,
  Shield,
  ShieldCheck,
  Award,
  Lock,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  Key,
  ShoppingBag,
  Package,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Edit3,
  Clock,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { customerAuthClient } from '../api/customerAuthClient';

export default function AccountModal({ isOpen, onClose }) {
  const {
    customer,
    isAuthenticated,
    login,
    register,
    updateProfile,
    changePassword,
    logout
  } = useCustomerAuth();

  // Active view: 'login' | 'signup' | 'forgot' | 'verify-otp' | 'reset-password'
  const [authMode, setAuthMode] = useState('login');

  // Authenticated account subtab: 'profile' | 'orders' | 'security'
  const [accountTab, setAccountTab] = useState('profile');

  // Login form state
  const [loginMobile, setLoginMobile] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Sign up form state
  const [signupForm, setSignupForm] = useState({
    customer_name: '',
    mobile_number: '',
    alternative_mobile_number: '',
    full_address: '',
    pin_code: '',
    password: '',
    confirm_password: ''
  });
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupSubmitting, setSignupSubmitting] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');

  // Password recovery state
  const [forgotMobile, setForgotMobile] = useState('');
  const [forgotSubmitting, setForgotSubmitting] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [smsNotice, setSmsNotice] = useState('');
  const [devOtpHint, setDevOtpHint] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSubmitting, setOtpSubmitting] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  // Profile Edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    customer_name: '',
    alternative_mobile_number: '',
    full_address: '',
    pin_code: ''
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ text: '', isError: false });

  // Security / Change password in My Account
  const [secForm, setSecForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showSecCurrent, setShowSecCurrent] = useState(false);
  const [showSecNew, setShowSecNew] = useState(false);
  const [secSaving, setSecSaving] = useState(false);
  const [secMsg, setSecMsg] = useState({ text: '', isError: false });

  // Order history state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');

  // Sync profile form when customer changes
  useEffect(() => {
    if (customer) {
      setProfileForm({
        customer_name: customer.customer_name || '',
        alternative_mobile_number: customer.alternative_mobile_number || '',
        full_address: customer.full_address || '',
        pin_code: customer.pin_code || ''
      });
    }
  }, [customer]);

  // Load orders when switching to orders tab
  useEffect(() => {
    if (isAuthenticated && accountTab === 'orders') {
      let isMounted = true;
      async function loadOrders() {
        setOrdersLoading(true);
        setOrdersError('');
        const res = await customerAuthClient.getOrderHistory();
        if (isMounted) {
          if (res.success) {
            setOrders(res.orders || []);
          } else {
            setOrdersError(res.error || 'Failed to fetch your orders.');
          }
          setOrdersLoading(false);
        }
      }
      loadOrders();
      return () => { isMounted = false; };
    }
  }, [isAuthenticated, accountTab]);

  // Password strength helper
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-gray-200' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-400' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-400' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-blue-400' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-500' };
  };

  if (!isOpen) return null;

  // Handle Login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    const cleanMobile = loginMobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setLoginError('Mobile number must be exactly 10 digits.');
      return;
    }
    if (!loginPassword) {
      setLoginError('Please enter your account password.');
      return;
    }

    setLoginSubmitting(true);
    const result = await login({
      mobile_number: cleanMobile,
      password: loginPassword
    });
    setLoginSubmitting(false);

    if (!result.success) {
      setLoginError(result.error);
    } else {
      setLoginPassword('');
    }
  };

  // Handle Sign Up submission
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupError('');
    setSignupSuccess('');

    // Pre-flight frontend validation
    const name = signupForm.customer_name.trim();
    if (name.length < 2) {
      setSignupError('Customer name must contain at least 2 characters.');
      return;
    }

    const cleanMobile = signupForm.mobile_number.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setSignupError('Primary mobile number must be exactly 10 digits.');
      return;
    }

    const cleanAlt = signupForm.alternative_mobile_number ? signupForm.alternative_mobile_number.replace(/\D/g, '') : '';
    if (cleanAlt && cleanAlt.length !== 10) {
      setSignupError('Alternative mobile number must be exactly 10 digits if provided.');
      return;
    }
    if (cleanAlt && cleanAlt === cleanMobile) {
      setSignupError('Alternative mobile cannot be identical to primary mobile number.');
      return;
    }

    if (signupForm.full_address.trim().length < 5) {
      setSignupError('Please provide your complete address (at least 5 characters).');
      return;
    }

    const cleanPin = signupForm.pin_code.replace(/\D/g, '');
    if (cleanPin.length !== 6) {
      setSignupError('PIN code must be exactly 6 digits.');
      return;
    }

    if (signupForm.password.length < 8) {
      setSignupError('Password must contain at least 8 characters.');
      return;
    }

    if (signupForm.password !== signupForm.confirm_password) {
      setSignupError('Passwords do not match.');
      return;
    }

    setSignupSubmitting(true);
    const result = await register({
      customer_name: name,
      mobile_number: cleanMobile,
      alternative_mobile_number: cleanAlt || null,
      full_address: signupForm.full_address.trim(),
      pin_code: cleanPin,
      password: signupForm.password,
      confirm_password: signupForm.confirm_password
    });
    setSignupSubmitting(false);

    if (!result.success) {
      setSignupError(result.error);
    } else {
      setSignupSuccess('Account created successfully! Logging you in...');
      // Automatically log the customer in
      const logRes = await login({
        mobile_number: cleanMobile,
        password: signupForm.password
      });
      if (!logRes.success) {
        setSignupSuccess('Registration successful! Please sign in with your credentials.');
        setLoginMobile(cleanMobile);
        setAuthMode('login');
      }
    }
  };

  // Handle Forgot Password - Step 1: Send OTP
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');
    setSmsNotice('');
    setDevOtpHint('');

    const cleanMobile = forgotMobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setForgotError('Please enter a valid 10-digit registered mobile number.');
      return;
    }

    setForgotSubmitting(true);
    const result = await customerAuthClient.forgotPassword(cleanMobile);
    setForgotSubmitting(false);

    if (!result.success) {
      if (result.isSmsUnconfigured) {
        setSmsNotice(result.error);
      } else {
        setForgotError(result.error);
      }
    } else {
      if (result.dev_otp) {
        setDevOtpHint(`Development OTP: ${result.dev_otp}`);
      }
      setAuthMode('verify-otp');
    }
  };

  // Handle Forgot Password - Step 2: Verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpError('');

    const cleanOtp = otpCode.replace(/\D/g, '');
    if (cleanOtp.length !== 6) {
      setOtpError('Please enter the 6-digit verification code.');
      return;
    }

    setOtpSubmitting(true);
    const result = await customerAuthClient.verifyOTP({
      mobile_number: forgotMobile.replace(/\D/g, ''),
      otp_code: cleanOtp
    });
    setOtpSubmitting(false);

    if (!result.success) {
      setOtpError(result.error);
    } else {
      setResetToken(result.reset_token);
      setAuthMode('reset-password');
    }
  };

  // Handle Forgot Password - Step 3: Reset Password
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    if (newPassword.length < 8) {
      setResetError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setResetError('Passwords do not match.');
      return;
    }

    setResetSubmitting(true);
    const result = await customerAuthClient.resetPassword({
      reset_token: resetToken,
      new_password: newPassword,
      confirm_password: confirmNewPassword
    });
    setResetSubmitting(false);

    if (!result.success) {
      setResetError(result.error);
    } else {
      setResetSuccess('Password reset successfully! You can now log in.');
      setLoginMobile(forgotMobile);
      setTimeout(() => {
        setAuthMode('login');
        setResetSuccess('');
      }, 1500);
    }
  };

  // Handle Profile Update
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileMsg({ text: '', isError: false });

    const cleanAlt = profileForm.alternative_mobile_number ? profileForm.alternative_mobile_number.replace(/\D/g, '') : '';
    if (cleanAlt && cleanAlt.length !== 10) {
      setProfileMsg({ text: 'Alternative mobile must be 10 digits.', isError: true });
      return;
    }

    const cleanPin = profileForm.pin_code.replace(/\D/g, '');
    if (cleanPin.length !== 6) {
      setProfileMsg({ text: 'PIN code must be exactly 6 digits.', isError: true });
      return;
    }

    setProfileSaving(true);
    const result = await updateProfile({
      customer_name: profileForm.customer_name.trim(),
      alternative_mobile_number: cleanAlt || null,
      full_address: profileForm.full_address.trim(),
      pin_code: cleanPin
    });
    setProfileSaving(false);

    if (result.success) {
      setProfileMsg({ text: 'Profile details updated successfully.', isError: false });
      setIsEditingProfile(false);
    } else {
      setProfileMsg({ text: result.error || 'Failed to update profile.', isError: true });
    }
  };

  // Handle Password Change in Account
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setSecMsg({ text: '', isError: false });

    if (!secForm.current_password) {
      setSecMsg({ text: 'Please enter your current password.', isError: true });
      return;
    }
    if (secForm.new_password.length < 8) {
      setSecMsg({ text: 'New password must be at least 8 characters.', isError: true });
      return;
    }
    if (secForm.new_password !== secForm.confirm_password) {
      setSecMsg({ text: 'New passwords do not match.', isError: true });
      return;
    }

    setSecSaving(true);
    const result = await changePassword({
      current_password: secForm.current_password,
      new_password: secForm.new_password,
      confirm_password: secForm.confirm_password
    });
    setSecSaving(false);

    if (result.success) {
      setSecMsg({ text: 'Password changed successfully.', isError: false });
      setSecForm({ current_password: '', new_password: '', confirm_password: '' });
    } else {
      setSecMsg({ text: result.error || 'Failed to change password.', isError: true });
    }
  };

  const strength = getPasswordStrength(signupForm.password);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-[#FAF7F2] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-[#E8DFC0] relative my-auto cursor-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#73655C] hover:text-[#581923] p-1.5 rounded-full hover:bg-[#EAE2D5] transition-colors z-20 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ------------------------------------------------------------- */}
        {/* AUTHENTICATED MY ACCOUNT VIEW */}
        {/* ------------------------------------------------------------- */}
        {isAuthenticated && customer ? (
          <div>
            {/* Account Header Banner */}
            <div className="bg-gradient-to-r from-[#431219] via-[#581923] to-[#431219] text-white p-5 sm:p-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10 pointer-events-none">
                <Award className="w-36 h-36" />
              </div>
              
              <div className="flex items-center gap-3.5 relative z-10">
                <div className="w-13 h-13 rounded-full bg-[#F3EAD3] text-[#581923] flex items-center justify-center font-serif text-xl font-bold shadow-md shrink-0 border-2 border-[#C49A45]">
                  {customer.customer_name?.charAt(0)?.toUpperCase() || 'V'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold truncate text-[#FDFBF7]">
                      {customer.customer_name}
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#C49A45]/30 text-[#F5EFE6] border border-[#C49A45]/50">
                      <Sparkles className="w-2.5 h-2.5 text-[#F3EAD3]" />
                      Privilege Member
                    </span>
                  </div>
                  <p className="text-xs text-[#DECDBB] mt-0.5 flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-[#C49A45]" />
                    +91 {customer.mobile_number}
                  </p>
                </div>
              </div>

              {/* Subtabs Navigation */}
              <div className="flex items-center gap-1 mt-5 bg-[#350E14]/60 p-1 rounded-lg border border-[#C49A45]/20 text-xs">
                <button
                  onClick={() => setAccountTab('profile')}
                  className={`flex-1 py-1.5 px-2 rounded-md font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    accountTab === 'profile'
                      ? 'bg-[#FAF7F2] text-[#581923] font-semibold shadow-xs'
                      : 'text-[#EAE2D5] hover:text-white'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  Profile
                </button>
                <button
                  onClick={() => setAccountTab('orders')}
                  className={`flex-1 py-1.5 px-2 rounded-md font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    accountTab === 'orders'
                      ? 'bg-[#FAF7F2] text-[#581923] font-semibold shadow-xs'
                      : 'text-[#EAE2D5] hover:text-white'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  My Orders
                </button>
                <button
                  onClick={() => setAccountTab('security')}
                  className={`flex-1 py-1.5 px-2 rounded-md font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    accountTab === 'security'
                      ? 'bg-[#FAF7F2] text-[#581923] font-semibold shadow-xs'
                      : 'text-[#EAE2D5] hover:text-white'
                  }`}
                >
                  <Key className="w-3.5 h-3.5" />
                  Security
                </button>
              </div>
            </div>

            {/* Subtab Contents */}
            <div className="p-5 sm:p-6 max-h-[60vh] overflow-y-auto">
              {/* TAB 1: PROFILE */}
              {accountTab === 'profile' && (
                <div className="space-y-4">
                  {profileMsg.text && (
                    <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                      profileMsg.isError 
                        ? 'bg-red-50 text-red-700 border border-red-200' 
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}>
                      {profileMsg.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                      <span>{profileMsg.text}</span>
                    </div>
                  )}

                  {!isEditingProfile ? (
                    <div className="space-y-3.5 text-xs">
                      <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E8DFC0]/80 space-y-2.5">
                        <div className="flex justify-between items-center border-b border-[#EAE2D5] pb-2">
                          <span className="text-[#8C7A70] font-medium">Customer Full Name</span>
                          <span className="font-semibold text-[#2C2420]">{customer.customer_name}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-[#EAE2D5] pb-2">
                          <span className="text-[#8C7A70] font-medium">Primary Mobile</span>
                          <span className="font-semibold text-[#2C2420]">+91 {customer.mobile_number}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-[#EAE2D5] pb-2">
                          <span className="text-[#8C7A70] font-medium">Alternative Mobile</span>
                          <span className="font-semibold text-[#2C2420]">
                            {customer.alternative_mobile_number ? `+91 ${customer.alternative_mobile_number}` : 'Not provided'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center border-b border-[#EAE2D5] pb-2">
                          <span className="text-[#8C7A70] font-medium">PIN Code</span>
                          <span className="font-semibold text-[#2C2420]">{customer.pin_code}</span>
                        </div>
                        <div className="pt-1">
                          <span className="text-[#8C7A70] font-medium block mb-1">Registered Address</span>
                          <p className="text-[#2C2420] bg-white p-2.5 rounded-lg border border-[#EAE2D5] whitespace-pre-wrap leading-relaxed">
                            {customer.full_address}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => {
                            setProfileMsg({ text: '', isError: false });
                            setIsEditingProfile(true);
                          }}
                          className="flex-1 bg-[#581923] hover:bg-[#431219] text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit Profile Details
                        </button>
                        <button
                          onClick={logout}
                          className="px-3.5 py-2.5 border border-[#DECDBB] hover:bg-[#F3EAD3]/50 text-[#73655C] hover:text-[#581923] rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          title="Sign Out"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleProfileSave} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[#4A403A] font-semibold mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={profileForm.customer_name}
                          onChange={(e) => setProfileForm(p => ({ ...p, customer_name: e.target.value }))}
                          className="w-full bg-white border border-[#DECDBB] rounded-lg px-3 py-2 text-[#2C2420] focus:outline-none focus:border-[#581923]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#4A403A] font-semibold mb-1">Primary Mobile (Immutable)</label>
                        <input
                          type="text"
                          disabled
                          value={`+91 ${customer.mobile_number}`}
                          className="w-full bg-[#EFEBE4] border border-[#DECDBB] rounded-lg px-3 py-2 text-[#73655C] cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-[#4A403A] font-semibold mb-1">Alternative Mobile (Optional)</label>
                        <input
                          type="tel"
                          maxLength={10}
                          placeholder="10-digit mobile"
                          value={profileForm.alternative_mobile_number}
                          onChange={(e) => setProfileForm(p => ({ ...p, alternative_mobile_number: e.target.value }))}
                          className="w-full bg-white border border-[#DECDBB] rounded-lg px-3 py-2 text-[#2C2420] focus:outline-none focus:border-[#581923]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#4A403A] font-semibold mb-1">Delivery & Reservation Address *</label>
                        <textarea
                          rows={2}
                          required
                          value={profileForm.full_address}
                          onChange={(e) => setProfileForm(p => ({ ...p, full_address: e.target.value }))}
                          className="w-full bg-white border border-[#DECDBB] rounded-lg px-3 py-2 text-[#2C2420] focus:outline-none focus:border-[#581923]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#4A403A] font-semibold mb-1">Postal PIN Code *</label>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          value={profileForm.pin_code}
                          onChange={(e) => setProfileForm(p => ({ ...p, pin_code: e.target.value }))}
                          className="w-full bg-white border border-[#DECDBB] rounded-lg px-3 py-2 text-[#2C2420] focus:outline-none focus:border-[#581923]"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          type="submit"
                          disabled={profileSaving}
                          className="flex-1 bg-[#581923] hover:bg-[#431219] text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {profileSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save Changes'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="px-4 py-2.5 border border-[#DECDBB] hover:bg-[#F3EAD3]/50 text-[#73655C] rounded-lg font-semibold transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 2: MY ORDERS */}
              {accountTab === 'orders' && (
                <div className="space-y-3">
                  {ordersLoading ? (
                    <div className="py-10 flex flex-col items-center justify-center text-[#73655C] gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-[#581923]" />
                      <p className="text-xs">Loading your jewellery orders...</p>
                    </div>
                  ) : ordersError ? (
                    <div className="p-3 bg-red-50 text-red-700 rounded-lg text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{ordersError}</span>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="py-10 text-center space-y-2">
                      <Package className="w-10 h-10 text-[#C49A45] mx-auto opacity-70" />
                      <p className="text-sm font-semibold text-[#2C2420]">No Orders Found</p>
                      <p className="text-xs text-[#8C7A70] max-w-xs mx-auto">
                        Your jewellery orders and purchase history will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="bg-white p-3.5 rounded-xl border border-[#E8DFC0] shadow-2xs space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between border-b border-[#EAE2D5] pb-2">
                            <div>
                              <span className="font-mono font-bold text-[#581923] text-[11px]">
                                {order.order_number}
                              </span>
                              <span className="text-[10px] text-[#8C7A70] block">
                                {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                }) : ''}
                              </span>
                            </div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize bg-[#F5EFE6] text-[#581923] border border-[#DECDBB]">
                              {order.order_status?.replace('_', ' ') || 'Processing'}
                            </span>
                          </div>

                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-[#2C2420] text-xs">
                                {order.product_title || 'Fine Jewellery Piece'}
                              </p>
                              {order.product_sku && (
                                <p className="text-[10px] font-mono text-[#8C7A70]">SKU: {order.product_sku}</p>
                              )}
                              <p className="text-[10px] text-[#73655C] mt-0.5">
                                Channel: {order.order_channel?.replace('_', ' ') || 'Showroom'}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-bold text-[#8D6725]">
                                ₹{Number(order.total_amount || 0).toLocaleString('en-IN')}
                              </span>
                              <span className="block text-[10px] text-[#8C7A70]">
                                Qty: {order.quantity || 1}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: SECURITY */}
              {accountTab === 'security' && (
                <form onSubmit={handlePasswordChange} className="space-y-3.5 text-xs">
                  {secMsg.text && (
                    <div className={`p-3 rounded-lg flex items-center gap-2 ${
                      secMsg.isError 
                        ? 'bg-red-50 text-red-700 border border-red-200' 
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}>
                      {secMsg.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                      <span>{secMsg.text}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[#4A403A] font-semibold mb-1">Current Password *</label>
                    <div className="relative">
                      <input
                        type={showSecCurrent ? 'text' : 'password'}
                        required
                        value={secForm.current_password}
                        onChange={(e) => setSecForm(p => ({ ...p, current_password: e.target.value }))}
                        className="w-full bg-white border border-[#DECDBB] rounded-lg px-3 py-2 pr-9 text-[#2C2420] focus:outline-none focus:border-[#581923]"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecCurrent(!showSecCurrent)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C7A70] hover:text-[#581923]"
                      >
                        {showSecCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#4A403A] font-semibold mb-1">New Password (min 8 chars) *</label>
                    <div className="relative">
                      <input
                        type={showSecNew ? 'text' : 'password'}
                        required
                        value={secForm.new_password}
                        onChange={(e) => setSecForm(p => ({ ...p, new_password: e.target.value }))}
                        className="w-full bg-white border border-[#DECDBB] rounded-lg px-3 py-2 pr-9 text-[#2C2420] focus:outline-none focus:border-[#581923]"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecNew(!showSecNew)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C7A70] hover:text-[#581923]"
                      >
                        {showSecNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#4A403A] font-semibold mb-1">Re-enter New Password *</label>
                    <input
                      type="password"
                      required
                      value={secForm.confirm_password}
                      onChange={(e) => setSecForm(p => ({ ...p, confirm_password: e.target.value }))}
                      className="w-full bg-white border border-[#DECDBB] rounded-lg px-3 py-2 text-[#2C2420] focus:outline-none focus:border-[#581923]"
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={secSaving}
                    className="w-full bg-[#581923] hover:bg-[#431219] text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 mt-2 shadow-xs"
                  >
                    {secSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Update Password'}
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : (
          /* ------------------------------------------------------------- */
          /* UNAUTHENTICATED VIEWS (LOGIN / SIGN UP / FORGOT PASSWORD) */
          /* ------------------------------------------------------------- */
          <div>
            {/* Top Brand Header */}
            <div className="text-center pt-6 pb-4 px-6 bg-gradient-to-b from-[#F7F2E9] to-[#FAF7F2] border-b border-[#EAE2D5]">
              <div className="w-12 h-12 rounded-full bg-[#F3EAD3] text-[#581923] flex items-center justify-center mx-auto mb-2.5 shadow-xs border border-[#C49A45]/30">
                <ShieldCheck className="w-6 h-6 text-[#8D6725]" />
              </div>
              <h3 className="text-base sm:text-lg font-bold font-serif text-[#35151B]">
                Vedha Radha Privilege Club
              </h3>
              <p className="text-xs text-[#73655C] mt-0.5">
                Exclusive membership, bespoke jewellery previews & gold rate updates.
              </p>

              {/* Login / Sign Up Tab Toggle (Only visible if not in forgot password flow) */}
              {['login', 'signup'].includes(authMode) && (
                <div className="flex items-center gap-2 mt-4 bg-[#EDE5D8] p-1 rounded-xl max-w-xs mx-auto text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setLoginError('');
                      setSignupError('');
                    }}
                    className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                      authMode === 'login'
                        ? 'bg-[#581923] text-white shadow-xs'
                        : 'text-[#73655C] hover:text-[#35151B]'
                    }`}
                  >
                    Customer Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setLoginError('');
                      setSignupError('');
                    }}
                    className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                      authMode === 'signup'
                        ? 'bg-[#581923] text-white shadow-xs'
                        : 'text-[#73655C] hover:text-[#35151B]'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto">
              {/* 1. LOGIN FORM */}
              {authMode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                  {loginError && (
                    <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-2 animate-shake">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[#4A403A] font-semibold mb-1">
                      10-Digit Mobile Number *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7A70] font-medium">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        value={loginMobile}
                        onChange={(e) => setLoginMobile(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210"
                        className="w-full bg-white border border-[#DECDBB] rounded-lg pl-11 pr-3 py-2 text-[#2C2420] text-xs focus:outline-none focus:border-[#581923]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[#4A403A] font-semibold">Password *</label>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('forgot');
                          setForgotMobile(loginMobile);
                          setForgotError('');
                          setSmsNotice('');
                        }}
                        className="text-[#8D6725] hover:text-[#581923] text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white border border-[#DECDBB] rounded-lg px-3 py-2 pr-9 text-[#2C2420] text-xs focus:outline-none focus:border-[#581923]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C7A70] hover:text-[#581923] cursor-pointer"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loginSubmitting}
                    className="w-full bg-[#581923] hover:bg-[#431219] text-white py-2.5 rounded-lg font-semibold tracking-wide flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 shadow-xs mt-2"
                  >
                    {loginSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying Credentials...</span>
                      </>
                    ) : (
                      <span>Sign In to Privilege Club</span>
                    )}
                  </button>

                  <div className="text-center pt-2 text-[#73655C]">
                    <span>Don't have an account? </span>
                    <button
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      className="text-[#581923] font-semibold hover:underline cursor-pointer"
                    >
                      Register Now
                    </button>
                  </div>
                </form>
              )}

              {/* 2. SIGN UP FORM */}
              {authMode === 'signup' && (
                <form onSubmit={handleSignupSubmit} className="space-y-3 text-xs">
                  {signupError && (
                    <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{signupError}</span>
                    </div>
                  )}
                  {signupSuccess && (
                    <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{signupSuccess}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[#4A403A] font-semibold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Smt. Radha Ramanathan"
                      value={signupForm.customer_name}
                      onChange={(e) => setSignupForm(s => ({ ...s, customer_name: e.target.value }))}
                      className="w-full bg-white border border-[#DECDBB] rounded-lg px-3 py-2 text-[#2C2420] focus:outline-none focus:border-[#581923]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[#4A403A] font-semibold mb-1">Primary Mobile *</label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8C7A70] font-medium text-[11px]">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          required
                          placeholder="10 digits"
                          value={signupForm.mobile_number}
                          onChange={(e) => setSignupForm(s => ({ ...s, mobile_number: e.target.value.replace(/\D/g, '') }))}
                          className="w-full bg-white border border-[#DECDBB] rounded-lg pl-9 pr-2 py-2 text-[#2C2420] text-xs focus:outline-none focus:border-[#581923]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[#4A403A] font-semibold mb-1">Alt Mobile (Optional)</label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8C7A70] font-medium text-[11px]">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          placeholder="10 digits"
                          value={signupForm.alternative_mobile_number}
                          onChange={(e) => setSignupForm(s => ({ ...s, alternative_mobile_number: e.target.value.replace(/\D/g, '') }))}
                          className="w-full bg-white border border-[#DECDBB] rounded-lg pl-9 pr-2 py-2 text-[#2C2420] text-xs focus:outline-none focus:border-[#581923]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#4A403A] font-semibold mb-1">Full Postal Address *</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Street, Landmark, City/Town"
                      value={signupForm.full_address}
                      onChange={(e) => setSignupForm(s => ({ ...s, full_address: e.target.value }))}
                      className="w-full bg-white border border-[#DECDBB] rounded-lg px-3 py-2 text-[#2C2420] focus:outline-none focus:border-[#581923]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#4A403A] font-semibold mb-1">Postal PIN Code *</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="6-digit PIN code (e.g. 625001)"
                      value={signupForm.pin_code}
                      onChange={(e) => setSignupForm(s => ({ ...s, pin_code: e.target.value.replace(/\D/g, '') }))}
                      className="w-full bg-white border border-[#DECDBB] rounded-lg px-3 py-2 text-[#2C2420] focus:outline-none focus:border-[#581923]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[#4A403A] font-semibold mb-1">Password *</label>
                      <div className="relative">
                        <input
                          type={showSignupPassword ? 'text' : 'password'}
                          required
                          placeholder="Min 8 characters"
                          value={signupForm.password}
                          onChange={(e) => setSignupForm(s => ({ ...s, password: e.target.value }))}
                          className="w-full bg-white border border-[#DECDBB] rounded-lg px-3 py-2 pr-8 text-[#2C2420] text-xs focus:outline-none focus:border-[#581923]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8C7A70] hover:text-[#581923]"
                        >
                          {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[#4A403A] font-semibold mb-1">Confirm Password *</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          placeholder="Re-enter password"
                          value={signupForm.confirm_password}
                          onChange={(e) => setSignupForm(s => ({ ...s, confirm_password: e.target.value }))}
                          className="w-full bg-white border border-[#DECDBB] rounded-lg px-3 py-2 pr-8 text-[#2C2420] text-xs focus:outline-none focus:border-[#581923]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8C7A70] hover:text-[#581923]"
                        >
                          {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {signupForm.password && (
                    <div className="space-y-1 pt-0.5">
                      <div className="flex items-center justify-between text-[10px] text-[#73655C]">
                        <span>Password Strength:</span>
                        <span className="font-semibold">{strength.label}</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#EAE2D5] rounded-full overflow-hidden flex gap-1">
                        {[1, 2, 3, 4].map(idx => (
                          <div 
                            key={idx}
                            className={`h-full flex-1 transition-colors ${
                              idx <= strength.score ? strength.color : 'bg-transparent'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={signupSubmitting}
                    className="w-full bg-[#581923] hover:bg-[#431219] text-white py-2.5 rounded-lg font-semibold tracking-wide flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 shadow-xs mt-3"
                  >
                    {signupSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Creating Membership...</span>
                      </>
                    ) : (
                      <span>Complete Privilege Registration</span>
                    )}
                  </button>

                  <div className="text-center pt-2 text-[#73655C]">
                    <span>Already a Privilege Member? </span>
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="text-[#581923] font-semibold hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              )}

              {/* 3. FORGOT PASSWORD - STEP 1 (MOBILE ENTRY) */}
              {authMode === 'forgot' && (
                <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
                  <div className="flex items-center gap-2 text-[#581923]">
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="p-1 hover:bg-[#EDE5D8] rounded-full transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <span className="font-semibold text-sm">Recover Account Password</span>
                  </div>

                  <p className="text-[#73655C] leading-relaxed">
                    Enter the 10-digit mobile number linked to your Vedha Radha account to receive a security OTP.
                  </p>

                  {forgotError && (
                    <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{forgotError}</span>
                    </div>
                  )}

                  {smsNotice && (
                    <div className="p-3.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl space-y-2 leading-relaxed">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-xs text-amber-950">Showroom Concierge Assistance</p>
                          <p className="text-[11px] mt-1 text-amber-900">{smsNotice}</p>
                        </div>
                      </div>
                      <div className="pt-1 border-t border-amber-200/60 flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-[#581923]">Concierge: +91 98401 23456</span>
                        <button
                          type="button"
                          onClick={() => setAuthMode('login')}
                          className="text-[#581923] underline font-semibold"
                        >
                          Back to Login
                        </button>
                      </div>
                    </div>
                  )}

                  {!smsNotice && (
                    <>
                      <div>
                        <label className="block text-[#4A403A] font-semibold mb-1">
                          Registered Mobile Number *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7A70] font-medium">
                            +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            required
                            value={forgotMobile}
                            onChange={(e) => setForgotMobile(e.target.value.replace(/\D/g, ''))}
                            placeholder="9876543210"
                            className="w-full bg-white border border-[#DECDBB] rounded-lg pl-11 pr-3 py-2 text-[#2C2420] text-xs focus:outline-none focus:border-[#581923]"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={forgotSubmitting}
                        className="w-full bg-[#581923] hover:bg-[#431219] text-white py-2.5 rounded-lg font-semibold tracking-wide flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
                      >
                        {forgotSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Sending Verification OTP...</span>
                          </>
                        ) : (
                          <span>Send Recovery OTP</span>
                        )}
                      </button>
                    </>
                  )}
                </form>
              )}

              {/* 4. FORGOT PASSWORD - STEP 2 (OTP ENTRY) */}
              {authMode === 'verify-otp' && (
                <form onSubmit={handleOtpSubmit} className="space-y-4 text-xs">
                  <div className="flex items-center gap-2 text-[#581923]">
                    <button
                      type="button"
                      onClick={() => setAuthMode('forgot')}
                      className="p-1 hover:bg-[#EDE5D8] rounded-full transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <span className="font-semibold text-sm">Enter Verification Code</span>
                  </div>

                  <p className="text-[#73655C]">
                    We have sent a 6-digit code to <strong className="text-[#2C2420]">+91 {forgotMobile}</strong>.
                  </p>

                  {devOtpHint && (
                    <div className="p-2.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-lg font-mono text-[11px]">
                      {devOtpHint}
                    </div>
                  )}

                  {otpError && (
                    <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{otpError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[#4A403A] font-semibold mb-1">
                      6-Digit Security OTP *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full bg-white border border-[#DECDBB] rounded-lg px-3 py-2 text-[#2C2420] text-center tracking-widest font-mono text-base font-bold focus:outline-none focus:border-[#581923]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={otpSubmitting}
                    className="w-full bg-[#581923] hover:bg-[#431219] text-white py-2.5 rounded-lg font-semibold tracking-wide flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
                  >
                    {otpSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying Code...</span>
                      </>
                    ) : (
                      <span>Verify Code</span>
                    )}
                  </button>
                </form>
              )}

              {/* 5. FORGOT PASSWORD - STEP 3 (NEW PASSWORD ENTRY) */}
              {authMode === 'reset-password' && (
                <form onSubmit={handleResetSubmit} className="space-y-4 text-xs">
                  <div className="flex items-center gap-2 text-[#581923]">
                    <span className="font-semibold text-sm">Set New Account Password</span>
                  </div>

                  {resetError && (
                    <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{resetError}</span>
                    </div>
                  )}

                  {resetSuccess && (
                    <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{resetSuccess}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[#4A403A] font-semibold mb-1">
                      New Password (min 8 chars) *
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white border border-[#DECDBB] rounded-lg px-3 py-2 pr-9 text-[#2C2420] text-xs focus:outline-none focus:border-[#581923]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C7A70] hover:text-[#581923]"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#4A403A] font-semibold mb-1">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-[#DECDBB] rounded-lg px-3 py-2 text-[#2C2420] text-xs focus:outline-none focus:border-[#581923]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={resetSubmitting}
                    className="w-full bg-[#581923] hover:bg-[#431219] text-white py-2.5 rounded-lg font-semibold tracking-wide flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
                  >
                    {resetSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <span>Reset Password & Proceed to Login</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
