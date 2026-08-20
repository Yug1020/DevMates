import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../util/constant';
import axios from 'axios';

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80';

const AVATAR_PRESETS = [
  {
    name: 'Adam',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  },
  {
    name: 'Eva',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  },
  {
    name: 'Cyber',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
  },
];

export default function SignUp() {
  const navigate = useNavigate();

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [photoURL, setPhotoURL] = useState(DEFAULT_AVATAR);

  // Popover State for Profile Picture
  const [showAvatarPopover, setShowAvatarPopover] = useState(false);
  const [tempPhotoURL, setTempPhotoURL] = useState(DEFAULT_AVATAR);

  // Submission / Validation state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Calculate word count for bio (limit 150 words)
  const countWords = (text) => {
    if (!text || !text.trim()) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const currentBioWords = countWords(bio);

  const handleBioChange = (e) => {
    const value = e.target.value;
    const words = value.trim().split(/\s+/).filter(Boolean);
    if (words.length > 150) {
      // Keep only first 150 words if pasted/typed over limit
      const trimmed = words.slice(0, 150).join(' ');
      setBio(trimmed);
    } else {
      setBio(value);
    }
  };

  // Password strength calculation (4 bars)
  const calculatePasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: '#fc7c78' };
    if (score === 2) return { score: 2, label: 'Weak', color: '#fc7c78' };
    if (score === 3) return { score: 3, label: 'Medium', color: '#f59e0b' };
    return { score: 4, label: 'Strong', color: '#4edea3' };
  };

  const strength = calculatePasswordStrength(password);

  // Handle avatar save from popover
  const handleSaveAvatar = (e) => {
    e.preventDefault();
    if (tempPhotoURL.trim()) {
      setPhotoURL(tempPhotoURL.trim());
    }
    setShowAvatarPopover(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Basic frontend checks
    if (!firstName.trim()) {
      setErrorMsg('First Name is a mandatory field');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Email Address is required');
      return;
    }
    if (!password) {
      setErrorMsg('Password is required');
      return;
    }
    if (!phone || phone.toString().length !== 10) {
      setErrorMsg('Phone number must be exactly 10 digits');
      return;
    }
    if (!gender) {
      setErrorMsg('Please select a gender');
      return;
    }
    if (!age || Number(age) <= 0) {
      setErrorMsg('Please enter a valid age');
      return;
    }
    if (!skills.trim()) {
      setErrorMsg('Please enter at least 1 skill');
      return;
    }

    setLoading(true);

    try {
      // Split skills string into array of trimmed strings
      const skillsArray = skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        streetName: username.trim() || undefined,
        username: username.trim() || undefined,
        email: email.trim(),
        password,
        phone: Number(phone),
        gender,
        age: Number(age),
        bio: bio.trim() || undefined,
        skills: skillsArray,
        photoURL: photoURL || undefined,
      };

      const res = await axios.post(`${API_BASE_URL}/signup`, payload);

      if (res.status === 201 || res.status === 200) {
        setSuccessMsg('Account initialized successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setErrorMsg(typeof res.data === 'string' ? res.data : 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setErrorMsg(
          typeof err.response.data === 'string'
            ? err.response.data
            : err.response.data.message || 'Error occurred while creating account'
        );
      } else {
        setErrorMsg(err.message || 'Server connection error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100vh] min-h-[100vh] flex w-full bg-[#0D1117] text-[#dde4dd] overflow-y-hidden">
      {/* Left Side: Brand Anchoring / Terminal Slogans */}
      <div
        className=" lg:flex lg:w-5/12 relative bg-cover bg-center bg-no-repeat border-r border-[#242c27] flex-col justify-between p-10 select-none min-h-full"
        style={{
          backgroundImage:
            "url('https://rocm.blogs.amd.com/artificial-intelligence/hipDF_pandas_accelerated/README.html')",
        }}
      >
        {/* Subtle overlay to ensure text contrast over background image */}
        <div className="absolute inset-0 bg-[#0e1511]/70 backdrop-blur-[1px] pointer-events-none" />

        {/* Top: Brand Logo */}
        <div className="relative z-10 flex items-center gap-2.5 text-[#4edea3]">
          <span className="material-symbols-outlined text-[26px]">
            terminal
          </span>
          <span className="font-headline-md text-2xl font-bold tracking-tight text-[#4edea3]">
            DevMates
          </span>
        </div>

        {/* Center: Terminal Slogans */}
        <div className="relative z-10 my-auto space-y-4 font-mono-code text-base text-[#bbcabf]">
          <div className="flex items-center gap-3">
            <span className="text-[#4edea3] font-bold">&gt;</span>
            <span className="tracking-wide">Build together</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#4edea3] font-bold">&gt;</span>
            <span className="tracking-wide">Learn together</span>
            <span className="inline-block w-2.5 h-4 bg-[#4edea3] terminal-blink align-middle ml-1" />
          </div>
        </div>

        {/* Bottom: Version & Status */}
        <div className="relative z-10 font-mono-code text-xs text-[#3c4a42] tracking-wider">
          v2.4.1 // INITIALIZING_SESSION
        </div>
      </div>

      {/* Right Side: Registration / Create Account Form */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-4 sm:p-8 md:p-12 min-h-full">
        <div className="w-full max-w-xl bg-[#161d19] border border-[#242c27] rounded-lg p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.6)] mt-3 mb-3 relative">
          
          {/* Header Row: Title on Left, Avatar Popover Trigger on Right */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-headline-lg text-[#dde4dd]">
                Create Account
              </h1>
              <p className="text-sm font-body-sm text-[#86948a] mt-1">
                Join the developer network.
              </p>
            </div>

            {/* Profile Picture Avatar & Popover Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setTempPhotoURL(photoURL);
                  setShowAvatarPopover(!showAvatarPopover);
                }}
                className="w-14 h-14 rounded-xl border-2 border-[#3c4a42] hover:border-[#4edea3] transition-all overflow-hidden bg-[#0D1117] flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-[#4edea3] cursor-pointer shadow-md"
                title="Click to change profile picture"
              >
                {photoURL ? (
                  <img
                    src={photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = DEFAULT_AVATAR;
                    }}
                  />
                ) : (
                  <span className="material-symbols-outlined text-[#86948a] text-3xl group-hover:text-[#4edea3] transition-colors">
                    account_circle
                  </span>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                  <span className="material-symbols-outlined text-white text-lg">
                    edit
                  </span>
                </div>
              </button>

              {/* Profile Picture URL Popover */}
              {showAvatarPopover && (
                <div className="absolute right-0 top-16 z-50 w-72 sm:w-80 bg-[#0e1511] border border-[#3c4a42] rounded-lg p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#242c27]">
                    <span className="font-mono-label text-xs font-semibold text-[#dde4dd] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-[#4edea3]">
                        image
                      </span>
                      Profile Picture URL
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAvatarPopover(false)}
                      className="text-[#86948a] hover:text-[#dde4dd] text-sm"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Live Preview & Presets */}
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={tempPhotoURL || DEFAULT_AVATAR}
                      alt="Preview"
                      className="w-12 h-12 rounded-lg object-cover border border-[#3c4a42]"
                      onError={(e) => {
                        e.target.src = DEFAULT_AVATAR;
                      }}
                    />
                    <div className="flex-1">
                      <p className="text-[11px] font-mono-code text-[#86948a] mb-1">
                        Quick presets:
                      </p>
                      <div className="flex gap-1.5 flex-wrap">
                        {AVATAR_PRESETS.map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => setTempPhotoURL(preset.url)}
                            className="px-2 py-0.5 text-[10px] font-mono-code bg-[#1a211d] hover:bg-[#242c27] text-[#4edea3] border border-[#3c4a42] rounded"
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* URL Input */}
                  <div className="mb-3">
                    <label className="block text-[11px] font-mono-code text-[#86948a] mb-1">
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={tempPhotoURL}
                      onChange={(e) => setTempPhotoURL(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full px-2.5 py-1.5 text-xs font-mono-code rounded border border-[#30363D] bg-[#0D1117] text-[#dde4dd] focus:border-[#4edea3]"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-2 pt-2 border-t border-[#242c27]">
                    <button
                      type="button"
                      onClick={() => {
                        setTempPhotoURL(DEFAULT_AVATAR);
                        setPhotoURL(DEFAULT_AVATAR);
                        setShowAvatarPopover(false);
                      }}
                      className="px-2.5 py-1 text-xs text-[#86948a] hover:text-[#dde4dd] font-mono-code"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveAvatar}
                      className="px-3 py-1 text-xs font-mono-code font-semibold bg-[#4edea3] hover:bg-[#6ffbbe] text-[#000000] rounded transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded bg-[#ffdad6]/10 border border-[#ffb4ab]/30 text-[#ffb4ab] text-xs font-mono-code flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded bg-[#4edea3]/10 border border-[#4edea3]/30 text-[#4edea3] text-xs font-mono-code flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">
                check_circle
              </span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Row 1: First Name & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono-label text-[#dde4dd] mb-1">
                  First Name <span className="text-[#fc7c78]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ada"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono-code rounded border border-[#30363D] bg-[#0D1117] text-[#dde4dd] placeholder-[#4a554f]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono-label text-[#dde4dd] mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Lovelace"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono-code rounded border border-[#30363D] bg-[#0D1117] text-[#dde4dd] placeholder-[#4a554f]"
                />
              </div>
            </div>

            {/* Row 2: Username & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono-label text-[#dde4dd] mb-1">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="adalovelace"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono-code rounded border border-[#30363D] bg-[#0D1117] text-[#dde4dd] placeholder-[#4a554f]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono-label text-[#dde4dd] mb-1">
                  Email <span className="text-[#fc7c78]">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="ada@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono-code rounded border border-[#30363D] bg-[#0D1117] text-[#dde4dd] placeholder-[#4a554f]"
                />
              </div>
            </div>

            {/* Row 3: Password & Phone Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label className="block text-xs font-mono-label text-[#dde4dd] mb-1">
                  Password <span className="text-[#fc7c78]">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono-code rounded border border-[#30363D] bg-[#0D1117] text-[#dde4dd] placeholder-[#4a554f]"
                />
                {/* 4-bar Password Strength Indicator */}
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex gap-1.5 flex-1 max-w-[160px]">
                    {[1, 2, 3, 4].map((barIndex) => (
                      <div
                        key={barIndex}
                        className={`h-1 flex-1 rounded-full transition-all duration-200 ${
                          password && barIndex <= strength.score
                            ? barIndex <= 2
                              ? 'bg-[#fc7c78]'
                              : barIndex === 3
                              ? 'bg-[#f59e0b]'
                              : 'bg-[#4edea3]'
                            : 'bg-[#242c27]'
                        }`}
                      />
                    ))}
                  </div>
                  {password && (
                    <span
                      className="text-[11px] font-mono-code ml-2"
                      style={{ color: strength.color }}
                    >
                      {strength.label}
                    </span>
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-mono-label text-[#dde4dd] mb-1">
                  Phone Number <span className="text-[#fc7c78]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="1234567890"
                  value={phone}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/\D/g, '');
                    setPhone(onlyNums);
                  }}
                  className="w-full px-3 py-2 text-sm font-mono-code rounded border border-[#30363D] bg-[#0D1117] text-[#dde4dd] placeholder-[#4a554f]"
                />
                <p className="mt-1 text-[11px] font-mono-code text-[#fc7c78]/80">
                  phone number is mandatory field
                </p>
              </div>
            </div>

            {/* Row 4: Gender & Age */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Gender Dropdown */}
              <div>
                <label className="block text-xs font-mono-label text-[#dde4dd] mb-1">
                  Gender <span className="text-[#fc7c78]">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-mono-code rounded border border-[#30363D] bg-[#0D1117] text-[#dde4dd] appearance-none cursor-pointer focus:border-[#4edea3]"
                  >
                    <option value="" disabled>
                      Select gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="others">others</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#86948a]">
                    <span className="material-symbols-outlined text-base">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-mono-label text-[#dde4dd] mb-1">
                  Age <span className="text-[#fc7c78]">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={120}
                  placeholder="25"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono-code rounded border border-[#30363D] bg-[#0D1117] text-[#dde4dd] placeholder-[#4a554f]"
                />
              </div>
            </div>

            {/* Row 5: Bio Field (Non-mandatory with 150-word counter) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-mono-label text-[#dde4dd]">
                  Bio (Optional)
                </label>
                <span
                  className={`text-[11px] font-mono-code ${
                    currentBioWords >= 150 ? 'text-[#fc7c78] font-bold' : 'text-[#86948a]'
                  }`}
                >
                  {currentBioWords}/150
                </span>
              </div>
              <textarea
                rows={3}
                placeholder="Tell us about yourself, what you are building, or what tech you love..."
                value={bio}
                onChange={handleBioChange}
                className="w-full px-3 py-2 text-sm font-mono-code rounded border border-[#30363D] bg-[#0D1117] text-[#dde4dd] placeholder-[#4a554f] resize-none"
              />
            </div>

            {/* Row 6: Skills Input (Text response, no dropdown/buttons) */}
            <div>
              <label className="block text-xs font-mono-label text-[#dde4dd] mb-1">
                Skills (Select at least 1) <span className="text-[#fc7c78]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="HTML/CSS, JavaScript, Python, React"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono-code rounded border border-[#30363D] bg-[#0D1117] text-[#dde4dd] placeholder-[#4a554f]"
              />
              <p className="mt-1 text-[11px] font-mono-code text-[#86948a]">
                Type your skills separated by commas
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded font-mono-label font-bold text-sm text-[#000000] bg-[#4edea3] hover:bg-[#6ffbbe] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_2px_12px_rgba(78,222,163,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin">
                      progress_activity
                    </span>
                    <span>Initializing Account...</span>
                  </>
                ) : (
                  <>
                    <span>Initialize Account</span>
                    <span className="material-symbols-outlined text-lg">
                      arrow_forward
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Navigation to Login */}
          <div className="mt-2 pt-2 -mb-3 border-t border-[#242c27] text-center">
            <p className="text-xs font-body-sm text-[#86948a]">
              Already have an instance?{' '}
              <Link
                to="/login"
                className="font-semibold text-[#89ceff] hover:text-[#c9e6ff] transition-colors ml-1"
              >
                Log In
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
