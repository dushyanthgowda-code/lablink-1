'use client';

import React from 'react';
import { 
  FlaskConical, 
  Search, 
  Sparkles, 
  UserCheck, 
  BarChart3, 
  RotateCcw,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

interface NavbarProps {
  activeView: 'discovery' | 'conflicts' | 'faculty' | 'analytics';
  setActiveView: (view: 'discovery' | 'conflicts' | 'faculty' | 'analytics') => void;
  activeRole: 'student' | 'faculty';
  onSwitchRole: (role: 'student' | 'faculty') => void;
  conflictCount: number;
  pendingCount: number;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  activeRole,
  onSwitchRole,
  conflictCount,
  pendingCount,
  onResetData
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <FlaskConical className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white">LabLink</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  GenAI Campus Platform
                </span>
              </div>
              <p className="text-xs text-gray-400 hidden sm:block">
                Inter-Department Resource Sharing & Fair Scheduling
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveView('discovery')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'discovery'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
              aria-current={activeView === 'discovery' ? 'page' : undefined}
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              <span>Equipment Discovery</span>
            </button>

            <button
              onClick={() => setActiveView('conflicts')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                activeView === 'conflicts'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
              aria-current={activeView === 'conflicts' ? 'page' : undefined}
            >
              <Sparkles className="w-4 h-4 text-amber-400" aria-hidden="true" />
              <span>AI Conflict Resolver</span>
              {conflictCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-amber-500 text-gray-950 font-bold rounded-full">
                  {conflictCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveView('faculty')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                activeView === 'faculty'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
              aria-current={activeView === 'faculty' ? 'page' : undefined}
            >
              <UserCheck className="w-4 h-4" aria-hidden="true" />
              <span>Faculty Desk</span>
              {pendingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-indigo-500 text-white font-bold rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveView('analytics')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'analytics'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
              aria-current={activeView === 'analytics' ? 'page' : undefined}
            >
              <BarChart3 className="w-4 h-4" aria-hidden="true" />
              <span>Lab Analytics</span>
            </button>
          </nav>

          {/* Right Controls: Role Switcher & Reset */}
          <div className="flex items-center space-x-3">
            {/* Role Switcher Pill */}
            <div 
              role="group" 
              aria-label="User Persona Switcher" 
              className="flex items-center bg-gray-900 border border-gray-700 rounded-lg p-1 text-xs"
            >
              <button
                type="button"
                onClick={() => onSwitchRole('student')}
                aria-pressed={activeRole === 'student'}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md transition-all ${
                  activeRole === 'student'
                    ? 'bg-indigo-600 text-white font-medium shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => onSwitchRole('faculty')}
                aria-pressed={activeRole === 'faculty'}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md transition-all ${
                  activeRole === 'faculty'
                    ? 'bg-indigo-600 text-white font-medium shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Faculty/Admin</span>
              </button>
            </div>

            {/* Reset Demo Data Button */}
            <button
              type="button"
              onClick={onResetData}
              title="Reset sample demonstration data"
              aria-label="Reset sample demonstration data"
              className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 border border-gray-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mobile Nav strip */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-gray-800 text-xs">
          <button
            onClick={() => setActiveView('discovery')}
            className={`py-1 px-2 rounded ${activeView === 'discovery' ? 'text-indigo-400 font-bold' : 'text-gray-400'}`}
          >
            Discovery
          </button>
          <button
            onClick={() => setActiveView('conflicts')}
            className={`py-1 px-2 rounded ${activeView === 'conflicts' ? 'text-amber-400 font-bold' : 'text-gray-400'}`}
          >
            AI Conflicts ({conflictCount})
          </button>
          <button
            onClick={() => setActiveView('faculty')}
            className={`py-1 px-2 rounded ${activeView === 'faculty' ? 'text-indigo-400 font-bold' : 'text-gray-400'}`}
          >
            Faculty ({pendingCount})
          </button>
          <button
            onClick={() => setActiveView('analytics')}
            className={`py-1 px-2 rounded ${activeView === 'analytics' ? 'text-indigo-400 font-bold' : 'text-gray-400'}`}
          >
            Analytics
          </button>
        </div>
      </div>
    </header>
  );
};
