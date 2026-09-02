import { useState, useMemo, useEffect } from 'react';
import DeveloperFeedCard from './DeveloperFeedCard';
import { ProfilePopover } from './RequestCard';
import axios from 'axios';
import { API_BASE_URL } from '../util/constant';
import toast from 'react-hot-toast';

// const INITIAL_DEVELOPERS = [
//     {
//         _id: 'dev_1',
//         firstName: 'Alex',
//         lastName: 'Chen',
//         streetName: 'Sr. Systems Engineer',
//         email: 'alex.chen@devmates.io',
//         gender: 'male',
//         age: 28,
//         phone: 9876543210,
//         photoURL:
//             'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
//         bio: 'Building high-throughput microservices. Obsessed with performance optimization and clean architecture. Looking to mentor and collaborate on distributed systems.',
//         skills: ['Rust', 'Go', 'Kubernetes'],
//         isOnline: true,
//         createdAt: new Date('2026-08-20T10:00:00Z'),
//         updatedAt: new Date('2026-08-27T12:00:00Z'),
//     },
//     {
//         _id: 'dev_2',
//         firstName: 'Sarah',
//         lastName: 'Jenkins',
//         streetName: 'UX/UI Engineer',
//         email: 'sarah.j@devmates.io',
//         gender: 'female',
//         age: 26,
//         phone: 9876543211,
//         photoURL:
//             'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
//         bio: 'Bridging the gap between design and engineering. Passionate about accessibility, complex state management, and immersive 3D web interfaces.',
//         skills: ['React', 'TypeScript', 'Three.js'],
//         isOnline: false,
//         createdAt: new Date('2026-08-22T14:30:00Z'),
//         updatedAt: new Date('2026-08-27T12:00:00Z'),
//     },
//     {
//         _id: 'dev_3',
//         firstName: 'David',
//         lastName: 'Okafor',
//         streetName: 'Software Engineer',
//         email: 'david.okafor@devmates.io',
//         gender: 'male',
//         age: 29,
//         phone: 9876543212,
//         photoURL:
//             'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
//         bio: 'Transitioning from an enterprise background to web3. Enjoy building robust APIs and dabbling in smart contracts and decentralized protocols.',
//         skills: ['Python', 'Django', 'Solidity'],
//         isOnline: true,
//         createdAt: new Date('2026-08-24T09:15:00Z'),
//         updatedAt: new Date('2026-08-27T12:00:00Z'),
//     },
// ];

// const MORE_DEVELOPERS = [
//     {
//         _id: 'dev_4',
//         firstName: 'Elena',
//         lastName: 'Rostova',
//         streetName: 'ML & AI Researcher',
//         email: 'elena.rostova@devmates.io',
//         gender: 'female',
//         age: 27,
//         phone: 9876543213,
//         photoURL:
//             'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
//         bio: 'Building autonomous LLM agents and high-throughput embedding inference pipelines. Interested in open-source AI projects and collaborative research.',
//         skills: ['Python', 'PyTorch', 'LangChain'],
//         isOnline: true,
//         createdAt: new Date('2026-08-25T11:00:00Z'),
//         updatedAt: new Date('2026-08-27T12:00:00Z'),
//     },
//     {
//         _id: 'dev_5',
//         firstName: 'Marcus',
//         lastName: 'Sterling',
//         streetName: 'Cloud Infrastructure Architect',
//         email: 'marcus.s@devmates.io',
//         gender: 'male',
//         age: 32,
//         phone: 9876543214,
//         photoURL:
//             'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
//         bio: 'Automating multi-cloud architectures with Terraform and GitOps. Looking to mentor developers on Kubernetes and zero-downtime deployments.',
//         skills: ['AWS', 'Terraform', 'Docker'],
//         isOnline: true,
//         createdAt: new Date('2026-08-26T08:20:00Z'),
//         updatedAt: new Date('2026-08-27T12:00:00Z'),
//     },
//     {
//         _id: 'dev_6',
//         firstName: 'Maya',
//         lastName: 'Patel',
//         streetName: 'Senior Mobile Engineer',
//         email: 'maya.patel@devmates.io',
//         gender: 'female',
//         age: 25,
//         phone: 9876543215,
//         photoURL:
//             'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
//         bio: 'Crafting responsive mobile applications with smooth 60fps micro-interactions and offline-first database synchronization.',
//         skills: ['React Native', 'Flutter', 'Swift'],
//         isOnline: false,
//         createdAt: new Date('2026-08-26T16:45:00Z'),
//         updatedAt: new Date('2026-08-27T12:00:00Z'),
//     },
// ];

export default function Home() {
    const [developersList, setDevelopersList] = useState([]);
    const [selectedRole, setSelectedRole] = useState('All Roles');
    const [selectedSkill, setSelectedSkill] = useState('All Skills');
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [hasLoadedMore, setHasLoadedMore] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Handle Connect Click Feedback
    const handleConnect = (dev) => {
        axios.
        post(API_BASE_URL + "/connections/send/connect/" + dev._id, {}, { withCredentials: true })
        .then(
            toast.success(`Connection request sent to ${dev.firstName || " " + " " + dev.lastName || ""}!`, {
              style: {
                background: '#121c17',
                border: '1px solid rgba(78, 222, 163, 0.4)',
                color: '#4edea3',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'monospace',
              },
              iconTheme: {
                primary: '#4edea3',
                secondary: '#121c17',
              },
            }),
            setTimeout(() => {
                setToastMessage('')
            }, 3500)
        )
        .catch((err) => console.log("err", err))
    };

    // Handle Ignore Click Feedback
    const handleIgnore = (dev) => {
        axios
        .post(API_BASE_URL + "/connections/send/ignore/" + dev._id, {}, { withCredentials: true })
        .then(
            setDevelopersList((prev) => prev.filter((d) => d._id !== dev._id)),
            setToastMessage(`Ignored ${dev.firstName || "" + " " + dev.lastName || ""}`),
            setTimeout(() => {
                setToastMessage('');
            }, 3000)
        )
        .catch((err) => console.log("err", err))
    };

// Handle Load More Developers
// const handleLoadMore = () => {
//     setLoadingMore(true);
//     setTimeout(() => {
//         setDevelopersList((prev) => [...prev]);
//         setHasLoadedMore(true);
//         setLoadingMore(false);
//     }, 500);
// };

// Filter developers based on Role and Skill selections
const filteredDevelopers = useMemo(() => {
    return developersList.filter((dev) => {
        // Role filter check
        if (selectedRole !== 'All Roles') {
            const role = selectedRole.toLowerCase();
            const street = (dev.streetName || '').toLowerCase();
            const primarySkill = (dev.skills?.[0] || '').toLowerCase();
            const matchesRole =
                street.includes(role) ||
                primarySkill.includes(role) ||
                (dev.skills || []).some((s) => s.toLowerCase().includes(role));
            if (!matchesRole) return false;
        }

        // Skill filter check
        if (selectedSkill !== 'All Skills') {
            const skill = selectedSkill.toLowerCase();
            const hasSkill = (dev.skills || []).some((s) => s.toLowerCase().includes(skill));
            if (!hasSkill) return false;
        }

        return true;
    });
}, [developersList, selectedRole, selectedSkill]);

useEffect(() => {
    axios
        .get(API_BASE_URL + "/user/feed", { withCredentials: true })
        .then((res) => { setDevelopersList(res.data)})
}, [])

return (
    <div className="min-h-screen bg-[#0a0e13] text-[#dde4dd] flex flex-col font-body selection:bg-[#4edea3]/20 selection:text-[#4edea3]">
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
            {/* Header Title Section with Filters matching Stitch design */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#dde4dd]">
                        Discover Developers
                    </h1>
                    <p className="text-xs sm:text-sm font-mono-code text-[#7e8e83] mt-1.5">
                        Find and connect with developers matching your stack and goals.
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
                            <option value="Mobile">Mobile</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#7e8e83]">
                            <span className="material-symbols-outlined text-sm">expand_more</span>
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
                            <option value="PyTorch">PyTorch</option>
                            <option value="AWS">AWS</option>
                            <option value="Terraform">Terraform</option>
                            <option value="Docker">Docker</option>
                            <option value="Flutter">Flutter</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#7e8e83]">
                            <span className="material-symbols-outlined text-sm">expand_more</span>
                        </div>
                    </div>

                    {/* More Filter Button with tune icon */}
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedRole('All Roles');
                            setSelectedSkill('All Skills');
                        }}
                        className="px-3 py-1.5 text-xs font-mono-code rounded border border-[#202932] bg-[#0e1318] text-[#c2d0c6] hover:text-[#dde4dd] hover:border-[#334250] flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Reset Filters"
                    >
                        <span className="material-symbols-outlined text-sm text-[#7e8e83]">tune</span>
                        <span>More</span>
                    </button>
                </div>
            </div>

            {/* Developer Cards Grid */}
            {filteredDevelopers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDevelopers.map((developer, index) => (
                        <DeveloperFeedCard
                            key={developer._id}
                            developer={developer}
                            index={index}
                            onConnect={handleConnect}
                            onIgnore={handleIgnore}
                            onViewProfile={(dev) => setSelectedProfile(dev)}
                        />
                    ))}
                </div>
            ) : (
                <div className="p-12 text-center border border-dashed border-[#202932] rounded-xl bg-[#0e1318]/50">
                    <span className="material-symbols-outlined text-4xl text-[#7e8e83] mb-2">
                        search_off
                    </span>
                    <p className="text-sm font-mono-code text-[#dde4dd]">
                        No developers match the selected filters.
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedRole('All Roles');
                            setSelectedSkill('All Skills');
                        }}
                        className="mt-3 text-xs font-mono-code text-[#4edea3] hover:underline"
                    >
                        Clear filters
                    </button>
                </div>
            )}

            {/* Load More Developers Section */}
            {/* {!hasLoadedMore && (
                <div className="flex items-center justify-center gap-4 text-xs font-mono-code text-[#7e8e83] py-12">
                    <span className="w-16 sm:w-24 h-px bg-[#1e2630]" />
                    <button
                        type="button"
                        // onClick={handleLoadMore}
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
                    <span className="w-16 sm:w-24 h-px bg-[#1e2630]" />
                </div>
            )} */}
        </main>

        {/* Profile Detail Popover using ProfilePopover from RequestCard */}
        {selectedProfile && (
            <ProfilePopover
                request={selectedProfile}
                onClose={() => setSelectedProfile(null)}
            />
        )}

        {/* Floating Toast Notification */}
        {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 bg-[#121c17] border border-[#4edea3]/40 text-[#4edea3] px-4 py-3 rounded-lg shadow-xl text-xs font-mono-code flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>{toastMessage}</span>
            </div>
        )}
    </div>
);
}
