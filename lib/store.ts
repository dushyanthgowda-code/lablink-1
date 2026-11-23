import { useState, useEffect } from 'react';
import { 
  EquipmentItem, 
  ProjectAccessRequest, 
  ConflictResolutionRecommendation,
  Department,
  EquipmentCategory
} from './types';
import { INITIAL_EQUIPMENT, INITIAL_REQUESTS } from './mock-data';
import { resolveSchedulingConflict } from './conflict-engine';

const STORAGE_KEYS = {
  EQUIPMENT: 'lablink_equipment_v1',
  REQUESTS: 'lablink_requests_v1',
  ROLE: 'lablink_active_role_v1'
};

export function useLabStore() {
  const [equipment, setEquipment] = useState<EquipmentItem[]>(INITIAL_EQUIPMENT);
  const [requests, setRequests] = useState<ProjectAccessRequest[]>(INITIAL_REQUESTS);
  const [activeRole, setActiveRole] = useState<'student' | 'faculty'>('student');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedEq = localStorage.getItem(STORAGE_KEYS.EQUIPMENT);
        const storedReq = localStorage.getItem(STORAGE_KEYS.REQUESTS);
        const storedRole = localStorage.getItem(STORAGE_KEYS.ROLE);

        if (storedEq) setEquipment(JSON.parse(storedEq));
        if (storedReq) setRequests(JSON.parse(storedReq));
        if (storedRole === 'faculty' || storedRole === 'student') setActiveRole(storedRole);
      } catch (err) {
        console.warn('LocalStorage error, using initial state:', err);
      }
      setIsLoaded(true);
    }
  }, []);

  // Save changes to localStorage
  const saveRequests = (updated: ProjectAccessRequest[]) => {
    setRequests(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(updated));
    }
  };

  const saveEquipment = (updated: EquipmentItem[]) => {
    setEquipment(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(updated));
    }
  };

  const switchRole = (role: 'student' | 'faculty') => {
    setActiveRole(role);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ROLE, role);
    }
  };

  // Add new project-based booking request
  const submitRequest = (newReqData: Omit<ProjectAccessRequest, 'id' | 'status' | 'createdAt' | 'studentUsageHoursPastMonth'>) => {
    // Check if slot conflicts with an existing approved or pending request on the same equipment
    const hasSlotConflict = requests.some(r => 
      r.equipmentId === newReqData.equipmentId &&
      r.requestedSlot.date === newReqData.requestedSlot.date &&
      r.requestedSlot.startTime === newReqData.requestedSlot.startTime &&
      r.status !== 'Rejected'
    );

    const newRequest: ProjectAccessRequest = {
      ...newReqData,
      id: `req-${Date.now().toString().slice(-4)}`,
      status: hasSlotConflict ? 'Conflicted' : 'Pending Approval',
      studentUsageHoursPastMonth: Math.floor(Math.random() * 25) + 5,
      createdAt: new Date().toISOString()
    };

    const updated = [newRequest, ...requests];
    saveRequests(updated);
    return newRequest;
  };

  // Faculty approves request
  const approveRequest = (requestId: string, notes?: string) => {
    const updated = requests.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'Approved' as const,
          approvalNotes: notes || 'Approved by Faculty Lab Custodian.'
        };
      }
      return r;
    });
    saveRequests(updated);
  };

  // Faculty rejects request
  const rejectRequest = (requestId: string, reason: string) => {
    const updated = requests.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'Rejected' as const,
          approvalNotes: reason || 'Resource allocation declined.'
        };
      }
      return r;
    });
    saveRequests(updated);
  };

  // Apply AI Conflict Resolution Recommendation
  const applyConflictResolution = (resolution: ConflictResolutionRecommendation) => {
    const updated = requests.map(r => {
      if (r.id === resolution.primaryWinnerRequestId) {
        return {
          ...r,
          status: 'Approved' as const,
          approvalNotes: `Allocated via GenAI Fair Scheduling Engine: ${resolution.rationale}`
        };
      }

      // Check if this request received an alternative offer
      const altOffer = resolution.alternativeOffers.find(o => o.requestId === r.id);
      if (altOffer) {
        return {
          ...r,
          status: 'Reallocated' as const,
          allocatedEquipmentId: altOffer.suggestedEquipmentId,
          allocatedSlot: altOffer.suggestedSlot,
          approvalNotes: `Reallocated via GenAI Optimizer: ${altOffer.details}`
        };
      }

      return r;
    });

    saveRequests(updated);
  };

  // Identify all active conflict groups (requests that clash on the same equipment and slot)
  const getActiveConflicts = (): Array<{
    conflictId: string;
    equipment: EquipmentItem;
    slot: { date: string; startTime: string; endTime: string };
    requests: ProjectAccessRequest[];
  }> => {
    const conflictGroups: Map<string, ProjectAccessRequest[]> = new Map();

    requests.filter(r => r.status === 'Conflicted').forEach(r => {
      const key = `${r.equipmentId}_${r.requestedSlot.date}_${r.requestedSlot.startTime}`;
      const group = conflictGroups.get(key) || [];
      group.push(r);
      conflictGroups.set(key, group);
    });

    const results: Array<{
      conflictId: string;
      equipment: EquipmentItem;
      slot: { date: string; startTime: string; endTime: string };
      requests: ProjectAccessRequest[];
    }> = [];
    Array.from(conflictGroups.entries()).forEach(([key, reqGroup]) => {
      if (reqGroup.length >= 2) {
        const eq = equipment.find(e => e.id === reqGroup[0].equipmentId) || equipment[0];
        results.push({
          conflictId: `cnf-${key}`,
          equipment: eq,
          slot: reqGroup[0].requestedSlot,
          requests: reqGroup
        });
      }
    });
    return results;
  };

  // Reset to initial mock data (convenient for reviewers/testers)
  const resetDemoData = () => {
    saveEquipment(INITIAL_EQUIPMENT);
    saveRequests(INITIAL_REQUESTS);
  };

  return {
    equipment,
    requests,
    activeRole,
    isLoaded,
    switchRole,
    submitRequest,
    approveRequest,
    rejectRequest,
    applyConflictResolution,
    getActiveConflicts,
    resetDemoData
  };
}
