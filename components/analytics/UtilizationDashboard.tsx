'use client';

import React from 'react';
import { EquipmentItem } from '@/lib/types';
import { calculateUtilizationMetrics } from '@/lib/analytics-engine';
import { 
  BarChart3, 
  TrendingUp, 
  AlertCircle, 
  Sparkles, 
  Cpu, 
  ArrowUpRight, 
  PieChart, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface UtilizationDashboardProps {
  equipmentList: EquipmentItem[];
}

export const UtilizationDashboard: React.FC<UtilizationDashboardProps> = ({
  equipmentList
}) => {
  const { departmentMetrics, campusAverageOccupancy, optimizationInsights } = 
    calculateUtilizationMetrics(equipmentList);

  return (
    <section aria-labelledby="analytics-heading" className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-indigo-950/40 to-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold mb-3">
            <BarChart3 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Campus Resource Telemetry</span>
          </div>
          <h1 id="analytics-heading" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Laboratory Resource Utilisation & Optimization
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-300">
            Real-time occupancy tracking, cross-department sharing metrics, and GenAI recommendations to eliminate lab bottlenecks and idle equipment.
          </p>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-2">
          <span className="text-xs font-semibold text-gray-400">Campus Average Occupancy</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white">{campusAverageOccupancy}%</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" aria-hidden="true" />
              +14% vs last term
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all" 
              style={{ width: `${campusAverageOccupancy}%` }} 
            />
          </div>
        </div>

        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-2">
          <span className="text-xs font-semibold text-gray-400">Tracked Laboratory Assets</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white">{equipmentList.length}</span>
            <span className="text-xs text-gray-400">units across 5 departments</span>
          </div>
          <p className="text-xs text-gray-500">100% telemetry online and calibrated</p>
        </div>

        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-2">
          <span className="text-xs font-semibold text-gray-400">Peak Occupancy Window</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-amber-400">14:00 – 17:00</span>
          </div>
          <p className="text-xs text-gray-400">Slot-shifting algorithms active</p>
        </div>
      </div>

      {/* GenAI Optimization Advisor Banner */}
      <div className="p-5 bg-gradient-to-r from-indigo-950/60 to-purple-950/40 border border-indigo-500/40 rounded-2xl space-y-3 shadow-lg">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-indigo-400" aria-hidden="true" />
          <h2 className="text-sm font-bold text-indigo-200">
            GenAI Resource Utilisation Advisor
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {optimizationInsights.map((insight, idx) => (
            <div key={idx} className="p-3 bg-gray-950/60 border border-indigo-900/40 rounded-xl text-xs text-gray-200 leading-relaxed">
              <span className="font-bold text-indigo-300 block mb-1">Recommendation #{idx + 1}:</span>
              {insight}
            </div>
          ))}
        </div>
      </div>

      {/* Department Breakdown & Bottleneck Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Utilization Bar Chart */}
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <PieChart className="w-4 h-4 text-indigo-400" aria-hidden="true" />
            <span>Department Utilization Rates</span>
          </h3>

          <div className="space-y-3 pt-2">
            {departmentMetrics.map((dept) => (
              <div key={dept.department} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-gray-300">{dept.department}</span>
                  <span className="text-white font-bold">{dept.occupancyPercentage}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all ${
                      dept.occupancyPercentage > 75
                        ? 'bg-amber-500'
                        : dept.occupancyPercentage > 40
                        ? 'bg-indigo-600'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, dept.occupancyPercentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottleneck vs Underutilized Assets */}
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-400" aria-hidden="true" />
            <span>Bottleneck & Underutilized Hardware Audit</span>
          </h3>

          <div className="space-y-3 pt-2 text-xs">
            <div>
              <span className="text-amber-400 font-bold block mb-1.5 uppercase tracking-wider text-[11px]">
                High-Contention Bottlenecks (&gt;70% Capacity)
              </span>
              <ul className="space-y-1.5">
                {departmentMetrics.flatMap(d => d.bottleneckAssets).slice(0, 3).map((item, i) => (
                  <li key={i} className="p-2 bg-gray-950 border border-gray-800 rounded flex justify-between items-center">
                    <span className="text-white font-medium">{item.name}</span>
                    <span className="text-amber-400 font-bold">{item.bookingDemandMultiplier}x nominal demand</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              <span className="text-emerald-400 font-bold block mb-1.5 uppercase tracking-wider text-[11px]">
                Underutilized (Prime Candidates for Inter-Lab Sharing)
              </span>
              <ul className="space-y-1.5">
                {departmentMetrics.flatMap(d => d.underutilizedAssets).slice(0, 3).map((item, i) => (
                  <li key={i} className="p-2 bg-gray-950 border border-gray-800 rounded flex justify-between items-center">
                    <span className="text-white font-medium">{item.name}</span>
                    <span className="text-emerald-400 font-bold">{item.utilizationRate}% utilized</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
