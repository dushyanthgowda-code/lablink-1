'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Root Error Boundary for graceful fault tolerance
 */
export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('LabLink System Error captured by boundary:', error);
  }, [error]);

  return (
    <div 
      role="alert" 
      aria-live="assertive"
      className="min-h-screen bg-[#090d16] flex items-center justify-center p-6 text-white"
    >
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-bold text-white">Temporary Application Error</h1>
        <p className="text-xs text-gray-400 leading-relaxed">
          {error.message || 'An unexpected runtime issue occurred. The system state has been preserved.'}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold inline-flex items-center space-x-2 transition-all shadow-md"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          <span>Reload Lab State</span>
        </button>
      </div>
    </div>
  );
}
