'use client';

import React, { useState, useEffect } from 'react';
import { 
  EquipmentItem, 
  Department, 
  ProjectCategory, 
  ProjectUrgency,
  ProjectAccessRequest 
} from '@/lib/types';
import { 
  X, 
  Calendar, 
  Clock, 
  FileText, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle, 
  Send 
} from 'lucide-react';
import { ProjectAccessRequestSchema } from '@/lib/validation';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: EquipmentItem | null;
  onSubmit: (requestData: Omit<ProjectAccessRequest, 'id' | 'status' | 'createdAt' | 'studentUsageHoursPastMonth'>) => void;
}

const DEPARTMENTS: Department[] = [
  'Computer Science & AI',
  'Electronics & Communication',
  'Robotics & Automation',
  'Biotechnology & Materials',
  'Applied Physics & Nanotech'
];

const CATEGORIES: ProjectCategory[] = [
  'Capstone / Final Year Thesis',
  'Funded Research Grant',
  'Coursework Project',
  'Student Club / Innovation Contest'
];

const URGENCIES: ProjectUrgency[] = [
  'Critical (<= 48h)',
  'High (<= 1 week)',
  'Medium (<= 2 weeks)',
  'Low (> 2 weeks)'
];

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  equipment,
  onSubmit
}) => {
  // Form state
  const [studentId, setStudentId] = useState('STU-2024-9182');
  const [studentName, setStudentName] = useState('Devashish Ray');
  const [studentEmail, setStudentEmail] = useState('d.ray@student.campus.edu');
  const [studentDept, setStudentDept] = useState<Department>('Computer Science & AI');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectCategory, setProjectCategory] = useState<ProjectCategory>('Capstone / Final Year Thesis');
  const [facultyAdvisor, setFacultyAdvisor] = useState('Dr. Aris Thorne');
  
  // Tomorrow as default booking date
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [bookingDate, setBookingDate] = useState(tomorrowStr);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('14:00');
  
  // Project deadline 3 days from now by default
  const deadlineDefault = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];
  const [projectDeadline, setProjectDeadline] = useState(deadlineDefault);
  const [urgency, setUrgency] = useState<ProjectUrgency>('High (<= 1 week)');
  const [prereqChecked, setPrereqChecked] = useState(true);

  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !equipment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);

    const payload = {
      studentId,
      studentName,
      studentEmail,
      studentDepartment: studentDept,
      projectTitle,
      projectDescription,
      projectCategory,
      facultyAdvisor,
      projectDeadline,
      urgency,
      equipmentId: equipment.id,
      requestedSlot: {
        date: bookingDate,
        startTime,
        endTime
      },
      prerequisiteTrainingCompleted: prereqChecked
    };

    const validation = ProjectAccessRequestSchema.safeParse(payload);
    if (!validation.success) {
      const errs = validation.error.issues.map(i => `${i.path.join('.')}: ${i.message}`);
      setFormErrors(errs);
      return;
    }

    onSubmit(payload);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-white max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close dialog"
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Modal Title & Selected Equipment Summary */}
        <div className="mb-6">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold mb-2">
            <span>Project-Based Resource Request</span>
          </div>
          <h2 id="modal-title" className="text-xl sm:text-2xl font-bold text-white">
            Request Access: {equipment.name}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            {equipment.department} • {equipment.labLocation} (Custodian: {equipment.custodianFaculty})
          </p>
        </div>

        {/* Success State */}
        {isSubmitted ? (
          <div 
            role="status" 
            aria-live="polite" 
            className="py-12 text-center space-y-3"
          >
            <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" aria-hidden="true" />
            <h3 className="text-lg font-bold text-white">Request Submitted Successfully!</h3>
            <p className="text-sm text-gray-300">
              Your request has entered the automated scheduling and conflict resolution pipeline.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error notifications */}
            {formErrors.length > 0 && (
              <div 
                role="alert" 
                aria-live="polite" 
                className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-200 text-xs space-y-1"
              >
                <div className="flex items-center space-x-2 font-bold text-red-300">
                  <AlertCircle className="w-4 h-4" aria-hidden="true" />
                  <span>Please correct the following errors:</span>
                </div>
                <ul className="list-disc pl-5 space-y-0.5">
                  {formErrors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Section 1: Student & Advisor Identification */}
            <fieldset className="border border-gray-800 rounded-xl p-4 space-y-3">
              <legend className="text-xs font-bold text-indigo-400 px-2 uppercase tracking-wider">
                Student & Faculty Verification
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="student-id" className="block text-xs font-medium text-gray-300 mb-1">
                    Student ID
                  </label>
                  <input
                    id="student-id"
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-950 border border-gray-700 rounded-lg text-sm text-white focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="student-name" className="block text-xs font-medium text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    id="student-name"
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-950 border border-gray-700 rounded-lg text-sm text-white focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="student-dept" className="block text-xs font-medium text-gray-300 mb-1">
                    Your Department
                  </label>
                  <select
                    id="student-dept"
                    value={studentDept}
                    onChange={(e) => setStudentDept(e.target.value as Department)}
                    className="w-full px-3 py-2 bg-gray-950 border border-gray-700 rounded-lg text-sm text-white focus:border-indigo-500"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="faculty-advisor" className="block text-xs font-medium text-gray-300 mb-1">
                    Faculty Advisor / Guide
                  </label>
                  <input
                    id="faculty-advisor"
                    type="text"
                    required
                    value={facultyAdvisor}
                    onChange={(e) => setFacultyAdvisor(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-950 border border-gray-700 rounded-lg text-sm text-white focus:border-indigo-500"
                  />
                </div>
              </div>
            </fieldset>

            {/* Section 2: Project Specifications & Academic Urgency */}
            <fieldset className="border border-gray-800 rounded-xl p-4 space-y-3">
              <legend className="text-xs font-bold text-indigo-400 px-2 uppercase tracking-wider">
                Project Classification & Deadlines
              </legend>
              <div>
                <label htmlFor="project-title" className="block text-xs font-medium text-gray-300 mb-1">
                  Project Title
                </label>
                <input
                  id="project-title"
                  type="text"
                  required
                  placeholder="e.g., Autonomous Aerial SLAM for Disaster Zones"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-950 border border-gray-700 rounded-lg text-sm text-white focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="project-desc" className="block text-xs font-medium text-gray-300 mb-1">
                  Project Abstract & Equipment Justification (min 20 chars)
                </label>
                <textarea
                  id="project-desc"
                  rows={3}
                  required
                  placeholder="Explain why this specialised equipment or workstation is needed for your project milestones..."
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-950 border border-gray-700 rounded-lg text-sm text-white focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="project-category" className="block text-xs font-medium text-gray-300 mb-1">
                    Project Type
                  </label>
                  <select
                    id="project-category"
                    value={projectCategory}
                    onChange={(e) => setProjectCategory(e.target.value as ProjectCategory)}
                    className="w-full px-3 py-2 bg-gray-950 border border-gray-700 rounded-lg text-sm text-white focus:border-indigo-500"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="project-deadline" className="block text-xs font-medium text-gray-300 mb-1">
                    Project Deadline
                  </label>
                  <input
                    id="project-deadline"
                    type="date"
                    required
                    value={projectDeadline}
                    onChange={(e) => setProjectDeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-950 border border-gray-700 rounded-lg text-sm text-white focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="project-urgency" className="block text-xs font-medium text-gray-300 mb-1">
                    Urgency Level
                  </label>
                  <select
                    id="project-urgency"
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as ProjectUrgency)}
                    className="w-full px-3 py-2 bg-gray-950 border border-gray-700 rounded-lg text-sm text-white focus:border-indigo-500"
                  >
                    {URGENCIES.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
            </fieldset>

            {/* Section 3: Slot Scheduling & Safety Protocol */}
            <fieldset className="border border-gray-800 rounded-xl p-4 space-y-3">
              <legend className="text-xs font-bold text-indigo-400 px-2 uppercase tracking-wider">
                Slot Selection & Lab Safety Clearance
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="booking-date" className="block text-xs font-medium text-gray-300 mb-1">
                    Requested Date
                  </label>
                  <input
                    id="booking-date"
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-950 border border-gray-700 rounded-lg text-sm text-white focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="start-time" className="block text-xs font-medium text-gray-300 mb-1">
                    Start Time
                  </label>
                  <input
                    id="start-time"
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-950 border border-gray-700 rounded-lg text-sm text-white focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="end-time" className="block text-xs font-medium text-gray-300 mb-1">
                    End Time
                  </label>
                  <input
                    id="end-time"
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-950 border border-gray-700 rounded-lg text-sm text-white focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Safety Prerequisite Agreement */}
              <div className="pt-2">
                <label className="flex items-start space-x-2.5 text-xs text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prereqChecked}
                    onChange={(e) => setPrereqChecked(e.target.checked)}
                    className="mt-0.5 rounded bg-gray-800 border-gray-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span>
                    I confirm that I have completed the required safety induction and laboratory prerequisite training for{' '}
                    <strong className="text-white">{equipment.name}</strong> ({equipment.safetyLevel} level).
                  </span>
                </label>
              </div>
            </fieldset>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-2 transition-all shadow-lg shadow-indigo-600/30"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
                <span>Submit Access Request</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
