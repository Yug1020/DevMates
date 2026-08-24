import { useState, useMemo, useEffect } from 'react';
import DeveloperCard from './DeveloperCard';
import { API_BASE_URL } from "../util/constant";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { setNetworkList } from '../store/connectionSlice';

const INITIAL_DEVELOPERS = [
  {
    id: 1,
    name: 'Alex Chen',
    title: 'Sr. Systems Engineer',
    role: 'Backend',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    bio: 'Building high-throughput microservices. Obsessed with performance optimization and clean architecture. Looking to ment...',
    skills: ['Rust', 'Go', 'Kubernetes'],
    goalIcon: '🎯',
    goalText: 'Open Source Collab',
    hasLiveDot: true,
  },
  {
    id: 2,
    name: 'Sarah Jenkins',
    title: 'UX/UI Engineer',
    role: 'Frontend',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    bio: 'Bridging the gap between design and engineering. Passionate about accessibility, complex state manageme...',
    skills: ['React', 'TypeScript', 'Three.js'],
    goalIcon: '📚',
    goalText: 'Interview Prep',
    hasLiveDot: false,
  },
  {
    id: 3,
    name: 'David Okafor',
    title: 'Software Engineer',
    role: 'Fullstack',
    avatar:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
    bio: 'Transitioning from an enterprise background to web3. Enjoy building robust APIs and dabbling in smart...',
    skills: ['Python', 'Django', 'Solidity'],
    goalIcon: '🤝',
    goalText: 'Pair Programming',
    hasLiveDot: true,
  },
];

// const MORE_DEVELOPERS = [
//   {
//     id: 4,
//     name: 'Elena Rostova',
//     title: 'ML & AI Researcher',
//     role: 'AI / ML',
//     avatar:
//       'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
//     bio: 'Building autonomous LLM agents and high-throughput embedding inference pipelines. Interested in open-source AI projects.',
//     skills: ['Python', 'PyTorch', 'LangChain'],
//     goalIcon: '🧠',
//     goalText: 'AI Research Collab',
//     hasLiveDot: true,
//   },
//   {
//     id: 5,
//     name: 'Marcus Sterling',
//     title: 'Cloud Infrastructure Architect',
//     role: 'DevOps',
//     avatar:
//       'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
//     bio: 'Automating multi-cloud architectures with Terraform and GitOps. Looking to mentor developers on Kubernetes and zero-downtime CI/CD.',
//     skills: ['AWS', 'Terraform', 'Docker'],
//     goalIcon: '🚀',
//     goalText: 'Cloud Architecture',
//     hasLiveDot: true,
//   },
//   {
//     id: 6,
//     name: 'Maya Patel',
//     title: 'Senior Mobile Engineer',
//     role: 'Frontend',
//     avatar:
//       'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
//     bio: 'Crafting responsive mobile applications with smooth 60fps micro-interactions and offline-first database synchronization.',
//     skills: ['React', 'Flutter', 'Swift'],
//     goalIcon: '📱',
//     goalText: 'Pair Programming',
//     hasLiveDot: false,
//   },
// ];

export default function Connections() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedSkill, setSelectedSkill] = useState('All Skills');
  const [developers, setDevelopers] = useState(INITIAL_DEVELOPERS); //INITIAL_DEVELOPERS
  const [hasLoadedMore, setHasLoadedMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedDevProfile, setSelectedDevProfile] = useState(null);
  const dispatch = useDispatch();

  // const network = async() => {
  //   await axios
  //   .get(API_BASE_URL + "/connections/list", {withCredentials: true})
  //   .then((res) =>  dispatch(setNetworkList(res?.data)))
  //   .catch((err) => {err})
  // }
  console.log("dev", developers)

  // Handle Load More
  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setDevelopers((prev) => [...prev, ...developers]);
      setHasLoadedMore(true);
      setLoadingMore(false);
    }, 600);
  };

  // Handle Connection Request Feedback
  const handleConnect = (dev) => {
    setToastMessage(`Connection request sent to ${dev.name}!`);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  // Filter developers based on search, role, skill
  const filteredDevelopers = useMemo(() => {
    return developers.filter((dev) => {
      // Role filter
      if (selectedRole !== 'All Roles') {
        if (dev.role.toLowerCase() !== selectedRole.toLowerCase()) {
          return false;
        }
      }

      // Skill filter
      if (selectedSkill !== 'All Skills') {
        const hasSkill = dev.skills.some(
          (s) => s.toLowerCase() === selectedSkill.toLowerCase()
        );
        if (!hasSkill) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = dev.name.toLowerCase().includes(query);
        const matchesTitle = dev.title.toLowerCase().includes(query);
        const matchesBio = dev.bio.toLowerCase().includes(query);
        const matchesSkills = dev.skills.some((s) =>
          s.toLowerCase().includes(query)
        );
        const matchesRole = dev.role.toLowerCase().includes(query);
        if (
          !matchesName &&
          !matchesTitle &&
          !matchesBio &&
          !matchesSkills &&
          !matchesRole
        ) {
          return false;
        }
      }

      return true;
    });
  }, [developers, selectedRole, selectedSkill, searchQuery]);

  useEffect(() => {
    axios
    .get(API_BASE_URL + "/connections/list", {withCredentials: true})
    .then((res) => setDevelopers(res?.data)) //dispatch(setNetworkList(res?.data))
    .catch((err) => {err})
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0e13] text-[#dde4dd] flex font-body-sm selection:bg-[#4edea3]/20 selection:text-[#4edea3]">
      {/* Left Sidebar */}


      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Network Body / Page Container */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto overflow-y-auto">
          {/* Header Title Section with Filters */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-headline-lg text-[#dde4dd] tracking-tight">
                Developers Network
              </h1>``
              <p className="text-xs sm:text-sm font-mono-code text-[#7e8e83] mt-1.5">
                Find and chat with developers matching your stack and goals.
              </p>
            </div>

            {/* Filter Controls Toolbar */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Roles Dropdown */}
              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-3 py-1.5 pr-8 text-xs font-mono-code rounded border border-[#202932] bg-[#0e1318] text-[#c2d0c6] cursor-pointer hover:border-[#334250] focus:border-[#4edea3] focus:ring-0 appearance-none transition-colors"
                >
                  <option value="All Roles">All Roles</option>
                  <option value="Backend">Backend</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Fullstack">Fullstack</option>
                  <option value="DevOps">DevOps</option>
                  <option value="AI / ML">AI / ML</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#7e8e83]">
                  <span className="material-symbols-outlined text-sm">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Skills Dropdown */}
              <div className="relative">
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="px-3 py-1.5 pr-8 text-xs font-mono-code rounded border border-[#202932] bg-[#0e1318] text-[#c2d0c6] cursor-pointer hover:border-[#334250] focus:border-[#4edea3] focus:ring-0 appearance-none transition-colors"
                >
                  <option value="All Skills">All Skills</option>
                  <option value="Rust">Rust</option>
                  <option value="Go">Go</option>
                  <option value="Kubernetes">Kubernetes</option>
                  <option value="React">React</option>
                  <option value="TypeScript">TypeScript</option>
                  <option value="Three.js">Three.js</option>
                  <option value="Python">Python</option>
                  <option value="Django">Django</option>
                  <option value="Solidity">Solidity</option>
                  <option value="AWS">AWS</option>
                  <option value="Docker">Docker</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#7e8e83]">
                  <span className="material-symbols-outlined text-sm">
                    expand_more
                  </span>
                </div>
              </div>

              {/* More Filter Button */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('All Roles');
                  setSelectedSkill('All Skills');
                  setSearchQuery('');
                }}
                className="px-3 py-1.5 text-xs font-mono-code rounded border border-[#202932] bg-[#0e1318] text-[#c2d0c6] hover:text-[#dde4dd] hover:border-[#334250] flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Reset Filters"
              >
                <span className="material-symbols-outlined text-sm text-[#7e8e83]">
                  tune
                </span>
                <span>More</span>
              </button>
            </div>
          </div>

          {/* Developer Cards Grid */}
          {filteredDevelopers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDevelopers.map((dev) => (
                <DeveloperCard
                  key={dev.id}
                  developer={dev}
                  onConnect={handleConnect}
                  onViewProfile={(d) => setSelectedDevProfile(d)}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center border border-dashed border-[#202932] rounded-xl bg-[#0e1318]/50">
              <span className="material-symbols-outlined text-4xl text-[#7e8e83] mb-2">
                search_off
              </span>
              <p className="text-sm font-mono-code text-[#dde4dd]">
                No developers match the selected criteria
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('All Roles');
                  setSelectedSkill('All Skills');
                  setSearchQuery('');
                }}
                className="mt-3 text-xs font-mono-code text-[#4edea3] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Load More Section */}
          {/* {!hasLoadedMore && (
            <div className="flex items-center justify-center gap-4 text-xs font-mono-code text-[#7e8e83] py-10">
              <span className="w-16 h-px bg-[#1e2630]" />
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="hover:text-[#dde4dd] transition-colors cursor-pointer flex items-center gap-2 focus:outline-none"
              >
                {loadingMore ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin text-[#4edea3]">
                      progress_activity
                    </span>
                    <span>Loading Developers...</span>
                  </>
                ) : (
                  <span>Load More Developers</span>
                )}
              </button>
              <span className="w-16 h-px bg-[#1e2630]" />
            </div>
          )} */}
        </main>
      </div>

      {/* Profile Detail Modal */}
      {selectedDevProfile && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedDevProfile(null)}
        >
          <div
            className="w-full max-w-4/12 bg-[#12181f] border border-[#2c3744] rounded-xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-4 border-b border-[#1e2630] mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedDevProfile.photoURL}
                  alt={selectedDevProfile.name}
                  className="w-14 h-14 rounded-xl object-cover border border-[#2c3744]"
                />
                <div>
                  <h2 className="text-lg font-bold text-[#dde4dd]">
                    {selectedDevProfile.firstName + " " + selectedDevProfile.lastName}
                  </h2>
                  <p className="text-xs font-mono-code text-[#7e8e83]">
                    {selectedDevProfile.skills[0]}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDevProfile(null)}
                className="text-[#7e8e83] hover:text-[#dde4dd] text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono-code">
              <div>
                <span className="text-[#7e8e83] block mb-1">About</span>
                <p className="text-[#dde4dd] font-body-sm leading-relaxed">
                  {selectedDevProfile.bio}
                </p>
              </div>

              <div>
                <span className="text-[#7e8e83] block mb-1">Tech Stack</span>
                <div className="flex gap-1.5 flex-wrap">
                  {selectedDevProfile.skills.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded bg-[#161e27] border border-[#263340] text-[#4edea3]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[#7e8e83] block mb-1">Current Goal</span>
                <div className="bg-[#0b1015] border border-[#1e2833] rounded-md px-3 py-2 flex items-center gap-2 text-[#dde4dd]">
                  <span>{selectedDevProfile.goalIcon}</span>
                  <span>{selectedDevProfile.skills[1]}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#1e2630] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedDevProfile(null)}
                className="px-4 py-2 text-xs font-mono-code text-[#7e8e83] hover:text-[#dde4dd]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleConnect(selectedDevProfile);
                  setSelectedDevProfile(null);
                }}
                className="px-4 py-2 text-xs font-mono-code font-bold bg-[#4edea3] hover:bg-[#6ffbbe] text-[#000000] rounded transition-colors"
              >
                Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121c17] border border-[#4edea3]/40 text-[#4edea3] px-4 py-3 rounded-lg shadow-xl text-xs font-mono-code flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span className="material-symbols-outlined text-base">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
