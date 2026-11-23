import { describe, it, expect } from 'vitest';
import { ProjectAccessRequestSchema, BookingSlotSchema, sanitizeInput } from '../lib/validation';

describe('Validation & Security Engine', () => {
  it('validates a well-formed booking slot', () => {
    const validSlot = {
      date: '2026-11-25',
      startTime: '09:00',
      endTime: '12:00'
    };

    const parsed = BookingSlotSchema.safeParse(validSlot);
    expect(parsed.success).toBe(true);
  });

  it('rejects an invalid slot where end time is before start time', () => {
    const invalidSlot = {
      date: '2026-11-25',
      startTime: '15:00',
      endTime: '10:00'
    };

    const parsed = BookingSlotSchema.safeParse(invalidSlot);
    expect(parsed.success).toBe(false);
  });

  it('validates a complete project access request with requirements and team details', () => {
    const validRequest = {
      studentId: 'STU-1234',
      studentName: 'Aarav Gupta',
      studentEmail: 'aarav@campus.edu',
      studentDepartment: 'Robotics & Automation',
      projectTitle: 'Autonomous Quadcopter Flight Testing',
      projectDescription: 'Validation of real-time sensor fusion algorithms on Jetson edge board.',
      projectCategory: 'Funded Research Grant',
      facultyAdvisor: 'Dr. Henrik',
      courseOrGrantCode: 'AGRI-GRANT-2026',
      teamMembers: ['Nadia (ROB21B02)'],
      studentRequirements: 'Requires 12V 5A power supply and ROS2 Humble environment.',
      projectDeadline: '2026-11-30',
      urgency: 'High (<= 1 week)',
      equipmentId: 'eq-rob-01',
      requestedSlot: {
        date: '2026-11-26',
        startTime: '13:00',
        endTime: '16:00'
      },
      prerequisiteTrainingCompleted: true
    };

    const parsed = ProjectAccessRequestSchema.safeParse(validRequest);
    expect(parsed.success).toBe(true);
  });

  it('rejects an invalid request missing required fields or bad email', () => {
    const badRequest = {
      studentId: 'STU-1',
      studentName: 'A',
      studentEmail: 'not-an-email',
      projectTitle: 'Short'
    };

    const parsed = ProjectAccessRequestSchema.safeParse(badRequest);
    expect(parsed.success).toBe(false);
  });

  it('sanitizes malicious script tags to prevent XSS attacks', () => {
    const maliciousInput = '<script>alert("hack")</script><img src="x" onerror="alert(1)">';
    const sanitized = sanitizeInput(maliciousInput);

    expect(sanitized).not.toContain('<script>');
    expect(sanitized).toContain('&lt;script&gt;');
  });
});
