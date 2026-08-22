import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';

import { API_BASE_URL } from '../util/constant';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const dispatch = useDispatch();
  
  const handleSubmit = async(e) => {
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
          navigate("/home");
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

  return (
    <div className="min-h-screen flex w-full">
      {/* Left Side: Visual / Brand Anchoring */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface-container border-r border-outline-variant flex-col items-center justify-center p-xl overflow-hidden">
        {/* Subtle Code Pattern Background Placeholder */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen pointer-events-none z-0"
          data-alt="A dark, abstract representation of a coding environment. Subtle, glowing emerald green geometric lines intersecting over a deep charcoal background, resembling a futuristic IDE or data flow. Minimalist, professional, and technical aesthetic. No text."
          style={{
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDXCc2dN8c0FCiF_GC4VkJYqdemfg5g98HxY9aklHpARFfxsCbkjkhNRYA2-Ekezyv_jzmfhlf50CyxJ1T92Z54dzDeYzzJTR38NpI1QYzT_6W9N4y4fVUOy00nezDtY2-Ph5jtXU4FzHydaJhz1rVkkZ5wTL-JvGBKd8UovRIX-ntaIt3gHWvXPatomcEikkuAIrP6llz58aCgYU7Za4R7IgdJ7OeryJX_ukcH3sUYR04MxwGEjHx0')",
          }}
        />
        <div className="relative z-10 max-w-lg text-center flex flex-col items-center gap-lg">
          <div className="flex items-center gap-sm text-primary mb-xl">
            <span
              className="material-symbols-outlined text-[48px]"
              data-weight="fill"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              terminal
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">
            Welcome back to <span className="text-primary">DevMates</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mx-auto">
            Reconnect with your network. Review pull requests, start pair programming sessions, and continue building together.
          </p>
          {/* Mock Terminal Output decorative element */}
          <div className="mt-xl w-full max-w-md bg-[#0D1117] border border-outline-variant rounded-DEFAULT p-md text-left font-mono-code text-mono-code text-on-surface-variant shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-xs mb-sm pb-sm border-b border-[#30363D]">
              <div className="w-3 h-3 rounded-full bg-error" />
              <div className="w-3 h-3 rounded-full bg-secondary" />
              <div className="w-3 h-3 rounded-full bg-primary" />
            </div>
            <div className="opacity-70">
              <p>
                <span className="text-primary">➜</span> ~ DevMates status
              </p>
              <p className="mt-xs text-secondary">
                &gt; Network connection: <span className="text-primary">Stable</span>
              </p>
              <p className="mt-xs">&gt; Active sessions: 142</p>
              <p className="mt-xs">&gt; Awaiting your login...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-margin-mobile md:px-margin-desktop py-xl bg-surface relative">
        {/* Mobile Header / Decorative Terminal Accent */}
        <div className="absolute top-0 left-0 w-full p-md flex items-center justify-between border-b border-outline-variant lg:border-none bg-surface-container lg:bg-transparent z-10">
          <div className="lg:hidden flex items-center gap-sm text-primary">
            <span
              className="material-symbols-outlined"
              data-weight="fill"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              terminal
            </span>
            <span className="font-headline-md text-headline-md">DevMates</span>
          </div>
          <div className="font-mono-label text-mono-label text-secondary hidden md:flex items-center gap-xs ml-auto lg:ml-0">
            <span className="opacity-50">$</span> devmates connect
            <span className="w-2 h-4 bg-secondary inline-block terminal-blink ml-1 align-middle" />
          </div>
        </div>

        <div className="w-full max-w-md mx-auto mt-xl lg:mt-0">
          <div className="mb-lg">
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-sm">
              Initialize Session
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Enter your credentials to access your dashboard.
            </p>
          </div>
          {/* Feedback Alert */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded bg-[#ffdad6]/10 border border-[#ffb4ab]/30 text-[#ffb4ab] text-xs font-mono-code flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form className="space-y-md" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <label
                className="block font-mono-label text-mono-label text-on-surface mb-xs"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-on-surface-variant opacity-70">
                    mail
                  </span>
                </div>
                <input
                  className="block w-full pl-xl pr-sm py-sm border rounded-DEFAULT font-mono-code text-mono-code transition-colors focus:ring-0"
                  id="email"
                  name="email"
                  placeholder="dev@example.com"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-xs">
                <label
                  className="block font-mono-label text-mono-label text-on-surface"
                  htmlFor="password"
                >
                  Password
                </label>
                <a
                  className="font-body-sm text-body-sm text-secondary hover:text-secondary-fixed transition-colors"
                  href="#"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-on-surface-variant opacity-70">
                    lock
                  </span>
                </div>
                <input
                  className="block w-full pl-xl pr-sm py-sm border rounded-DEFAULT font-mono-code text-mono-code transition-colors focus:ring-0"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-sm flex flex-col gap-sm">
              <button
                disabled={loading}
                className="w-full flex items-center justify-center py-sm px-md border border-transparent rounded-DEFAULT shadow-sm font-mono-label text-mono-label font-bold text-[#000000] bg-primary hover:bg-primary-fixed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                type="submit"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined mr-sm text-[20px] animate-spin">
                      progress_activity
                    </span>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined mr-sm text-[20px]">
                      login
                    </span>
                    Execute Login
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="mt-lg text-center font-body-sm text-body-sm text-on-surface-variant">
            Don't have an account?{' '}
            <Link
              className="font-medium text-secondary hover:text-secondary-fixed transition-colors inline-flex items-center gap-1 group"
              to="/signup"
            >
              Create one
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
