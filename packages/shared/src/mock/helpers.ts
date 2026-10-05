import { Ticket, PolicySettings, SlotCrowdLevel, ReassignProposal, PriorityTier } from '../types';

export function orderQueue(tickets: Ticket[], policy: PolicySettings, currentTimeMs: number = Date.now()): Ticket[] {
  const tiers: Record<PriorityTier, number> = {
    EMERGENCY: 5,
    SENIOR: 4,
    MATERNITY: 3,
    ACCESSIBLE: 2,
    STANDARD: 1
  };

  return [...tickets].sort((a, b) => {
    // 1. Calculate effective tiers based on aging
    const getEffectiveTier = (ticket: Ticket) => {
      let baseVal = tiers[ticket.tier];
      if (ticket.tier !== 'EMERGENCY') {
        const waitMins = (currentTimeMs - ticket.joinedAt) / 60000;
        const bumps = Math.floor(waitMins / policy.agingBoostEveryMins);
        baseVal = Math.min(tiers['EMERGENCY'] - 1, baseVal + bumps);
      }
      return baseVal;
    };

    const effectiveA = getEffectiveTier(a);
    const effectiveB = getEffectiveTier(b);

    if (effectiveA !== effectiveB) {
      return effectiveB - effectiveA; // Higher tier first
    }

    // 2. Sort by joinedAt
    return a.joinedAt - b.joinedAt;
  });
}

export function fairnessScore(tickets: Ticket[], currentTimeMs: number = Date.now()): number {
  if (tickets.length === 0) return 100;
  
  // A simple fairness score: penalty for tickets waiting over SLA or significantly longer than others in same tier
  // Placeholder implementation:
  const waitTimes = tickets.map(t => (currentTimeMs - t.joinedAt) / 60000);
  const maxWait = Math.max(...waitTimes);
  if (maxWait === 0) return 100;
  
  const avgWait = waitTimes.reduce((sum, val) => sum + val, 0) / waitTimes.length;
  // Variance
  const variance = waitTimes.reduce((sum, val) => sum + Math.pow(val - avgWait, 2), 0) / waitTimes.length;
  const stdDev = Math.sqrt(variance);

  // Score decreases as stdDev increases relative to avgWait
  const coefficientOfVariation = stdDev / avgWait;
  const score = Math.max(0, 100 - (coefficientOfVariation * 50)); 
  return Math.round(score);
}

export function slotCrowdLevel(
  doctorId: string, 
  slot: string, 
  bookedCount: number, 
  capacity: number
): SlotCrowdLevel {
  const ratio = bookedCount / capacity;
  if (ratio < 0.5) return 'QUIET';
  if (ratio < 0.8) return 'MODERATE';
  return 'BUSY';
}

// reassignTickets will be part of the mock API or an API handler because it needs to read/write state
