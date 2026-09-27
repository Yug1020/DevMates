import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setUser } from '../store/userSlice';
import { API_BASE_URL } from '../util/constant.js';
import axios from 'axios';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, X as XIcon } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80';
const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;

const getGoalIcon = (skill = '') => {
  const s = skill.toLowerCase();
  if (s.includes('rust') || s.includes('go') || s.includes('system') || s.includes('backend')) return '🎯';
  if (s.includes('react') || s.includes('ui') || s.includes('ux') || s.includes('frontend') || s.includes('three')) return '📚';
  if (s.includes('python') || s.includes('django') || s.includes('fullstack') || s.includes('solidity') || s.includes('node')) return '🤝';
  if (s.includes('kubernetes') || s.includes('aws') || s.includes('devops') || s.includes('docker') || s.includes('cloud')) return '🚀';
  if (s.includes('ai') || s.includes('ml') || s.includes('torch') || s.includes('data')) return '🧠';
  return '🤝';
};

export default function EditProfileAndLivePreview({ onToast }) {
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.user);
  const location = useLocation();
  const goalInputRef = useRef(null);
  const profileImageInputRef = useRef(null);

  // Form State adhering to userSchema
  const [firstName, setFirstName] = useState(reduxUser?.firstName || 'Alex');
  const [lastName, setLastName] = useState(reduxUser?.lastName || 'Chen');
  const [streetName, setStreetName] = useState(reduxUser?.streetName || 'Alex_Dev');
  const [phone, setPhone] = useState(reduxUser?.phone ? String(reduxUser.phone) : '1234567890');
  const [profession, setProfession] = useState(reduxUser?.profession || 'Engineer');
  const [goal, setGoal] = useState(reduxUser?.goal || '');
  const [goalDeadline, setGoalDeadline] = useState(
    reduxUser?.goalDeadline ? new Date(reduxUser.goalDeadline) : null
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [bio, setBio] = useState(
    reduxUser?.bio ||
    'Building scalable systems and obsessing over clean architecture. Full-stack generalist.'
  );
  const [skillsInput, setSkillsInput] = useState(
    Array.isArray(reduxUser?.skills)
      ? reduxUser.skills.join(', ')
      : 'React, Node.js, Go, PostgreSQL'
  );
  const [photoURL, setPhotoURL] = useState(reduxUser?.photoURL || DEFAULT_AVATAR);
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [imageError, setImageError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!location.state?.focusGoal) return;

    const frameId = window.requestAnimationFrame(() => {
      goalInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      goalInputRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [location.state?.focusGoal]);

  useEffect(() => {
    return () => {
      if (profilePreview) URL.revokeObjectURL(profilePreview);
    };
  }, [profilePreview]);

  // Parse skills from comma-separated string
  const parsedSkills = skillsInput
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const displayName =
    [firstName, lastName].filter(Boolean).join(' ') || streetName || 'Developer';
  const goalIcon = getGoalIcon(goal);
  const displayedPhotoURL = profilePreview || photoURL || DEFAULT_AVATAR;

  const handleProfileImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Please choose an image file.');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      setImageError('Profile image must be 5 MB or smaller.');
      event.target.value = '';
      return;
    }

    setImageError('');
    setProfileImage(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    setProfilePreview(null);
    setImageError('');
    if (profileImageInputRef.current) {
      profileImageInputRef.current.value = '';
    }
  };

  const handleSaveChanges = async (e) => {
  e.preventDefault();
  setIsSaving(true);

  try {
    const payload = new FormData();
    payload.append('streetName', streetName);
    payload.append('phone', phone);
    payload.append('skills', JSON.stringify(parsedSkills));
    payload.append('bio', bio);
    payload.append('profession', profession);
    payload.append('goal', goal);
    payload.append('goalDeadline', goalDeadline ? goalDeadline.toISOString() : '');
    if (profileImage) {
      payload.append('profileImage', profileImage);
    }

    const response = await axios.patch(API_BASE_URL + "/user/profile/update", payload, {
      withCredentials: true,
    });
    const savedPhotoURL = response.data?.photoURL || photoURL;

    dispatch(setUser({
      ...(reduxUser || {}),
      streetName,
      phone: Number(phone) || phone,
      bio,
      skills: parsedSkills,
      photoURL: savedPhotoURL,
      profession,
      goal,
      goalDeadline: goalDeadline ? goalDeadline.toISOString() : null,
    }));

    setPhotoURL(savedPhotoURL);
    removeProfileImage();
    
    if (onToast) onToast('Profile changes saved successfully!');

    } catch (error) {
      console.log(error);
      if (onToast) onToast('Failed to save profile changes!');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Cancel / Reset to original values
  const handleCancel = () => {
    setFirstName(reduxUser?.firstName || 'Alex');
    setLastName(reduxUser?.lastName || 'Chen');
    setStreetName(reduxUser?.streetName || 'Alex_Dev');
    setPhone(reduxUser?.phone ? String(reduxUser.phone) : '9876543210');
    setProfession(reduxUser?.profession || 'Engineer');
    setGoal(reduxUser?.goal || '');
    setGoalDeadline(
      reduxUser?.goalDeadline ? new Date(reduxUser.goalDeadline) : null
    );
    setBio(
      reduxUser?.bio ||
      'Building scalable systems and obsessing over clean architecture. Full-stack generalist.'
    );
    setSkillsInput(
      Array.isArray(reduxUser?.skills)
        ? reduxUser.skills.join(', ')
        : 'React, Node.js, Go, PostgreSQL'
    );
    setPhotoURL(reduxUser?.photoURL || DEFAULT_AVATAR);
    removeProfileImage();
    if (onToast) onToast('Changes reverted');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* ── Left Column: Edit Profile ────────────────────────────────────────── */}
      <div className="lg:col-span-7">
        <div className="bg-[#0e141a] border border-[#1f2b38] rounded-xl p-6 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#1b2633]">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#4edea3] text-xl">
                edit_square
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#dde4dd]">Edit Profile</h2>
            </div>
            <span className="font-mono-code text-[11px] text-[#718076] border border-[#26372d] bg-[#121d17] px-2.5 py-1 rounded">
              profile.config.json
            </span>
          </div>

          <form onSubmit={handleSaveChanges} className="space-y-5">
            {/* Profile Picture Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 relative pb-2">
              <div className="flex items-center gap-4">
                <img
                  src={displayedPhotoURL}
                  alt="Profile Avatar"
                  className="w-16 h-16 rounded-xl object-cover border border-[#273646] shadow-sm flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_AVATAR;
                  }}
                />

                <div className="flex-1">
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
                    className="px-3.5 py-1.5 text-xs font-mono-code border border-[#295c73] hover:border-[#38bdf8] text-[#7dd3fc] hover:bg-[#0c2231] rounded transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    disabled={isSaving}
                  >
                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                    <span>{profileImage ? 'Change Profile Picture' : 'Choose Profile Picture'}</span>
                  </button>
                  <p className="text-[11px] font-mono-code text-[#718076] mt-1.5">
                    Images only, up to 5 MB
                  </p>
                  {profileImage && (
                    <button
                      type="button"
                      onClick={removeProfileImage}
                      className="text-[11px] font-mono-code text-[#fc7c78] hover:text-[#ffb4ab] mt-1"
                      disabled={isSaving}
                    >
                      Remove {profileImage.name}
                    </button>
                  )}
                  {imageError && (
                    <p className="text-[11px] font-mono-code text-[#fc7c78] mt-1">{imageError}</p>
                  )}
                </div>
              </div>

              <input
                type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder="Profession"
                  title="Profession"
                  className="text-[11px] font-mono-code px-2.5 py-0.5 rounded bg-[#17212b] border border-[#273646] text-[#9fb0a5] tracking-wide flex-shrink-0 text-center focus:border-[#4edea3] focus:text-[#dde4dd] outline-none transition-colors"
              />

            </div>

            {/* First Name & Last Name Inputs */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono-code text-[#8a9990] mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  maxLength={15}
                  className="w-full px-3 py-2 text-xs font-mono-code bg-[#080d11] border border-[#202932] rounded text-[#dde4dd] focus:border-[#4edea3] outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-mono-code text-[#8a9990] mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  maxLength={15}
                  className="w-full px-3 py-2 text-xs font-mono-code bg-[#080d11] border border-[#202932] rounded text-[#dde4dd] focus:border-[#4edea3] outline-none transition-colors"
                />
              </div>
            </div> */}

            {/* User Name Input (binds to streetName in schema) */}
            <div>
              <label className="block text-xs font-mono-code text-[#8a9990] mb-1.5">
                User Name
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono-code text-sm text-[#7e8e83] select-none">
                  $
                </span>
                <input
                  type="text"
                  value={streetName}
                  onChange={(e) => setStreetName(e.target.value)}
                  maxLength={15}
                  className="w-full pl-7 pr-3 py-2 text-xs font-mono-code bg-[#080d11] border border-[#202932] rounded text-[#dde4dd] focus:border-[#4edea3] outline-none transition-colors"
                />
              </div>
            </div>

            {/* Phone Number Input (binds to phone in schema) */}
            <div>
              <label className="block text-xs font-mono-code text-[#8a9990] mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#7e8e83]">
                  call
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 10) setPhone(val);
                  }}
                  placeholder="10 digit phone number"
                  className="w-full pl-9 pr-3 py-2 text-xs font-mono-code bg-[#080d11] border border-[#202932] rounded text-[#dde4dd] focus:border-[#4edea3] outline-none transition-colors"
                />
              </div>
            </div>

            {/* Bio Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono-code text-[#8a9990]">Bio</label>
                <span className="text-[11px] font-mono-code text-[#718076]">
                  {bio.length}/150 chars
                </span>
              </div>
              <textarea
                value={bio}
                onChange={(e) => {
                  if (e.target.value.length <= 150) setBio(e.target.value);
                }}
                rows={3}
                placeholder="Tell other developers about your experience, focus, or interests..."
                className="w-full p-3 text-xs font-mono-code leading-relaxed bg-[#080d11] border border-[#202932] rounded text-[#dde4dd] focus:border-[#4edea3] outline-none transition-colors resize-none"
              />
            </div>

            {/* Tech Stack Input */}
            <div>
              <label className="block text-xs font-mono-code text-[#8a9990] mb-1.5">
                Tech Stack (comma separated)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono-code text-xs text-[#4edea3] select-none font-bold">
                  &lt;&gt;
                </span>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="React, Node.js, Go, PostgreSQL"
                  className="w-full pl-9 pr-3 py-2 text-xs font-mono-code bg-[#080d11] border border-[#202932] rounded text-[#dde4dd] focus:border-[#4edea3] outline-none transition-colors"
                />
              </div>
            </div>

            {/* Current Goal Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono-code text-[#8a9990]">
                  Current Goal
                </label>
                {goalDeadline && (
                  <span className="text-[11px] font-mono-code text-[#4edea3] flex items-center gap-1">
                    <span>Due: {format(new Date(goalDeadline), 'MMM d, yyyy')}</span>
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
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#7e8e83]">
                  flag
                </span>
                <input
                  ref={goalInputRef}
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="learning Rust, Grinding Leetcode..."
                  className="w-full pl-9 pr-10 py-2 text-xs font-mono-code bg-[#080d11] border border-[#202932] rounded text-[#dde4dd] focus:border-[#4edea3] outline-none transition-colors placeholder-[#4a554f]"
                />
                {/* Calendar Button at extreme right */}
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
                        selected={goalDeadline ? new Date(goalDeadline) : undefined}
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
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1b2633]">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-xs font-mono-code text-[#7e8e83] hover:text-[#dde4dd] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 text-xs font-mono-code font-bold bg-[#4edea3] hover:bg-[#6ffbbe] text-[#000000] rounded transition-all shadow-[0_2px_12px_rgba(78,222,163,0.25)] cursor-pointer active:scale-[0.98]"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Right Column: Live Preview (Exact copy of DeveloperFeedCard) ───────── */}
      <div className="lg:col-span-5">
        <div className="bg-[#0e141a] border border-[#1f2b38] rounded-xl p-6 shadow-xl flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#1b2633]">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#4edea3] text-xl">
                visibility
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#dde4dd]">Live Preview</h2>
            </div>
            {/* Glowing green online indicator dot with pulse animation effect */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4edea3] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#4edea3]"></span>
              </span>
              <span className="font-mono-code text-[11px] text-[#4edea3]">Live</span>
            </div>
          </div>

          {/* Exact Copy of DeveloperFeedCard populated with live state */}
          <div className="bg-[#10171e] border border-[#1f2b38] rounded-xl p-5 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
            {/* Top Section: Avatar, Name, Street / User Name, and Top-Right Role Badge */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={displayedPhotoURL}
                    alt={displayName}
                    className="w-12 h-12 rounded-lg object-cover border border-[#273646] shadow-sm flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_AVATAR;
                    }}
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-[#dde4dd] text-[15px] leading-snug">
                      {displayName}
                    </h3>
                    <p className="text-xs font-mono-code text-[#0EA5E9] mt-0.5 truncate">
                      {streetName}
                    </p>
                  </div>
                </div>

                {/* Role / Stack Badge in top right */}
                <span className="text-[11px] font-mono-code px-2.5 py-0.5 rounded bg-[#17212b] border border-[#273646] text-[#9fb0a5] tracking-wide flex-shrink-0">
                  {profession}
                </span>
              </div>

              {/* Bio Text: Fixed height with 3-line clamping */}
              <div className="h-[4.5rem] mb-4">
                <p className="text-xs font-body-sm text-[#8a9990] line-clamp-3 leading-relaxed">
                  {bio || 'Open to connecting with developers in the network.'}
                </p>
              </div>

              {/* Tech Stack Badges */}
              <div className="flex flex-wrap gap-1.5 mb-4 min-h-[30px]">
                {parsedSkills.map((skill, idx) => {
                  const isPrimary = idx === 0;
                  return (
                    <span
                      key={`${skill}-${idx}`}
                      className={`text-[11px] font-mono-code px-2.5 py-1 rounded border transition-colors ${isPrimary
                        ? 'bg-[#102a20] border-[#4edea3]/40 text-[#4edea3]'
                        : 'bg-[#161e27] border-[#263340] text-[#9fb0a5]'
                        }`}
                    >
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Bottom Section: Goal Container & Actions (Exact as in DeveloperFeedCard) */}
            <div className="space-y-3 pt-2 border-t border-[#1a2531]/80">
              {/* Goal / Availability Box using skill's first element */}
              <div className="bg-[#0b1015] border border-[#1d2732] rounded-md px-3 py-2 flex items-center justify-between text-xs font-mono-code">
                <div className="flex items-center gap-2 text-[#c2d0c6] truncate mr-2">
                  <span className="text-sm">{goalIcon}</span>
                  <span className="truncate">{goal}</span>
                </div>
                {/* Glowing live status indicator dot with pulse animation */}
                <span className="relative flex h-2 w-2 flex-shrink-0" title="Online now">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4edea3] opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4edea3]"></span>
                </span>
              </div>

              {/* Action Buttons: View Profile, Ignore, Connect */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex-1 py-1.5 px-2 text-xs font-mono-code text-[#7e8e83] hover:text-[#dde4dd] hover:bg-[#182029] rounded transition-colors text-center cursor-pointer truncate"
                >
                  View Profile
                </button>

                <button
                  type="button"
                  className="py-1.5 px-3 text-xs font-mono-code text-[#FC7C78] border border-[#FC7C78]/30 hover:border-[#FC7C78] hover:bg-[#FC7C78]/10 rounded transition-colors text-center cursor-pointer flex items-center justify-center gap-1"
                >
                  Ignore
                </button>

                <button
                  type="button"
                  className="flex-1 py-1.5 px-3 text-xs font-mono-code font-semibold rounded border border-[#2b5a45] bg-[#0f241c]/80 text-[#4edea3] hover:bg-[#4edea3] hover:text-[#000000] hover:border-[#4edea3] transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Connect
                </button>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-[11px] font-mono-code text-[#718076] text-center mt-6">
            This is how your card appears in the developer directory.
          </p>
        </div>
      </div>
    </div>
  );
}
