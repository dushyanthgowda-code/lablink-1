import { describe, it, expect } from 'vitest';
import { calculateUtilizationMetrics } from '../lib/analytics-engine';
import { INITIAL_EQUIPMENT } from '../lib/mock-data';

describe('Resource Utilization Analytics Engine', () => {
  it('computes metrics across all 5 departments', () => {
    const metrics = calculateUtilizationMetrics(INITIAL_EQUIPMENT);

    expect(metrics.departmentMetrics.length).toBe(5);
    expect(metrics.campusAverageOccupancy).toBeGreaterThan(0);
    expect(metrics.campusAverageOccupancy).toBeLessThanOrEqual(100);
  });

  it('identifies bottleneck assets correctly', () => {
    const metrics = calculateUtilizationMetrics(INITIAL_EQUIPMENT);
    const csDept = metrics.departmentMetrics.find(d => d.department === 'Computer Science & AI');

    expect(csDept).toBeDefined();
    // NVIDIA DGX A100 has 182 hours booked (> 70% capacity)
    const dgx = csDept?.bottleneckAssets.find(b => b.id === 'eq-cs-01');
    expect(dgx).toBeDefined();
  });

  it('identifies underutilized equipment for inter-lab sharing', () => {
    const metrics = calculateUtilizationMetrics(INITIAL_EQUIPMENT);
    const eceDept = metrics.departmentMetrics.find(d => d.department === 'Electronics & Communication');

    expect(eceDept).toBeDefined();
    // Xilinx FPGA has 42 hours booked (< 35% capacity)
    const fpga = eceDept?.underutilizedAssets.find(u => u.id === 'eq-ece-03');
    expect(fpga).toBeDefined();
  });

  it('generates cross-department optimization insights', () => {
    const metrics = calculateUtilizationMetrics(INITIAL_EQUIPMENT);
    expect(metrics.optimizationInsights.length).toBeGreaterThanOrEqual(3);
  });
});
