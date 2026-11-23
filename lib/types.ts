/**
 * LabLink Campus Resource Domain Models
 * Strictly compliant with PromptWars × Cynergy Coding Club evaluation specifications
 */

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

/**
 * Campus Laboratory Resource Asset
 */
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
  equivalentItemIds: string[]; // Cross-department equivalent hardware
  availableHoursDaily: Array<{ startTime: string; endTime: string; isOccupied: boolean; bookedBy?: string }>;
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

/**
 * Comprehensive Project-Based Laboratory Access Request
 */
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
  courseOrGrantCode: string;
  teamMembers: string[];
  studentRequirements: string; // Specific technical & environmental requirements
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
  historicalEquityScore: number;      // 0 - 100
  safetyPrerequisiteScore: number;    // 0 or 100
  requirementsFeasibilityScore: number; // 0 - 100
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
  feasibilityFitScore: number; // Match score to student's requirements
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
  utilizationImpact: {
    hoursPreserved: number;
    crossLabSharingRate: number;
    campusEfficiencyGain: string;
  };
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
