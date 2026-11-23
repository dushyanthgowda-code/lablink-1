'use client';

import React, { useState } from 'react';
import { 
  EquipmentItem, 
  Department, 
  EquipmentCategory 
} from '@/lib/types';
import { 
  Search, 
  Sparkles, 
  Filter, 
  MapPin, 
  ShieldAlert, 
  CheckCircle2, 
  Cpu, 
  Wrench, 
  Layers,
  ArrowRight,
  Clock
} from 'lucide-react';
import { searchEquipment, RecommendationResult } from '@/lib/discovery-engine';

interface EquipmentCatalogProps {
  equipmentList: EquipmentItem[];
  onRequestBooking: (equipment: EquipmentItem) => void;
}

const DEPARTMENTS: (Department | 'All')[] = [
  'All',
  'Computer Science & AI',
  'Electronics & Communication',
  'Robotics & Automation',
  'Biotechnology & Materials',
  'Applied Physics & Nanotech'
];

const CATEGORIES: (EquipmentCategory | 'All')[] = [
  'All',
  'Specialised Equipment',
  'Development Kit',
  'Workstation'
];

const PROMPT_SUGGESTIONS = [
  'GPU rig for LLM fine-tuning',
  'Edge robotics kit with ROS2 and SLAM',
  'RF spectrum testing up to 3 GHz',
  'Continuous carbon-fiber 3D printing',
  'Real-time qPCR gene detection'
];

export const EquipmentCatalog: React.FC<EquipmentCatalogProps> = ({
  equipmentList,
  onRequestBooking
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<Department | 'All'>('All');
  const [selectedCat, setSelectedCat] = useState<EquipmentCategory | 'All'>('All');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiRationale, setAiRationale] = useState<string | null>(null);

  // Compute matched results
  const results: RecommendationResult[] = searchEquipment(equipmentList, {
    query: searchQuery,
    department: selectedDept,
    category: selectedCat,
    onlyAvailable
  });

  const handleAiSearchTrigger = async (queryText: string) => {
    setSearchQuery(queryText);
    setIsAiSearching(true);
    setAiRationale(null);

    try {
      const res = await fetch('/api/ai/recommend-equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          department: selectedDept,
          category: selectedCat
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.aiExplanation) {
          setAiRationale(data.aiExplanation as string);
        }
      }
    } catch (err: unknown) {
      console.warn('AI search API error, falling back locally:', err);
    } finally {
      setIsAiSearching(false);
    }
  };

  return (
    <section aria-labelledby="catalog-heading" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-indigo-950/40 to-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>GenAI-Powered Campus Discovery</span>
          </div>
          <h1 id="catalog-heading" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Discover Advanced Laboratory Resources
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-300">
            Search specialised equipment, development kits, and laboratory workstations across 5 campus departments. Powered by semantic natural language matching.
          </p>
        </div>

        {/* Natural Language Search Input */}
        <div className="mt-6">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleAiSearchTrigger(searchQuery);
            }}
            className="relative flex items-center"
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <Search className="w-5 h-5" aria-hidden="true" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Describe your research project or equipment specs (e.g., 'Edge AI kit for quadcopter navigation' or 'GHz Oscilloscope')..."
              aria-label="Search laboratory equipment by project description or technical specification"
              className="w-full pl-12 pr-32 py-3.5 bg-gray-950 border border-gray-700 rounded-xl text-white placeholder-gray-400 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={isAiSearching}
              className="absolute right-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isAiSearching ? 'Analyzing...' : 'AI Search'}</span>
            </button>
          </form>

          {/* Quick Prompt Suggestions */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-gray-400 font-medium">Try asking:</span>
            {PROMPT_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleAiSearchTrigger(suggestion)}
                className="px-2.5 py-1 rounded-md bg-gray-800/80 hover:bg-indigo-900/40 text-gray-300 hover:text-indigo-200 border border-gray-700 transition-colors"
              >
                &ldquo;{suggestion}&rdquo;
              </button>
            ))}
          </div>
        </div>

        {/* AI Explanation Banner (If Available) */}
        {aiRationale && (
          <div 
            role="status" 
            aria-live="polite" 
            className="mt-4 p-4 rounded-xl bg-indigo-950/50 border border-indigo-500/30 text-indigo-100 text-sm flex items-start space-x-3"
          >
            <Sparkles className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-semibold text-indigo-300">LabLink AI Matchmaker: </span>
              <span>{aiRationale}</span>
            </div>
          </div>
        )}
      </div>

      {/* Category Pills directly answering problem statement: Specialised Equipment, Dev Kits, Workstations */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CATEGORIES.map((cat) => {
          const count = cat === 'All' 
            ? equipmentList.length 
            : equipmentList.filter(e => e.category === cat).length;
          const isSelected = selectedCat === cat;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCat(cat)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-indigo-950/60 border-indigo-500 shadow-md shadow-indigo-500/10'
                  : 'bg-gray-900 border-gray-800 hover:border-gray-700'
              }`}
            >
              <span className="text-xs text-gray-400 block font-medium">Resource Category</span>
              <div className="flex items-center justify-between mt-1">
                <span className={`text-sm font-bold ${isSelected ? 'text-indigo-300' : 'text-white'}`}>
                  {cat === 'All' ? 'All Resources' : cat}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-800 text-gray-300">
                  {count}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Department Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Department:</span>
          </span>
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              aria-pressed={selectedDept === dept}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedDept === dept
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {dept === 'All' ? 'All Departments' : dept}
            </button>
          ))}
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2 text-xs text-gray-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="rounded bg-gray-800 border-gray-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
            <span>Available Only</span>
          </label>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map(({ equipment, matchScore, matchReasons }) => (
          <article
            key={equipment.id}
            className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-all duration-200 flex flex-col group shadow-lg"
          >
            {/* Card Header & Badges */}
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-800 text-indigo-400 border border-gray-700">
                    {equipment.category}
                  </span>
                  <h2 className="mt-2 text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {equipment.name}
                  </h2>
                </div>
                {/* Match Score (if query present) */}
                {searchQuery.trim().length > 0 && (
                  <span className="px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold whitespace-nowrap">
                    {matchScore}% Match
                  </span>
                )}
              </div>

              {/* Department & Lab Location */}
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-400 font-medium">{equipment.department}</p>
                <p className="text-xs text-gray-400 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" aria-hidden="true" />
                  <span className="truncate">{equipment.labLocation}</span>
                </p>
              </div>

              {/* Description */}
              <p className="mt-3 text-xs text-gray-300 line-clamp-3 leading-relaxed">
                {equipment.description}
              </p>

              {/* Daily Availability Slot Timeline */}
              <div className="mt-4 pt-3 border-t border-gray-800">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 flex items-center space-x-1 mb-2">
                  <Clock className="w-3 h-3" aria-hidden="true" />
                  <span>Daily Slot Availability</span>
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  {equipment.availableHoursDaily.map((slot, sIdx) => (
                    <div 
                      key={sIdx}
                      className={`p-1.5 rounded border text-center font-mono ${
                        slot.isOccupied
                          ? 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                          : 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
                      }`}
                    >
                      <span>{slot.startTime}–{slot.endTime}</span>
                      <span className="block text-[10px] opacity-80">
                        {slot.isOccupied ? 'Occupied' : 'Available'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Specifications Highlights */}
              <div className="mt-4 pt-3 border-t border-gray-800 space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Key Specifications
                </span>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                  {Object.entries(equipment.specs).slice(0, 4).map(([k, v]) => (
                    <div key={k} className="truncate">
                      <span className="text-gray-400">{k}: </span>
                      <span className="text-gray-200 font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {equipment.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Matched reasons if search performed */}
              {matchReasons.length > 0 && searchQuery.trim().length > 0 && (
                <div className="mt-3 p-2 bg-indigo-950/30 border border-indigo-900/40 rounded text-[11px] text-indigo-200 space-y-0.5">
                  <span className="font-semibold text-indigo-300">Match Signals:</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-gray-300">
                    {matchReasons.slice(0, 2).map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Card Footer: Status, Safety, Booking Action */}
            <div className="p-4 bg-gray-950/60 border-t border-gray-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-1.5">
                  <span 
                    className={`w-2 h-2 rounded-full ${
                      equipment.status === 'Available' ? 'bg-emerald-400' : 'bg-amber-400'
                    }`} 
                    aria-hidden="true" 
                  />
                  <span className="text-xs font-medium text-gray-300">
                    {equipment.status}
                  </span>
                </div>
                <div className="text-[11px] text-gray-400 flex items-center space-x-1">
                  <ShieldAlert className="w-3 h-3 text-amber-400" aria-hidden="true" />
                  <span>{equipment.safetyLevel}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onRequestBooking(equipment)}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1 transition-colors shadow-sm"
              >
                <span>Request Slot</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {results.length === 0 && (
        <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <p className="text-gray-400 text-sm">
            No equipment matched your search filters. Try broader terms or check &ldquo;All Departments&rdquo;.
          </p>
        </div>
      )}
    </section>
  );
};
