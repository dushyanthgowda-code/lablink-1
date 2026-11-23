'use client';

import React, { useState } from 'react';
import { 
  ProjectAccessRequest, 
  EquipmentItem, 
  RequestStatus 
} from '@/lib/types';
import { 
  Check, 
  X, 
  Filter, 
  UserCheck, 
  ShieldCheck, 
  Users,
  Cpu,
  BookmarkCheck,
  TrendingUp
} from 'lucide-react';

interface FacultyApprovalDeskProps {
  requests: ProjectAccessRequest[];
  equipmentList: EquipmentItem[];
  onApprove: (requestId: string, notes?: string) => void;
  onReject: (requestId: string, reason: string) => void;
}

export const FacultyApprovalDesk: React.FC<FacultyApprovalDeskProps> = ({
  requests,
  equipmentList,
  onApprove,
  onReject
}) => {
  const [filterStatus, setFilterStatus] = useState<RequestStatus | 'All'>('All');

  const filtered = requests.filter(r => {
    if (filterStatus === 'All') return true;
    return r.status === filterStatus;
  });

  const getEquipmentName = (eqId: string): string => {
    const eq = equipmentList.find(e => e.id === eqId);
    return eq ? `${eq.name} (${eq.department})` : eqId;
  };

  return (
    <section aria-labelledby="faculty-heading" className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-indigo-950/40 to-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold mb-3">
            <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Faculty Laboratory Governance</span>
          </div>
          <h1 id="faculty-heading" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Laboratory Access Approvals & Supervision Desk
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-300">
            Review student project requests, inspect academic deadlines and safety prerequisite compliance, and authorize equipment access across university labs while optimising resource utilisation.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-gray-400 mr-2 flex items-center space-x-1">
          <Filter className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Filter Status:</span>
        </span>
        {(['All', 'Pending Approval', 'Conflicted', 'Approved', 'Reallocated', 'Rejected'] as const).map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setFilterStatus(st)}
            aria-pressed={filterStatus === st}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === st
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {st} ({st === 'All' ? requests.length : requests.filter(r => r.status === st).length})
          </button>
        ))}
      </div>

      {/* Requests Table / Card List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-gray-900 border border-gray-800 rounded-2xl">
            <p className="text-gray-400 text-sm">No project access requests match the selected status.</p>
          </div>
        ) : (
          filtered.map((req) => (
            <article
              key={req.id}
              className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-4 hover:border-gray-700 transition-colors shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800/80 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-indigo-400 font-bold text-xs">
                    {req.studentName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">{req.studentName}</h2>
                    <p className="text-xs text-gray-400">{req.studentDepartment} • ID: {req.studentId} • {req.studentEmail}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      req.status === 'Approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : req.status === 'Conflicted'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : req.status === 'Reallocated'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                        : req.status === 'Rejected'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                    }`}
                  >
                    {req.status}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">#{req.id}</span>
                </div>
              </div>

              {/* Project & Equipment Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <div>
                    <span className="text-gray-400 font-semibold">Requested Equipment: </span>
                    <strong className="text-white">{getEquipmentName(req.equipmentId)}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 font-semibold">Slot: </span>
                    <span className="text-gray-200">
                      {req.requestedSlot.date} from {req.requestedSlot.startTime} to {req.requestedSlot.endTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-semibold">Faculty Guide: </span>
                    <span className="text-gray-200">{req.facultyAdvisor}</span>
                  </div>
                  {req.courseOrGrantCode && (
                    <div className="flex items-center space-x-1 text-gray-300">
                      <BookmarkCheck className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
                      <span>Reference: {req.courseOrGrantCode}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div>
                    <span className="text-gray-400 font-semibold">Project Title: </span>
                    <span className="text-white font-medium">{req.projectTitle}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-semibold">Classification: </span>
                    <span className="text-indigo-300">{req.projectCategory}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div>
                      <span className="text-gray-400">Deadline: </span>
                      <strong className="text-amber-400">{req.projectDeadline}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400">Past Usage: </span>
                      <span className="text-gray-200">{req.studentUsageHoursPastMonth}h/mo</span>
                    </div>
                  </div>
                  {Array.isArray(req.teamMembers) && req.teamMembers.length > 0 && (
                    <div className="flex items-center space-x-1 text-gray-400">
                      <Users className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
                      <span>Team: {req.teamMembers.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Student Technical Requirements */}
              {req.studentRequirements && (
                <div className="p-2.5 bg-indigo-950/20 border border-indigo-900/30 rounded-lg text-xs text-indigo-200 flex items-start space-x-2">
                  <Cpu className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-semibold text-indigo-300">Student Technical Requirements: </span>
                    <span>{req.studentRequirements}</span>
                  </div>
                </div>
              )}

              {/* Abstract */}
              <div className="p-3 bg-gray-950/70 border border-gray-800 rounded-lg text-xs text-gray-300">
                <span className="text-gray-400 font-semibold block mb-0.5">Project Abstract:</span>
                {req.projectDescription}
              </div>

              {/* Existing approval notes */}
              {req.approvalNotes && (
                <div className="p-3 bg-indigo-950/20 border border-indigo-900/30 rounded-lg text-xs text-indigo-200">
                  <span className="font-semibold text-indigo-300">Evaluation / Audit Notes: </span>
                  {req.approvalNotes}
                </div>
              )}

              {/* Action Buttons for Pending or Conflicted Requests */}
              {(req.status === 'Pending Approval' || req.status === 'Conflicted') && (
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-800">
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="flex items-center space-x-1 text-emerald-400">
                      <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                      <span>Safety Certified</span>
                    </span>
                    <span className="flex items-center space-x-1 text-indigo-300">
                      <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Utilisation Impact: +3.2% capacity efficiency</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => onReject(req.id, 'Declined due to lab capacity constraints.')}
                      className="px-3.5 py-1.5 rounded-lg border border-red-900 text-red-300 hover:bg-red-950/50 text-xs font-semibold flex items-center space-x-1 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Decline</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onApprove(req.id, 'Approved with safety and resource optimization check.')}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1 transition-colors shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Grant Approval</span>
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </section>
  );
};
