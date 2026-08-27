import { useMemo, useState } from 'react';
import { API_BASE_URL } from '../util/constant';
import { ProfilePopover, ReceivedRequestCard, SentRequestCard } from './RequestCard';
import { useEffect } from 'react';
import axios from "axios"

const receivedRequests = [
  {
    id: 'sarah',
    name: 'Sarah Jenkins',
    handle: '@sjenks_dev',
    receivedAt: '2h ago',
    message: "Hey! Saw your recent repo on distributed caching. I'm working on something similar and would love to compare notes.",
    skills: ['Rust', 'Distributed Systems'],
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 'marcus',
    name: 'Marcus Chen',
    handle: '@mchen_ui',
    receivedAt: '1d ago',
    message: 'Looking for a backend engineer for a weekend project. Your Go skills look solid. Interested in collaborating?',
    skills: ['Go', 'PostgreSQL', 'GraphQL'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 'priya',
    name: 'Priya Nair',
    handle: '@priyanair',
    receivedAt: '3d ago',
    message: 'Your open-source work caught my eye. Would you be up for discussing a small accessibility tooling idea?',
    skills: ['React', 'Accessibility'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
  },
];

const sentRequests = [
  {
    id: 'alex',
    firstName: 'Alex Rodriguez',
    streeName: '@alex_r',
    createdAt: '3 days ago',
    status: 'Pending',
    skills: ['Kubernetes', 'DevOps'],
    bio: 'Cloud infrastructure engineer focused on dependable delivery pipelines and practical Kubernetes operations.',
    photoURL: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 'dataeng',
    firstName: 'DataEng Collective',
    streeName: '@dataeng_col',
    createdAt: '1 week ago',
    status: 'Accepted',
    skills: ['Apache Spark', 'Python'],
    bio: 'A community of data engineers building open learning resources and collaborative data-platform projects.',
    photoURL: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 'kavita',
    firstName: 'Kavita Patel',
    streeName: '@kavitadev',
    createdAt: '2 weeks ago',
    status: 'Pending',
    skills: ['VectorDB', 'TypeScript'],
    bio: 'Full-stack developer exploring developer tooling, semantic search, and approachable TypeScript APIs.',
    photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
  },
];

export default function Requests() {
  const [activeTab, setActiveTab] = useState('received');
  const [query, setQuery] = useState('');
  const [inbound, setInbound] = useState([]);
  const [outbound, setOutbound] = useState([]);
  const [profile, setProfile] = useState(null);

  // const getActiveRequests = () => {
  //     if (activeTab === "received"){
  //       axios
  //       .get(API_BASE_URL + "/connections/receivedList", {withCredentials:true})
  //       .then((res) => {setInbound(res?.data)})
  //       .catch((err) => {console.log(err)})
  //     }
  //     else{
  //       axios
  //       .get(API_BASE_URL + "connections/sentList", {withCredentials: true})
  //       .then((res) => {setOutbound(res?.data)})
  //       .catch((err) => {console.log(err)})
  //     }
  // }


  const activeRequests = activeTab === 'received' ? inbound : outbound;
  const filteredRequests = useMemo(
    () => activeRequests.filter((request) => request.firstName.toLowerCase().includes(query.trim().toLowerCase())),
    [activeRequests, query]
  );

  const acceptingInbound = (id) => {
    axios
    .post(API_BASE_URL + "/connections/received/accept/" + id, {}, {withCredentials: true})
    .then(setInbound((requests) => requests.filter((request) => request.id !== id)))
    .catch((err) => {console.log(err)})  
  };

  const rejectingInbound = (id) => {
    axios
    .post(API_BASE_URL + "/connections/received/reject/" + id, {}, {withCredentials: true})
    .then(setInbound((requests) => requests.filter((request) => request.id !== id)))
    .catch((err) => {console.log(err)})
  }

  const takeBackReq = (id) => {
    axios
    .post(API_BASE_URL + "/connections/send/pass/" + id, {}, {withCredentials: true})
    .then(setOutbound((requests) => requests.filter((request) => request.id !== id)))
    .catch((err) => {console.log(err)})
  }

  useEffect(() => {
      if (activeTab === "received"){
        axios
        .get(API_BASE_URL + "/connections/receivedList", {withCredentials:true})
        .then((res) => {setInbound(res?.data)})
        .catch((err) => {console.log(err)})
      }
      if(activeTab === "sent"){
        axios
        .get(API_BASE_URL + "/connections/sentList", {withCredentials: true})
        .then((res) => {setOutbound(res?.data), console.log(res?.data)})
        .catch((err) => {console.log(err)})
      }    
  },[activeTab])


  return (
    <div className="min-h-screen bg-[#0a0f0c] text-[#dde4dd]">
      <header className="border-b border-[#26342c] px-6 py-8 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-[#e0e8e1] sm:text-4xl">
                Connection Requests
                <span className="h-6 w-3 bg-[#4edea3]" aria-hidden="true" />
              </h1>
              <p className="mt-2 text-sm text-[#aebdb2] sm:text-base">Manage your inbound and outbound developer network connections.</p>
            </div>
            <label className="relative block w-full max-w-xs">
              <span className="sr-only">Search requests by name</span>
              <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-[#8da096]">search</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter requests..."
                className="w-full rounded-sm border border-[#3a4840] bg-[#101713] py-2.5 pl-10 pr-3 font-mono-code text-sm text-[#dce6df] outline-none placeholder:text-[#89998f] focus:border-[#4edea3]"
              />
            </label>
          </div>
          <div className="mt-7 flex gap-7 border-b border-[#26342c]">
            <button
              type="button"
              onClick={() => setActiveTab('received')}
              className={`relative pb-4 font-mono-code text-sm transition-colors ${activeTab === 'received' ? 'text-[#4edea3]' : 'text-[#aebdb2] hover:text-[#e0e8e1]'}`}
            >
              Received
              <span className="ml-2 rounded-sm bg-[#164330] px-2 py-0.5 text-[11px] text-[#5eecad]">{inbound.length}</span>
              {activeTab === 'received' && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[#4edea3]" />}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sent')}
              className={`relative pb-4 font-mono-code text-sm transition-colors ${activeTab === 'sent' ? 'text-[#4edea3]' : 'text-[#aebdb2] hover:text-[#e0e8e1]'}`}
            >
              Sent
              {activeTab === 'sent' && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[#4edea3]" />}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 sm:px-10">
        {filteredRequests.length ? (
          activeTab === 'received' ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {filteredRequests.map((request) => (
                <ReceivedRequestCard key={request._id} request={request} onAccept={acceptingInbound} onReject={rejectingInbound} />
              ))}
            </div>
          ) : (
            <div className="max-w-5xl overflow-hidden rounded-lg border border-[#29382f] bg-[#101713]">
              {filteredRequests.map((request) => (
                <SentRequestCard
                  key={request._id}
                  request={request}
                  onViewProfile={setProfile}
                  onCancel={takeBackReq}
                />
              ))}
            </div>
          )
        ) : (
          <div className="rounded-lg border border-dashed border-[#3a4a40] bg-[#101713] px-6 py-16 text-center">
            <span className="material-symbols-outlined text-4xl text-[#7e9184]">search_off</span>
            <p className="mt-3 text-sm text-[#b9c9be]">No {activeTab} requests match &quot;{query}&quot;.</p>
          </div>
        )}
      </main>

      <ProfilePopover request={profile} onClose={() => setProfile(null)} />
    </div>
  );
}

