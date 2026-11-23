import React from 'react';
import Link from 'next/link';
import { FlaskConical, ArrowLeft } from 'lucide-react';

/**
 * Accessible 404 page for missing laboratory routes
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-6 text-white">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-indigo-950/60 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto">
          <FlaskConical className="w-6 h-6" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-bold text-white">Laboratory Resource Not Found</h1>
        <p className="text-xs text-gray-400 leading-relaxed">
          The requested equipment catalog entry or booking reference does not exist or has been relocated to another campus facility.
        </p>
        <Link
          href="/"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold inline-flex items-center space-x-2 transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Return to Discovery Hub</span>
        </Link>
      </div>
    </div>
  );
}
