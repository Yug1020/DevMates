import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../util/constant';
import axios from 'axios';

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80';
const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;

export default function SignUp() {
  const navigate = useNavigate();

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [streetName, setStreetName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [profession, setProfession] = useState('');
  // const [goal, setGoal] = useState('');
  // const [goalDeadline, setGoalDeadline] = useState(null);
  // const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const profileImageInputRef = useRef(null);

  // Submission / Validation state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    return () => {
      if (profilePreview) URL.revokeObjectURL(profilePreview);
    };
  }, [profilePreview]);

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

  const handleProfileImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please choose an image file.');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      setErrorMsg('Profile image must be 5 MB or smaller.');
      event.target.value = '';
      return;
    }

    setErrorMsg('');
    setProfileImage(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    setProfilePreview(null);
    if (profileImageInputRef.current) {
      profileImageInputRef.current.value = '';
    }
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

      const payload = new FormData();
      payload.append('firstName', firstName.trim());
      payload.append('lastName', lastName.trim());
      payload.append('streetName', streetName.trim());
      payload.append('email', email.trim());
      payload.append('password', password);
      payload.append('phone', phone);
      payload.append('gender', gender);
      payload.append('age', age);
      payload.append('profession', profession.trim());
      payload.append('bio', bio.trim());
      payload.append('skills', JSON.stringify(skillsArray));

      if (profileImage) {
        payload.append('profileImage', profileImage);
      }

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
    <div className="h-screen w-full flex bg-[#0D1117] text-[#dde4dd] overflow-hidden">
      {/* Left Side: Brand Anchoring / Terminal Slogans */}
      <div
        className="hidden lg:flex lg:w-5/12 relative bg-cover bg-center bg-no-repeat border-r border-[#242c27] flex-col justify-between p-10 select-none h-full"
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
          v1.0.0 // INITIALIZING_SESSION
        </div>
      </div>

      {/* Right Side: Registration / Create Account Form */}
      <div className="w-full lg:w-7/12 flex items-start lg:items-center justify-center px-4 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12 h-full overflow-y-auto">
        <div className="w-full bg-[#161d19] border border-[#242c27] rounded-xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.6)] my-auto relative">
          {/* Header Row: Title on Left, File-based Avatar Picker on Right */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-[#dde4dd] tracking-tight">
                DevMates
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-headline-lg text-[#dde4dd]">
                Create Account
              </h1>
              <p className="text-sm font-body-sm text-[#86948a] mt-1">
                Join the developer network.
              </p>
            </div>

            {/* Profile Picture Avatar & File Picker */}
            <div className="flex flex-col items-end gap-1.5">
              <button
                type="button"
                onClick={() => profileImageInputRef.current?.click()}
                className="w-14 h-14 rounded-xl border-2 border-[#3c4a42] hover:border-[#4edea3] transition-all overflow-hidden bg-[#0D1117] flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-[#4edea3] cursor-pointer shadow-md"
                title="Choose a profile picture from your device"
                disabled={loading}
              >
                <img
                  src={profilePreview || DEFAULT_AVATAR}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = DEFAULT_AVATAR;
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                  <span className="material-symbols-outlined text-white text-lg">
                    edit
                  </span>
                </div>
              </button>

              <input
                ref={profileImageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageChange}
              />
              <button
                type="button"
                onClick={() => profileImageInputRef.current?.click()}
                className="text-[11px] font-mono-code text-[#89ceff] hover:text-[#c9e6ff]"
                disabled={loading}
              >
                {profileImage ? 'Change image' : 'Upload image'}
              </button>
              {profileImage ? (
                <button
                  type="button"
                  onClick={removeProfileImage}
                  className="text-[10px] font-mono-code text-[#fc7c78] hover:text-[#ffb4ab]"
                  disabled={loading}
                >
                  Remove {profileImage.name}
                </button>
              ) : (
                <span className="text-[10px] font-mono-code text-[#86948a]">Images only, up to 5 MB</span>
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

            {/* Row 2: Street Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono-label text-[#dde4dd] mb-1">
                  User Name
                </label>
                <input
                  type="text"
                  placeholder="Developer"
                  value={streetName}
                  onChange={(e) => setStreetName(e.target.value)}
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
                {phone.length !== 10 && (
                  <p className='mt-1 text-[11px] font-mono-code text-[#fc7c78]/80'>
                    phone number must be 10 digits
                  </p>
                )}
              </div>
            </div>

            {/* Row: Profession & Current Goal */}
            <div>
              {/* className="flex flex-row w-full items-center justify-between mb-1" */}
              {/* Profession */}
              <div className='flex flex-col items-start justify-center'>
                <label className="block text-xs font-mono-label text-[#dde4dd] mb-1">
                  Profession <span className="text-[#fc7c78]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Full Stack Developer, Cyber Security Specialist..."
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono-code rounded border border-[#30363D] bg-[#0D1117] text-[#dde4dd] placeholder-[#4a554f] focus:border-[#4edea3] outline-none"
                />
              </div>

              {/* Current Goal */}
              {/* <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-mono-label text-[#dde4dd]">
                    Current Goal (Optional)
                  </label>
                  {goalDeadline && (
                    <span className="text-[11px] font-mono-code text-[#4edea3] flex items-center gap-1">
                      <span>Due: {format(goalDeadline, 'MMM d, yyyy')}</span>
                      <button
                        type="button"
                        onClick={() => setGoalDeadline(null)}
                        className="hover:text-[#fc7c78] ml-0.5 text-[#86948a] transition-colors cursor-pointer"
                        title="Clear deadline"
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="learning Rust, Grinding Leetcode..."
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 text-sm font-mono-code rounded border border-[#30363D] bg-[#0D1117] text-[#dde4dd] placeholder-[#4a554f] focus:border-[#4edea3] outline-none"
                  />
                  <div className="absolute right-1.5 flex items-center">
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className={`p-1.5 rounded hover:bg-[#242c27] transition-colors flex items-center justify-center cursor-pointer ${
                            goalDeadline
                              ? 'text-[#4edea3] bg-[#102a20]'
                              : 'text-[#86948a] hover:text-[#dde4dd]'
                          }`}
                          title="Mark goal deadline"
                        >
                          <CalendarIcon className="w-4 h-4" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 border border-[#242c27] bg-[#161d19]" align="end">
                        <Calendar
                          mode="single"
                          selected={goalDeadline}
                          onSelect={(date) => {
                            setGoalDeadline(date || null);
                            setIsCalendarOpen(false);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div> */}
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
          <div className="mt-4 pt-3 border-t border-[#242c27] text-center">
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
