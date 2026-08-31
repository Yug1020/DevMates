import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';
import { API_BASE_URL } from '../util/constant.js';
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
  {
    name: 'Dev',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
  },
];

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

  // Form State adhering to userSchema
  const [firstName, setFirstName] = useState(reduxUser?.firstName || 'Alex');
  const [lastName, setLastName] = useState(reduxUser?.lastName || 'Chen');
  const [streetName, setStreetName] = useState(reduxUser?.streetName || 'Alex_Dev');
  const [phone, setPhone] = useState(reduxUser?.phone ? String(reduxUser.phone) : '9876543210');
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

  // Popover State for Profile Picture URL
  const [showAvatarPopover, setShowAvatarPopover] = useState(false);
  const [tempPhotoURL, setTempPhotoURL] = useState(photoURL);

  // Parse skills from comma-separated string
  const parsedSkills = skillsInput
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const displayName =
    [firstName, lastName].filter(Boolean).join(' ') || streetName || 'Developer';
  const primarySkill = parsedSkills[0] || 'Developer';
  const goalIcon = getGoalIcon(primarySkill);

  // Handle saving profile picture from popover
  const handleSaveAvatar = () => {
    setPhotoURL(tempPhotoURL || DEFAULT_AVATAR);
    setShowAvatarPopover(false);
    if (onToast) onToast('Profile picture updated!');
  };

  // Handle Save Changes
  // const handleSaveChanges = (e) => {
  //   e.preventDefault();
  //   // const updatedUser = {
  //   //   ...(reduxUser || {}),
  //   //   streetName,
  //   //   phone: Number(phone) || phone,
  //   //   bio,
  //   //   skills: parsedSkills,
  //   //   photoURL,
  //   // };

  //   axios
  //     .patch(API_BASE_URL + "/user/profile/update", { "streetName": streetName, "phone": phone, "photoURL": photoURL, "skills": [...parsedSkills], "bio": bio }, { withCredentials: true })
  //     .then(
  //       dispatch(setUser({
  //         ...(reduxUser || {}),
  //         streetName,
  //         phone: Number(phone) || phone,
  //         bio,
  //         skills: parsedSkills,
  //         photoURL,
  //       })),
  //       onToast('Profile changes saved successfully!')
  //     )
  //     .catch(error => {
  //       console.log(error);
  //       if (onToast) onToast('Failed to save profile changes!');
  //     });
  // };

const handleSaveChanges = async (e) => { // 1. Add 'async' to the function definition
  e.preventDefault();


  try {
    // 2. Tell JavaScript to pause here and 'await' the API response
    await axios.patch(API_BASE_URL + "/user/profile/update", { 
      "streetName":streetName, 
      "phone":phone, 
      "photoURL":photoURL, 
      "skills":[...parsedSkills], 
      "bio":bio 
    }, { withCredentials: true });

    // 3. This code ONLY runs after the await line successfully finishes!
    dispatch(setUser({
      ...(reduxUser || {}),
      streetName,
      phone: Number(phone) || phone,
      bio,
      skills: parsedSkills,
      photoURL,
    }));
    
    if (onToast) onToast('Profile changes saved successfully!');

  } catch (error) {
    // 4. If the await line fails, JavaScript jumps straight down here 🛑
    console.log(error);
    if (onToast) onToast('Failed to save profile changes!');
  }
};  

  // Handle Cancel / Reset to original values
  const handleCancel = () => {
    setFirstName(reduxUser?.firstName || 'Alex');
    setLastName(reduxUser?.lastName || 'Chen');
    setStreetName(reduxUser?.streetName || 'Alex_Dev');
    setPhone(reduxUser?.phone ? String(reduxUser.phone) : '9876543210');
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
            <div className="flex items-center gap-4 relative pb-2">
              <img
                src={photoURL || DEFAULT_AVATAR}
                alt="Profile Avatar"
                className="w-16 h-16 rounded-xl object-cover border border-[#273646] shadow-sm flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_AVATAR;
                }}
              />

              <div className="flex-1">
                <button
                  type="button"
                  onClick={() => {
                    setTempPhotoURL(photoURL);
                    setShowAvatarPopover(true);
                  }}
                  className="px-3.5 py-1.5 text-xs font-mono-code border border-[#295c73] hover:border-[#38bdf8] text-[#7dd3fc] hover:bg-[#0c2231] rounded transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">photo_camera</span>
                  <span>Change Profile Picture</span>
                </button>
                {/* <p className="text-[11px] font-mono-code text-[#718076] mt-1.5">
                  JPG, GIF or PNG. Max size of 800K
                </p> */}
              </div>

              {/* Profile Picture URL Popover (referencing signUp.jsx:L270-L354) */}
              {showAvatarPopover && (
                <div className="absolute left-0 sm:left-20 top-20 z-50 w-72 sm:w-80 bg-[#0e1511] border border-[#3c4a42] rounded-xl p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
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
                      className="text-[#86948a] hover:text-[#dde4dd] text-sm p-1"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Live Thumbnail & Presets */}
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={tempPhotoURL || DEFAULT_AVATAR}
                      alt="Preview"
                      className="w-12 h-12 rounded-lg object-cover border border-[#3c4a42]"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_AVATAR;
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
                            className="px-2 py-0.5 text-[10px] font-mono-code bg-[#1a211d] hover:bg-[#242c27] text-[#4edea3] border border-[#3c4a42] rounded cursor-pointer"
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
                      className="w-full px-2.5 py-1.5 text-xs font-mono-code rounded border border-[#30363D] bg-[#0D1117] text-[#dde4dd] focus:border-[#4edea3] outline-none"
                    />
                  </div>

                  {/* Popover Action Buttons */}
                  <div className="flex justify-end gap-2 pt-2 border-t border-[#242c27]">
                    <button
                      type="button"
                      onClick={() => {
                        setTempPhotoURL(DEFAULT_AVATAR);
                      }}
                      className="px-2.5 py-1 text-xs text-[#86948a] hover:text-[#dde4dd] font-mono-code cursor-pointer"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveAvatar}
                      className="px-3 py-1 text-xs font-mono-code font-semibold bg-[#4edea3] hover:bg-[#6ffbbe] text-[#000000] rounded transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
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
                className="px-5 py-2 text-xs font-mono-code font-bold bg-[#4edea3] hover:bg-[#6ffbbe] text-[#000000] rounded transition-all shadow-[0_2px_12px_rgba(78,222,163,0.25)] cursor-pointer active:scale-[0.98]"
              >
                Save Changes
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
                    src={photoURL || DEFAULT_AVATAR}
                    alt={displayName}
                    className="w-12 h-12 rounded-lg object-cover border border-[#273646] shadow-sm flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_AVATAR;
                    }}
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-[#dde4dd] text-[15px] leading-snug truncate">
                      {displayName}
                    </h3>
                    <p className="text-xs font-mono-code text-[#0EA5E9] mt-0.5 truncate">
                      {streetName || primarySkill}
                    </p>
                  </div>
                </div>

                {/* Role / Stack Badge in top right */}
                <span className="text-[11px] font-mono-code px-2.5 py-0.5 rounded bg-[#17212b] border border-[#273646] text-[#9fb0a5] tracking-wide flex-shrink-0">
                  {primarySkill}
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
                  <span className="truncate">{primarySkill}</span>
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
