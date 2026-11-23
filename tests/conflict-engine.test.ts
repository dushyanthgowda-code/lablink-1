import { describe, it, expect } from 'vitest';
import { 
  calculateDeadlineScore, 
  calculateAcademicPriorityScore, 
  calculateEquityScore, 
  calculateRequirementsScore,
  scoreCandidate, 
  resolveSchedulingConflict 
} from '../lib/conflict-engine';
import { INITIAL_EQUIPMENT } from '../lib/mock-data';
import { ProjectAccessRequest } from '../lib/types';

describe('Intelligent Conflict Resolution & Fair Scheduling Engine', () => {
  it('assigns higher urgency score to impending deadlines', () => {
    const slotDate = '2026-11-24';
    const urgentDeadline = '2026-11-25'; // 1 day
    const distantDeadline = '2026-12-25'; // 31 days

    const urgentScore = calculateDeadlineScore(urgentDeadline, slotDate);
    const distantScore = calculateDeadlineScore(distantDeadline, slotDate);

    expect(urgentScore).toBe(100);
    expect(distantScore).toBeLessThan(urgentScore);
  });

  it('weights academic categories appropriately', () => {
    const capstoneScore = calculateAcademicPriorityScore('Capstone / Final Year Thesis');
    const grantScore = calculateAcademicPriorityScore('Funded Research Grant');
    const courseScore = calculateAcademicPriorityScore('Coursework Project');
    const clubScore = calculateAcademicPriorityScore('Student Club / Innovation Contest');

    expect(capstoneScore).toBe(100);
    expect(grantScore).toBe(85);
    expect(courseScore).toBe(60);
    expect(clubScore).toBe(35);
  });

  it('rewards lower historical usage with higher equity preference to prevent monopolization', () => {
    const lowUsageScore = calculateEquityScore(5);   // 5 hours used
    const highUsageScore = calculateEquityScore(45); // 45 hours used

    expect(lowUsageScore).toBe(100);
    expect(highUsageScore).toBe(35);
    expect(lowUsageScore).toBeGreaterThan(highUsageScore);
  });

  it('evaluates student technical requirements against hardware capabilities', () => {
    const dgxItem = INITIAL_EQUIPMENT.find(e => e.id === 'eq-cs-01')!;
    const highReq = 'Requires 80GB VRAM, CUDA 12.2, 3D tensor processing';
    const moderateReq = 'Requires 24GB VRAM, PyTorch audio diffusion';

    const scoreHigh = calculateRequirementsScore(highReq, dgxItem);
    const scoreModerate = calculateRequirementsScore(moderateReq, dgxItem);

    expect(scoreHigh).toBe(100);
    expect(scoreModerate).toBe(95);
  });

  it('zeros fairness score if safety prerequisite training is incomplete', () => {
    const uncertifiedReq: ProjectAccessRequest = {
      id: 'req-test',
      studentId: 'STU-99',
      studentName: 'Test Student',
      studentEmail: 'test@campus.edu',
      studentDepartment: 'Computer Science & AI',
      projectTitle: 'Hazardous Laser Test',
      projectDescription: 'Testing high power lasers without certified training.',
      projectCategory: 'Capstone / Final Year Thesis',
      facultyAdvisor: 'Dr. Test',
      courseOrGrantCode: 'TEST-101',
      teamMembers: [],
      studentRequirements: 'Safety goggles and 500W laser power bench',
      projectDeadline: '2026-11-26',
      urgency: 'Critical (<= 48h)',
      equipmentId: 'eq-cs-01',
      requestedSlot: { date: '2026-11-24', startTime: '10:00', endTime: '14:00' },
      prerequisiteTrainingCompleted: false, // Incomplete!
      status: 'Pending Approval',
      studentUsageHoursPastMonth: 10,
      createdAt: '2026-11-23T00:00:00Z'
    };

    const evaluated = scoreCandidate(uncertifiedReq);
    expect(evaluated.scores.safetyPrerequisiteScore).toBe(0);
    expect(evaluated.scores.compositeFairnessScore).toBe(0);
  });

  it('resolves conflicting requests with transparent winner and feasible alternatives', () => {
    const dgxItem = INITIAL_EQUIPMENT.find(e => e.id === 'eq-cs-01')!;

    const req1: ProjectAccessRequest = {
      id: 'req-capstone',
      studentId: 'STU-1',
      studentName: 'Zubair Patel',
      studentEmail: 'z.patel@student.campus.edu',
      studentDepartment: 'Computer Science & AI',
      projectTitle: 'Surgical Segmentation Capstone',
      projectDescription: 'Final year capstone deadline in 48 hours.',
      projectCategory: 'Capstone / Final Year Thesis',
      facultyAdvisor: 'Dr. Thorne',
      courseOrGrantCode: 'CS-499',
      teamMembers: ['Sarah Jenkins (CS21B12)'],
      studentRequirements: 'Requires 80GB VRAM, CUDA 12.2',
      projectDeadline: '2026-11-25',
      urgency: 'Critical (<= 48h)',
      equipmentId: 'eq-cs-01',
      requestedSlot: { date: '2026-11-24', startTime: '10:00', endTime: '14:00' },
      prerequisiteTrainingCompleted: true,
      status: 'Conflicted',
      studentUsageHoursPastMonth: 12,
      createdAt: '2026-11-23T08:00:00Z'
    };

    const req2: ProjectAccessRequest = {
      id: 'req-club',
      studentId: 'STU-2',
      studentName: 'Ananya Deshmukh',
      studentEmail: 'a.deshmukh@student.campus.edu',
      studentDepartment: 'Electronics & Communication',
      projectTitle: 'Club Audio Diffusion',
      projectDescription: 'Club hackathon project next month.',
      projectCategory: 'Student Club / Innovation Contest',
      facultyAdvisor: 'Prof. Vance',
      courseOrGrantCode: 'CLUB-2026',
      teamMembers: [],
      studentRequirements: 'Requires 24GB VRAM, audio diffusion',
      projectDeadline: '2026-12-20',
      urgency: 'Low (> 2 weeks)',
      equipmentId: 'eq-cs-01',
      requestedSlot: { date: '2026-11-24', startTime: '10:00', endTime: '14:00' },
      prerequisiteTrainingCompleted: true,
      status: 'Conflicted',
      studentUsageHoursPastMonth: 40,
      createdAt: '2026-11-23T08:30:00Z'
    };

    const resolution = resolveSchedulingConflict('cnf-01', dgxItem, INITIAL_EQUIPMENT, [req1, req2]);

    expect(resolution.primaryWinnerRequestId).toBe('req-capstone');
    expect(resolution.primaryWinnerName).toBe('Zubair Patel');
    expect(resolution.alternativeOffers.length).toBe(1);
    expect(resolution.alternativeOffers[0].requestId).toBe('req-club');
    expect(resolution.alternativeOffers[0].feasibilityFitScore).toBeGreaterThan(90);
    expect(resolution.utilizationImpact.campusEfficiencyGain).toContain('+18.4%');
  });
});
