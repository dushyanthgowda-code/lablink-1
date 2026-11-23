'use client';

import React, { useState } from 'react';
import { useLabStore } from '@/lib/store';
import { Navbar } from '@/components/Navbar';
import { EquipmentCatalog } from '@/components/discovery/EquipmentCatalog';
import { BookingModal } from '@/components/booking/BookingModal';
import { ConflictResolverView } from '@/components/conflicts/ConflictResolverView';
import { FacultyApprovalDesk } from '@/components/faculty/FacultyApprovalDesk';
import { UtilizationDashboard } from '@/components/analytics/UtilizationDashboard';
import { ToastNotification, ToastMessage } from '@/components/ui/ToastNotification';
import { 
  EquipmentItem, 
  ConflictResolutionRecommendation, 
  ProjectAccessRequest 
} from '@/lib/types';

export default function HomePage() {
  const {
    equipment,
    requests,
    activeRole,
    switchRole,
    submitRequest,
    approveRequest,
    rejectRequest,
    applyConflictResolution,
    getActiveConflicts,
    resetDemoData
  } = useLabStore();

  const [activeView, setActiveView] = useState<'discovery' | 'conflicts' | 'faculty' | 'analytics'>('discovery');
  const [selectedBookingEquipment, setSelectedBookingEquipment] = useState<EquipmentItem | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'warning' | 'info', title: string, message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const conflicts = getActiveConflicts();
  const pendingRequests = requests.filter(r => r.status === 'Pending Approval');

  const handleOpenBooking = (item: EquipmentItem) => {
    setSelectedBookingEquipment(item);
    setIsBookingModalOpen(true);
  };

  const handleSubmitBooking = (
    reqData: Omit<ProjectAccessRequest, 'id' | 'status' | 'createdAt' | 'studentUsageHoursPastMonth'>
  ) => {
    const newReq = submitRequest(reqData);
    if (newReq.status === 'Conflicted') {
      addToast(
        'warning',
        'Scheduling Conflict Detected',
        `Slot on ${selectedBookingEquipment?.name} clashes with another project. GenAI resolution triggered in Conflicts view.`
      );
    } else {
      addToast(
        'success',
        'Project Request Submitted',
        `Your slot request for ${selectedBookingEquipment?.name} has been routed to ${reqData.facultyAdvisor} for approval.`
      );
    }
  };

  const handleApplyResolution = (resolution: ConflictResolutionRecommendation) => {
    applyConflictResolution(resolution);
    addToast(
      'success',
      'AI Fair Allocation Applied',
      `Primary slot awarded to ${resolution.primaryWinnerName}. Runner-up reallocated to alternate resource.`
    );
  };

  const handleFacultyApprove = (reqId: string, notes?: string) => {
    approveRequest(reqId, notes);
    addToast('success', 'Request Approved', `Project access request #${reqId} has been authorized.`);
  };

  const handleFacultyReject = (reqId: string, reason: string) => {
    rejectRequest(reqId, reason);
    addToast('info', 'Request Declined', `Project access request #${reqId} declined.`);
  };

  const handleResetData = () => {
    resetDemoData();
    addToast('info', 'Sample Data Restored', 'Demonstration lab inventory and sample conflict scenarios reset.');
  };

  return (
    <div className="flex-1 flex flex-col">
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        activeRole={activeRole}
        onSwitchRole={switchRole}
        conflictCount={conflicts.length}
        pendingCount={pendingRequests.length}
        onResetData={handleResetData}
      />

      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'discovery' && (
          <EquipmentCatalog
            equipmentList={equipment}
            onRequestBooking={handleOpenBooking}
          />
        )}

        {activeView === 'conflicts' && (
          <ConflictResolverView
            conflicts={conflicts}
            allEquipment={equipment}
            onApplyResolution={handleApplyResolution}
          />
        )}

        {activeView === 'faculty' && (
          <FacultyApprovalDesk
            requests={requests}
            equipmentList={equipment}
            onApprove={handleFacultyApprove}
            onReject={handleFacultyReject}
          />
        )}

        {activeView === 'analytics' && (
          <UtilizationDashboard
            equipmentList={equipment}
          />
        )}
      </main>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        equipment={selectedBookingEquipment}
        onSubmit={handleSubmitBooking}
      />

      {/* Accessible Notifications */}
      <ToastNotification
        toasts={toasts}
        onDismiss={(id) => setToasts(prev => prev.filter(t => t.id !== id))}
      />
    </div>
  );
}
