import { EquipmentItem, Department, EquipmentCategory } from './types';

export interface DiscoveryFilter {
  query?: string;
  department?: Department | 'All';
  category?: EquipmentCategory | 'All';
  onlyAvailable?: boolean;
}

export interface RecommendationResult {
  equipment: EquipmentItem;
  matchScore: number;
  matchReasons: string[];
}

/**
 * Natural language intent keywords mapped to campus equipment domains
 */
const INTENT_TAXONOMY: Record<string, string[]> = {
  ai_training: ['llm', 'deep learning', 'pytorch', 'tensorflow', 'neural', 'training', 'cuda', 'gpu', 'vision transformer', 'model'],
  edge_robotics: ['robot', 'robotics', 'arm', 'ros', 'ros2', 'slam', 'jetson', 'edge', 'drone', 'cobot', 'autonomous', 'kinematics'],
  rf_hardware: ['rf', 'antenna', 'wireless', 'signal', 'oscilloscope', 'spectrum', 'ghz', 'mhz', 'frequency', 'can', 'spi', 'i2c', 'waveform', 'emi'],
  fpga_vlsi: ['fpga', 'verilog', 'vhdl', 'zynq', 'asic', 'embedded', 'hardware accelerator'],
  rapid_proto: ['3d print', 'carbon fiber', 'fabrication', 'chassis', 'additive', 'prototype', 'cad'],
  biotech_genomics: ['pcr', 'dna', 'rna', 'gene', 'cycling', 'molecular', 'fluorescence', 'assay', 'cell'],
  nanotech_materials: ['sem', 'electron microscope', 'microscopy', 'nanoscale', 'eds', 'surface', 'topography', 'hplc', 'chromatography']
};

/**
 * Discovers and ranks equipment based on natural language queries and filters
 */
export function searchEquipment(
  items: EquipmentItem[],
  filter: DiscoveryFilter
): RecommendationResult[] {
  const query = (filter.query || '').trim().toLowerCase();
  const queryTokens = query.split(/\s+/).filter(t => t.length > 2);

  return items
    .filter(item => {
      if (filter.department && filter.department !== 'All' && item.department !== filter.department) {
        return false;
      }
      if (filter.category && filter.category !== 'All' && item.category !== filter.category) {
        return false;
      }
      if (filter.onlyAvailable && item.status !== 'Available') {
        return false;
      }
      return true;
    })
    .map(item => {
      let score = 50; // base baseline
      const matchReasons: string[] = [];

      if (!query) {
        return { equipment: item, matchScore: 100, matchReasons: ['Direct catalog listing'] };
      }

      // 1. Direct name match
      if (item.name.toLowerCase().includes(query)) {
        score += 45;
        matchReasons.push(`Exact title match for "${query}"`);
      }

      // 2. Tag matches
      item.tags.forEach(tag => {
        if (query.includes(tag.toLowerCase()) || tag.toLowerCase().includes(query)) {
          score += 20;
          matchReasons.push(`Matched technical tag: #${tag}`);
        }
      });

      // 3. Spec & Description matches
      const textCorpus = (item.description + ' ' + Object.entries(item.specs).map(([k, v]) => `${k} ${v}`).join(' ')).toLowerCase();
      queryTokens.forEach(token => {
        if (textCorpus.includes(token)) {
          score += 10;
          matchReasons.push(`Specification match for "${token}"`);
        }
      });

      // 4. Semantic Intent matches
      Object.entries(INTENT_TAXONOMY).forEach(([intent, keywords]) => {
        const queryHasIntent = keywords.some(kw => query.includes(kw));
        if (queryHasIntent) {
          const itemMatchesIntent = keywords.some(kw => textCorpus.includes(kw) || item.name.toLowerCase().includes(kw));
          if (itemMatchesIntent) {
            score += 25;
            matchReasons.push(`Intent match: ${intent.replace('_', ' ').toUpperCase()}`);
          }
        }
      });

      return {
        equipment: item,
        matchScore: Math.min(100, score),
        matchReasons: Array.from(new Set(matchReasons))
      };
    })
    .filter(res => res.matchScore > 50)
    .sort((a, b) => b.matchScore - a.matchScore);
}
