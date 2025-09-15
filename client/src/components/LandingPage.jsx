import React from 'react';

const LandingPage = ({ user, onSignIn }) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gray-50">
    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
      Interview Drills
    </h1>
    <p className="text-lg text-gray-600 mb-8 max-w-md">
      Prepare for your technical interviews with focused, bite-sized drills.
    </p>

    {!user ? (
      <>
        <button
          onClick={onSignIn}
          className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          Sign in with Google
        </button>
      </>
    ) : (
      <p className="text-green-600 font-semibold">
        Welcome back, {user.name}!
      </p>
    )}
  </div>
);

export default LandingPage;
