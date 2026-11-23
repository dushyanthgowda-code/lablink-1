import React from 'react';

/**
 * Accessible global loading skeleton for Next.js App Router
 */
export default function Loading() {
  return (
    <div 
      role="status" 
      aria-live="polite" 
      className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center p-6 text-white space-y-4"
    >
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      <p className="text-sm font-medium text-gray-300 animate-pulse">
        Initializing LabLink Campus Resource Network...
      </p>
      <span className="sr-only">Loading laboratory platform</span>
    </div>
  );
}
