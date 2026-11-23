'use client';

import React, { useState } from 'react';
import { 
  EquipmentItem, 
  ProjectAccessRequest, 
  ConflictResolutionRecommendation 
} from '@/lib/types';
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Scale, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Layers, 
  Check, 
  Bot,
  User,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { resolveSchedulingConflict } from '@/lib/conflict-engine';

interface ConflictResolverViewProps {
  conflicts: Array<{
    conflictId: string;
    equipment: EquipmentItem;
    slot: { date: string; startTime: string; endTime: string };
    requests: ProjectAccessRequest[];
  }>;
  allEquipment: EquipmentItem[];
  onApplyResolution: (resolution: ConflictResolutionRecommendation) => void;
}

export const ConflictResolverView: React.FC<ConflictResolverViewProps> = ({
  conflicts,
  allEquipment,
  onApplyResolution
}) => {
  const [activeResolutions, setActiveResolutions] = useState<Record<string, ConflictResolutionRecommendation>>({});
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const handleRunAiEvaluation = async (
    conflictId: string, 
    equipment: EquipmentItem, 
    competingRequests: ProjectAccessRequest[]
  ) => {
    setResolvingId(conflictId);
    try {
      const res = await fetch('/api/ai/resolve-conflict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conflictId,
          equipmentId: equipment.id,
          competingRequests,
          allEquipment
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.resolution) {
          setActiveResolutions(prev => ({ ...prev, [conflictId]: data.resolution }));
        }
      } else {
        // Fallback locally if network/backend error
        const localRes = resolveSchedulingConflict(conflictId, equipment, allEquipment, competingRequests);
        setActiveResolutions(prev => ({ ...prev, [conflictId]: localRes }));
      }
    } catch (err) {
      const localRes = resolveSchedulingConflict(conflictId, equipment, allEquipment, competingRequests);
      setActiveResolutions(prev => ({ ...prev, [conflictId]: localRes }));
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <section aria-labelledby="conflict-heading" className="space-y-6">
      {/* Overview Header */}
      <div className="bg-gradient-to-r from-gray-900 via-amber-950/30 to-gray-900 border border-amber-900/40 rounded-2xl p-6 shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold mb-3">
            <Scale className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Autonomous Fair Scheduling Engine</span>
          </div>
          <h1 id="conflict-heading" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Intelligent Conflict Resolution & Fair Allocation
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-300">
            When high-demand laboratory resources are contested, LabLink evaluates academic urgency, project deadlines, and historical usage equity to guarantee fair access without stalling students&apos; research.
          </p>
        </div>
      </div>

      {conflicts.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" aria-hidden="true" />
          <h2 className="text-lg font-bold text-white">No Active Scheduling Conflicts</h2>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            All equipment bookings are currently optimized and collision-free across campus laboratories.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {conflicts.map(({ conflictId, equipment, slot, requests }) => {
            const resolution = activeResolutions[conflictId];
            const isEvaluating = resolvingId === conflictId;

            return (
              <article 
                key={conflictId}
                className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl"
              >
                {/* Conflict Card Header */}
                <div className="p-5 bg-gray-950/80 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center space-x-1">
                        <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Slot Conflict Detected</span>
                      </span>
                      <span className="text-xs text-gray-400 font-mono">ID: {conflictId}</span>
                    </div>
                    <h2 className="text-lg font-bold text-white mt-1">
                      {equipment.name} ({equipment.department})
                    </h2>
                    <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{slot.date}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{slot.startTime} – {slot.endTime}</span>
                      </span>
                      <span className="text-indigo-400 font-medium">
                        {requests.length} Competing Requests
                      </span>
                    </div>
                  </div>

                  {/* Run AI Button */}
                  <div>
                    <button
                      type="button"
                      disabled={isEvaluating}
                      onClick={() => handleRunAiEvaluation(conflictId, equipment, requests)}
                      className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-lg shadow-amber-600/20 disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4 text-amber-200" aria-hidden="true" />
                      <span>{isEvaluating ? 'Evaluating Fairness Matrix...' : 'Run GenAI Fairness Evaluation'}</span>
                    </button>
                  </div>
                </div>

                {/* Competing Requests Side-by-Side Comparison */}
                <div className="p-6 space-y-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Contesting Candidates & Project Context
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {requests.map((req, idx) => (
                      <div 
                        key={req.id}
                        className={`p-4 rounded-xl border transition-all ${
                          resolution && resolution.primaryWinnerRequestId === req.id
                            ? 'bg-emerald-950/30 border-emerald-500/60 shadow-emerald-500/10 shadow-lg'
                            : 'bg-gray-950/60 border-gray-800'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs font-bold text-gray-400">Candidate #{idx + 1}</span>
                            <h4 className="text-sm font-bold text-white flex items-center space-x-1.5 mt-0.5">
                              <User className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
                              <span>{req.studentName}</span>
                            </h4>
                            <p className="text-xs text-gray-400">{req.studentDepartment} • ID: {req.studentId}</p>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-800 text-gray-300">
                            {req.projectCategory}
                          </span>
                        </div>

                        <div className="mt-3 p-2.5 bg-gray-900 rounded-lg text-xs space-y-1">
                          <p className="font-semibold text-white">{req.projectTitle}</p>
                          <p className="text-gray-400 line-clamp-2">{req.projectDescription}</p>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-400">Deadline: </span>
                            <strong className="text-white">{req.projectDeadline}</strong>
                          </div>
                          <div>
                            <span className="text-gray-400">Past Usage: </span>
                            <strong className="text-white">{req.studentUsageHoursPastMonth}h this month</strong>
                          </div>
                          <div>
                            <span className="text-gray-400">Urgency: </span>
                            <span className="text-amber-400 font-medium">{req.urgency}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-emerald-400">
                            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Safety Certified</span>
                          </div>
                        </div>

                        {/* If Scored in Resolution */}
                        {resolution && (
                          <div className="mt-4 pt-3 border-t border-gray-800">
                            {(() => {
                              const candidateScore = resolution.candidates.find(c => c.request.id === req.id);
                              if (!candidateScore) return null;
                              return (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-xs font-bold">
                                    <span className="text-indigo-300">Composite Fairness Score</span>
                                    <span className="text-white bg-indigo-600 px-2 py-0.5 rounded">
                                      {candidateScore.scores.compositeFairnessScore} / 100
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-1 text-[10px] text-gray-400 text-center">
                                    <div className="bg-gray-900 p-1 rounded">
                                      <span>Deadline</span>
                                      <p className="font-bold text-gray-200">{candidateScore.scores.deadlineUrgencyScore}</p>
                                    </div>
                                    <div className="bg-gray-900 p-1 rounded">
                                      <span>Academic</span>
                                      <p className="font-bold text-gray-200">{candidateScore.scores.academicPriorityScore}</p>
                                    </div>
                                    <div className="bg-gray-900 p-1 rounded">
                                      <span>Equity</span>
                                      <p className="font-bold text-gray-200">{candidateScore.scores.historicalEquityScore}</p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Resolution Recommendation Card */}
                  {resolution && (
                    <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 space-y-4">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-5 h-5 text-indigo-400" aria-hidden="true" />
                        <h4 className="text-sm font-bold text-indigo-300">
                          AI Fair Allocation Recommendation
                        </h4>
                      </div>

                      {/* Transparent Rationale */}
                      <p className="text-xs sm:text-sm text-gray-200 leading-relaxed bg-gray-900/60 p-3.5 rounded-xl border border-gray-800">
                        {resolution.rationale}
                      </p>

                      {/* Alternative Offers */}
                      {resolution.alternativeOffers.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1">
                            <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Preserved Project Continuity (Alternative Routing)</span>
                          </span>

                          <div className="space-y-2">
                            {resolution.alternativeOffers.map((offer, oIdx) => (
                              <div 
                                key={oIdx}
                                className="p-3 bg-gray-900/80 border border-gray-700 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                              >
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-bold text-white">{offer.studentName}</span>
                                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-semibold">
                                      {offer.type}
                                    </span>
                                  </div>
                                  <p className="text-gray-300 mt-1">{offer.details}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Button: Apply Allocation */}
                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => onApplyResolution(resolution)}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-lg shadow-emerald-600/30"
                        >
                          <Check className="w-4 h-4" aria-hidden="true" />
                          <span>Approve & Apply AI Fair Allocation</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
