import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_EQUIPMENT } from '@/lib/mock-data';
import { resolveSchedulingConflict } from '@/lib/conflict-engine';
import { ProjectAccessRequest, EquipmentItem } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conflictId, equipmentId, competingRequests, allEquipment } = body as {
      conflictId: string;
      equipmentId: string;
      competingRequests: ProjectAccessRequest[];
      allEquipment?: EquipmentItem[];
    };

    if (!competingRequests || competingRequests.length < 2) {
      return NextResponse.json(
        { success: false, error: 'At least two competing requests are required to resolve a scheduling conflict.' },
        { status: 400 }
      );
    }

    const equipmentList = allEquipment && allEquipment.length > 0 ? allEquipment : INITIAL_EQUIPMENT;
    const targetEquipment = equipmentList.find(e => e.id === equipmentId) || equipmentList[0];

    // Algorithmic multi-factor resolution
    const baseResolution = resolveSchedulingConflict(
      conflictId || `cnf-${Date.now()}`,
      targetEquipment,
      equipmentList,
      competingRequests
    );

    // If Gemini API is available, enrich with LLM mediation synthesis
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const prompt = `You are LabLink's Fair Scheduling & Conflict Resolution AI for University Research Labs.
A scheduling clash occurred on equipment: "${targetEquipment.name}" (${targetEquipment.department}).
Conflicting Slot: ${baseResolution.conflictingSlot.date} from ${baseResolution.conflictingSlot.startTime} to ${baseResolution.conflictingSlot.endTime}.

Candidates:
${baseResolution.candidates.map((c, i) => `${i + 1}. Student: ${c.request.studentName} | Project: "${c.request.projectTitle}" (${c.request.projectCategory}) | Deadline: ${c.request.projectDeadline} | Past Hours Booked This Month: ${c.request.studentUsageHoursPastMonth}h | Fairness Score: ${c.scores.compositeFairnessScore}/100`).join('\n')}

The algorithmic winner is ${baseResolution.primaryWinnerName}.
Alternative arrangement offered to runner up: ${JSON.stringify(baseResolution.alternativeOffers)}

Write a professional, diplomatic, and transparent 2-to-3 sentence explanation explaining why this allocation upholds academic integrity, deadline urgency, and resource equity, while reassuring the non-allocated student that their project progress is preserved.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { maxOutputTokens: 200, temperature: 0.3 }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const llmText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (llmText) {
            baseResolution.rationale = llmText;
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini conflict synthesis error, using algorithmic rationale:', geminiErr);
      }
    }

    return NextResponse.json({
      success: true,
      resolution: baseResolution
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to resolve scheduling conflict' },
      { status: 500 }
    );
  }
}
