import React from 'react';

const LandingPage = ({ user, onSignIn }) => (
  <div className="relative flex flex-col items-center justify-center min-h-screen px-6 py-12 text-center bg-slate-50 overflow-hidden font-inter animate-fade-in">
    {/* DECORATIVE ELEMENTS */}
    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
    <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-100 rounded-full blur-3xl opacity-40 translate-y-1/3 -translate-x-1/3"></div>

    {/* CONTENT CONTAINER */}
    <div className="relative max-w-2xl px-8 flex flex-col items-center">
      <div className="w-16 h-16 gradient-bg flex items-center justify-center rounded-3xl shadow-2xl mb-12 rotate-6">
        <span className="text-white text-3xl font-black">D</span>
      </div>

      <h1 className="text-6xl md:text-7xl font-black text-slate-900 mb-6 font-outfit tracking-tight">
        Master <span className="gradient-text">Interview</span> Drills
      </h1>

      <p className="text-xl text-slate-600 mb-12 font-medium leading-relaxed max-w-xl">
        Level up your technical coding skills with expert-crafted, bite-sized interview drills. From algorithms to systems design.
      </p>

      {!user ? (
        <a
          href={onSignIn}
          className="group relative px-10 py-5 rounded-2xl bg-blue-600 font-bold text-white text-xl shadow-2xl hover:bg-blue-700 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center space-x-3 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent transition-opacity opacity-0 group-hover:opacity-100"></div>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google Logo"
            className="w-6 h-6 rounded-full bg-white p-1 shadow-sm"
          />
          <span className="tracking-tight">Get Started with Google</span>
        </a>
      ) : (
        <p className="px-8 py-3 bg-green-50 text-green-700 font-bold border-2 border-green-200 rounded-2xl animate-bounce">
          ✨ Welcome, {user.name}! Let's start drilling!
        </p>
      )}

      {/* ADMIN PORTAL LINK */}
      <div className="mt-8 flex items-center space-x-2 text-slate-400 font-bold text-sm">
        <span className="opacity-50 italic">Are you an administrator?</span>
        <a
          href="/admin-login"
          className="text-purple-600 hover:text-purple-800 hover:underline transition-all"
        >
          Access Admin Portal
        </a>
      </div>

      {/* FOOTER METRICS */}
      <div className="mt-16 flex items-center space-x-12 opacity-40 grayscale hover:grayscale-0 transition-all">
        <div className="flex flex-col">
          <span className="text-2xl font-black">2.5K+</span>
          <span className="text-sm font-bold uppercase tracking-widest">Questions</span>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-black">4.9/5</span>
          <span className="text-sm font-bold uppercase tracking-widest">Rating</span>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-black">50K+</span>
          <span className="text-sm font-bold uppercase tracking-widest">Drills</span>
        </div>
      </div>
    </div>
  </div>
);

export default LandingPage;
