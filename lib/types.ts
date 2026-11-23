export type Department = 
  | 'Computer Science & AI'
  | 'Electronics & Communication'
  | 'Robotics & Automation'
  | 'Biotechnology & Materials'
  | 'Applied Physics & Nanotech';

export type EquipmentCategory = 
  | 'Specialised Equipment'
  | 'Development Kit'
  | 'Workstation';

export type EquipmentStatus = 
  | 'Available'
  | 'In Use'
  | 'Under Maintenance'
  | 'Calibration Required';

export type SafetyLevel = 'Basic' | 'Moderate' | 'High (Certified Only)';

export interface EquipmentItem {
  id: string;
  name: string;
  category: EquipmentCategory;
  department: Department;
  labLocation: string;
  description: string;
  specs: Record<string, string>;
  tags: string[];
  imageUrl: string;
  status: EquipmentStatus;
  safetyLevel: SafetyLevel;
  custodianFaculty: string;
  custodianEmail: string;
  totalHoursBookedThisMonth: number;
  equivalentItemIds: string[]; // IDs of alternate or equivalent equipment across labs
}

export type ProjectUrgency = 
  | 'Critical (<= 48h)'
  | 'High (<= 1 week)'
  | 'Medium (<= 2 weeks)'
  | 'Low (> 2 weeks)';

export type ProjectCategory = 
  | 'Capstone / Final Year Thesis'
  | 'Funded Research Grant'
  | 'Coursework Project'
  | 'Student Club / Innovation Contest';

export type RequestStatus = 
  | 'Pending Approval'
  | 'Approved'
  | 'Conflicted'
  | 'Reallocated'
  | 'Rejected';

export interface BookingSlot {
  date: string;       // YYYY-MM-DD
  startTime: string;  // HH:mm (e.g. "09:00")
  endTime: string;    // HH:mm (e.g. "12:00")
}

export interface ProjectAccessRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentDepartment: Department;
  projectTitle: string;
  projectDescription: string;
  projectCategory: ProjectCategory;
  facultyAdvisor: string;
  projectDeadline: string; // YYYY-MM-DD
  urgency: ProjectUrgency;
  equipmentId: string;
  requestedSlot: BookingSlot;
  prerequisiteTrainingCompleted: boolean;
  status: RequestStatus;
  studentUsageHoursPastMonth: number;
  approvalNotes?: string;
  allocatedEquipmentId?: string;
  allocatedSlot?: BookingSlot;
  createdAt: string;
}

export interface FactorWeights {
  deadlineUrgencyScore: number;       // 0 - 100
  academicPriorityScore: number;      // 0 - 100
  historicalEquityScore: number;      // 0 - 100 (higher if student used LESS hours recently)
  safetyPrerequisiteScore: number;    // 0 or 100
  compositeFairnessScore: number;     // 0 - 100
}

export interface CompetingCandidate {
  request: ProjectAccessRequest;
  scores: FactorWeights;
}

export interface AlternativeOffer {
  requestId: string;
  studentName: string;
  type: 'Equivalent Equipment Across Campus' | 'Off-Peak Time Slot' | 'Slot Time-Sharing';
  suggestedEquipmentId?: string;
  suggestedEquipmentName?: string;
  suggestedSlot?: BookingSlot;
  details: string;
}

export interface ConflictResolutionRecommendation {
  conflictId: string;
  equipmentId: string;
  conflictingSlot: BookingSlot;
  primaryWinnerRequestId: string;
  primaryWinnerName: string;
  rationale: string;
  candidates: CompetingCandidate[];
  alternativeOffers: AlternativeOffer[];
  resolvedAt: string;
}

export interface LabUtilizationMetric {
  department: Department;
  totalAssets: number;
  activeAssets: number;
  occupancyPercentage: number;
  peakHour: string;
  underutilizedAssets: Array<{ id: string; name: string; utilizationRate: number }>;
  bottleneckAssets: Array<{ id: string; name: string; bookingDemandMultiplier: number }>;
}
