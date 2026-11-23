import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_EQUIPMENT } from '@/lib/mock-data';
import { searchEquipment } from '@/lib/discovery-engine';
import { sanitizeInput } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawQuery = typeof body.query === 'string' ? body.query : '';
    const cleanQuery = sanitizeInput(rawQuery.slice(0, 300));
    const department = body.department || 'All';
    const category = body.category || 'All';

    // Base search results from campus discovery engine
    const results = searchEquipment(INITIAL_EQUIPMENT, {
      query: cleanQuery,
      department,
      category
    });

    let aiExplanation = '';

    // If Gemini API key is configured, enrich with GenAI synthesis
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && cleanQuery) {
      try {
        const prompt = `You are LabLink's AI Campus Resource Concierge.
Student Query: "${cleanQuery}"
Top Matched Equipment:
${results.slice(0, 3).map((r, i) => `${i + 1}. ${r.equipment.name} (${r.equipment.department}) - Location: ${r.equipment.labLocation}. Specs: ${JSON.stringify(r.equipment.specs)}`).join('\n')}

Provide a concise, highly insightful 2-sentence recommendation to the student explaining why the top match fits their project requirements and which prerequisites or lab safety rules they should anticipate.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { maxOutputTokens: 150, temperature: 0.2 }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          aiExplanation = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
        }
      } catch (geminiErr: unknown) {
        console.warn('Gemini API fetch error, using fallback narrative:', geminiErr);
      }
    }

    if (!aiExplanation && results.length > 0 && cleanQuery) {
      const top = results[0];
      aiExplanation = `LabLink GenAI Matcher identified ${top.equipment.name} in ${top.equipment.labLocation} as the optimal fit. It matches your technical requirements (${top.matchReasons.join(', ')}) with safety clearance level "${top.equipment.safetyLevel}".`;
    }

    return NextResponse.json({
      success: true,
      query: cleanQuery,
      results,
      aiExplanation: aiExplanation || 'Displaying available cross-department laboratory resources matching your criteria.'
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to process discovery request';
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
