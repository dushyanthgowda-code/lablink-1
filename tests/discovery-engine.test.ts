import { describe, it, expect } from 'vitest';
import { searchEquipment } from '../lib/discovery-engine';
import { INITIAL_EQUIPMENT } from '../lib/mock-data';

describe('Campus Equipment Discovery Engine', () => {
  it('identifies AI workstations for deep learning queries', () => {
    const results = searchEquipment(INITIAL_EQUIPMENT, {
      query: 'deep learning PyTorch LLM training'
    });

    expect(results.length).toBeGreaterThan(0);
    const topResult = results[0];
    expect(topResult.equipment.tags).toContain('Deep Learning');
    expect(topResult.matchScore).toBeGreaterThan(70);
  });

  it('filters equipment accurately by department', () => {
    const results = searchEquipment(INITIAL_EQUIPMENT, {
      department: 'Biotechnology & Materials'
    });

    expect(results.length).toBe(2);
    results.forEach(r => {
      expect(r.equipment.department).toBe('Biotechnology & Materials');
    });
  });

  it('filters equipment accurately by category', () => {
    const results = searchEquipment(INITIAL_EQUIPMENT, {
      category: 'Development Kit'
    });

    expect(results.length).toBeGreaterThan(0);
    results.forEach(r => {
      expect(r.equipment.category).toBe('Development Kit');
    });
  });

  it('filters by availability status', () => {
    const results = searchEquipment(INITIAL_EQUIPMENT, {
      onlyAvailable: true
    });

    results.forEach(r => {
      expect(r.equipment.status).toBe('Available');
    });
  });

  it('matches intent for RF microwave instruments', () => {
    const results = searchEquipment(INITIAL_EQUIPMENT, {
      query: 'spectrum analyzer wireless antenna'
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].equipment.name).toContain('Spectrum Analyzer');
  });
});
