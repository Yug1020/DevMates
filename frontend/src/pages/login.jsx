import { useEffect, useState } from 'react';
import { Link, replace, useNavigate} from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../store/userSlice';
import { API_BASE_URL } from '../util/constant';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const userInfo = async() => {
    try{
      const res = await axios.get(API_BASE_URL + "/verify", {withCredentials: true})
      if(res.status === 200){
        return navigate("/", {replace:true})
      }
    }
    catch(err){
      console.log("Unauthorized user:- ", err)
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await axios.post(
        API_BASE_URL + "/login",
        { email, password },
        { withCredentials: true }
      );
      if (res.status === 200) {
        if (typeof res.data === 'string' && (res.data.includes('Invalid') || res.data.includes('wrong'))) {
          setErrorMsg(res.data);
        } else {
          console.log("User Logged in Successfully!");
          dispatch(setUser(res.data));
          navigate("/");
        }
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data) {
        setErrorMsg(
          typeof error.response.data === 'string'
            ? error.response.data
            : error.response.data.message || 'Invalid email or password'
        );
      } else {
        setErrorMsg('Unable to connect to server. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=> {
    userInfo()
  },[])

  return (
    <div className="min-h-screen flex w-full bg-[#090b0e] text-zinc-100 font-sans">
      {/* Left Side: Visual / Brand Anchoring */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 overflow-hidden bg-[#070b09]">
        {/* Subtle Cyber Grid Background & Glowing Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1611]/80 via-[#050b08]/90 to-[#020403] z-0" />
        <div
          className="absolute inset-0 bg-cover bg-center mix-blend-color-dodge opacity-20 z-0 pointer-events-none"
          style={{
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDXCc2dN8c0FCiF_GC4VkJYqdemfg5g98HxY9aklHpARFfxsCbkjkhNRYA2-Ekezyv_jzmfhlf50CyxJ1T92Z54dzDeYzzJTR38NpI1QYzT_6W9N4y4fVUOy00nezDtY2-Ph5jtXU4FzHydaJhz1rVkkZ5wTL-JvGBKd8UovRIX-ntaIt3gHWvXPatomcEikkuAIrP6llz58aCgYU7Za4R7IgdJ7OeryJX_ukcH3sUYR04MxwGEjHx0')",
          }}
        />
        
        <div className="relative z-10 text-center flex flex-col items-center">
          {/* Logo Terminal Icon */}
          <div className="w-16 h-12  rounded-lg border border-[#34d399]/60 flex items-center justify-center text-[#34d399] font-mono text-2xl font-bold bg-[#34d399]/10 shadow-[0_0_15px_rgba(52,211,153,0.2)] mb-6">
            &gt;_
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight text-white mb-4">
            Welcome back to <span className="text-[#34d399] font-bold">DevMates</span>
          </h1>
          
          <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
            Reconnect with your network. Review pull requests, start pair programming sessions, and continue building together.
          </p>
          
          {/* Mock Terminal Card */}
          <div className="w-full bg-[#090e0c]/90 border border-zinc-800/80 rounded-xl p-5 text-left font-mono text-xs shadow-2xl relative">
            <div className="flex gap-1.5 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] opacity-80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] opacity-80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] opacity-80" />
            </div>
            <div className="space-y-2 text-zinc-400">
              <p className="flex items-center gap-1.5">
                <span className="text-[#34d399]">➜</span>
                <span className="text-zinc-500">~</span>
                <span>DevMates status</span>
              </p>
              <p>
                <span className="text-zinc-600">&gt;</span> Network connection: <span className="text-[#34d399]">Stable</span>
              </p>
              <p>
                <span className="text-zinc-600">&gt;</span> Active sessions: 142
              </p>
              <p className="text-[#34d399]">
                <span className="text-zinc-600">&gt;</span> Awaiting your login...
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#090b0e] relative min-h-screen">
        {/* Terminal Blinking Accent */}
        <div className="absolute top-8 left-8 font-mono text-xs text-zinc-500 flex items-center">
          <span className="text-[#34d399] mr-1.5">$</span>
          devmates connect
          <span className="w-1.5 h-3.5 bg-[#34d399] ml-1 animate-pulse" />
        </div>

        <div className="w-full max-w-9/12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-white tracking-tight mb-2">
              Initialize Session
            </h2>
            <p className="text-zinc-400 text-sm">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          {/* Feedback Alert */}
          {errorMsg && (
            <div className="mb-6 p-3 rounded bg-red-950/20 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="text-zinc-400 text-xs font-mono uppercase tracking-wider block mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                <input
                  id="email"
                  type="email"
                  placeholder="dev@example.com"
                  className="w-full bg-[#05070a] border border-zinc-800 text-white placeholder-zinc-600 text-sm rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-[#34d399] focus:ring-1 focus:ring-[#34d399]/30 transition-all font-mono"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-zinc-400 text-xs font-mono uppercase tracking-wider block" htmlFor="password">
                  Password
                </label>
                <a href="#" className="text-xs text-[#34d399] hover:underline font-mono">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-[#05070a] border border-zinc-800 text-white placeholder-zinc-600 text-sm rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-[#34d399] focus:ring-1 focus:ring-[#34d399]/30 transition-all font-mono"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#34d399] hover:bg-[#4ade80] text-black font-semibold text-sm rounded-lg py-3 flex items-center justify-center gap-2 transition-colors cursor-pointer mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Execute Login</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-zinc-400 text-sm text-center mt-8">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#34d399] hover:underline font-medium inline-flex items-center gap-1">
              Create one <span className="text-xs">→</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

