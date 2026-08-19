import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { API_BASE_URL } from '../util/constant';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const navigate = useNavigate();
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API_BASE_URL + "/login", {email, password});
      if(res.status === 200){
        console.log("User Logged in Successfully!");
        // navigate("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGitHubLogin = () => {
    console.log('Authenticating with GitHub...');
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
                className="w-full flex justify-center py-sm px-md border border-transparent rounded-DEFAULT shadow-sm font-mono-label text-mono-label font-bold text-[#000000] bg-primary hover:bg-primary-fixed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-surface transition-colors"
                type="submit"
              >
                <span className="material-symbols-outlined mr-sm text-[20px]">
                  login
                </span>
                Execute Login
              </button>
              <div className="relative flex py-sm items-center">
                <div className="flex-grow border-t border-outline-variant" />
                <span className="flex-shrink-0 mx-sm text-on-surface-variant font-mono-label text-mono-label text-[11px] uppercase tracking-widest">
                  Or
                </span>
                <div className="flex-grow border-t border-outline-variant" />
              </div>
              <button
                className="w-full flex justify-center py-sm px-md border border-outline-variant rounded-DEFAULT shadow-sm font-mono-label text-mono-label text-on-surface bg-transparent hover:bg-surface-container hover:border-outline transition-colors"
                type="button"
                onClick={handleGitHubLogin}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 mr-sm"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    fillRule="evenodd"
                  />
                </svg>
                Authenticate with GitHub
              </button>
            </div>
          </form>
          <p className="mt-lg text-center font-body-sm text-body-sm text-on-surface-variant">
            Don't have an account?{' '}
            <a
              className="font-medium text-secondary hover:text-secondary-fixed transition-colors inline-flex items-center gap-1 group"
              href="#"
            >
              Create one
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
