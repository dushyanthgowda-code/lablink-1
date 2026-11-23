import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_EQUIPMENT } from '@/lib/mock-data';
import { calculateUtilizationMetrics } from '@/lib/analytics-engine';
import { EquipmentItem } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const equipmentList: EquipmentItem[] = body.equipment && Array.isArray(body.equipment) && body.equipment.length > 0 
      ? body.equipment 
      : INITIAL_EQUIPMENT;

    const metrics = calculateUtilizationMetrics(equipmentList);

    return NextResponse.json({
      success: true,
      data: metrics
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to compute utilization metrics';
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
