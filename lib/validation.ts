import { z } from 'zod';

export const BookingSlotSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (must be YYYY-MM-DD)'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid start time (must be HH:mm)'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid end time (must be HH:mm)'),
}).refine(data => data.startTime < data.endTime, {
  message: 'End time must be after start time',
  path: ['endTime']
});

export const ProjectAccessRequestSchema = z.object({
  studentId: z.string().min(3).max(30),
  studentName: z.string().min(2).max(100),
  studentEmail: z.string().email(),
  studentDepartment: z.enum([
    'Computer Science & AI',
    'Electronics & Communication',
    'Robotics & Automation',
    'Biotechnology & Materials',
    'Applied Physics & Nanotech'
  ]),
  projectTitle: z.string().min(5).max(150),
  projectDescription: z.string().min(20).max(2000),
  projectCategory: z.enum([
    'Capstone / Final Year Thesis',
    'Funded Research Grant',
    'Coursework Project',
    'Student Club / Innovation Contest'
  ]),
  facultyAdvisor: z.string().min(2).max(100),
  projectDeadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid deadline date format'),
  urgency: z.enum([
    'Critical (<= 48h)',
    'High (<= 1 week)',
    'Medium (<= 2 weeks)',
    'Low (> 2 weeks)'
  ]),
  equipmentId: z.string().min(3),
  requestedSlot: BookingSlotSchema,
  prerequisiteTrainingCompleted: z.boolean()
});

/**
 * Sanitizes user input string against XSS injection
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
