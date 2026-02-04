'use client';

import { signIn } from 'next-auth/react';

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
        <p className="text-gray-600 text-center mb-8">Sign in to track your expenses</p>
        
        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 rounded-lg px-6 py-3 text-gray-700 font-semibold hover:bg-gray-50 transition"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="20" fill="currentColor">
              G
            </text>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
