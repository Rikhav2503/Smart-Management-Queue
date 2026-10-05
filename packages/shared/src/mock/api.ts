import { getDB, saveDB, resetDB } from './db';
import { emit } from './events';
import * as Types from '../types';
import { seedDemoData } from './seed';
import { orderQueue } from './helpers';

const simulateLatency = <T>(result: T, shouldFail = false): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) reject(new Error('Simulated network failure'));
      else resolve(result);
    }, Math.random() * 300 + 300); // 300-600ms latency
  });
};

export const mockApi = {
  auth: {
    login: async (email: string, passwordHash: string) => {
      const db = getDB();
      const user = db.users.find(u => u.email === email && u.passwordHash === passwordHash);
      if (!user) throw new Error('Invalid credentials');
      return simulateLatency(user);
    },
    logout: async () => simulateLatency(true)
  },
  
  system: {
    resetDemoData: async () => {
      resetDB();
      seedDemoData();
      emit({ type: 'policy:updated', payload: {} });
      return simulateLatency(true);
    }
  },

  departments: {
    list: async () => {
      return simulateLatency(getDB().departments);
    }
  },

  services: {
    list: async () => {
      return simulateLatency(getDB().services);
    }
  },

  doctors: {
    list: async () => {
      const db = getDB();
      const docs = db.doctors.map(profile => {
        const user = db.users.find(u => u.id === profile.userId);
        return { ...profile, user };
      });
      return simulateLatency(docs);
    }
  },

  tickets: {
    listActive: async (doctorId?: string) => {
      const db = getDB();
      let active = db.tickets.filter(t => ['WAITING', 'CALLED', 'SERVING'].includes(t.status));
      if (doctorId) {
        active = active.filter(t => t.doctorId === doctorId);
      }
      return simulateLatency(active);
    },
    join: async (payload: Omit<Types.Ticket, 'id' | 'code' | 'status' | 'joinedAt' | 'swapUsed' | 'readinessScore'>) => {
      const db = getDB();
      const newTicket: Types.Ticket = {
        ...payload,
        id: `t_${Date.now()}`,
        code: `A${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        status: 'WAITING',
        joinedAt: Date.now(),
        swapUsed: false,
        readinessScore: 100 // simplified
      };
      db.tickets.push(newTicket);
      saveDB(db);
      emit({ type: 'ticket:created', payload: newTicket });
      return simulateLatency(newTicket);
    },
    cancel: async (id: string) => {
      const db = getDB();
      const t = db.tickets.find(t => t.id === id);
      if (t) {
        t.status = 'CANCELLED';
        saveDB(db);
        emit({ type: 'ticket:updated', payload: t });
      }
      return simulateLatency(t);
    },
    callNext: async (doctorId: string) => {
      const db = getDB();
      // Use policy for orderQueue
      let waiting = db.tickets.filter(t => t.doctorId === doctorId && t.status === 'WAITING');
      waiting = orderQueue(waiting, db.policy);
      if (waiting.length === 0) return simulateLatency(null);
      const next = waiting[0];
      next.status = 'CALLED';
      next.calledAt = Date.now();
      saveDB(db);
      emit({ type: 'ticket:updated', payload: next });
      return simulateLatency(next);
    },
    startConsult: async (ticketId: string) => {
      const db = getDB();
      const t = db.tickets.find(t => t.id === ticketId);
      if (t) {
        t.status = 'SERVING';
        t.startedAt = Date.now();
        saveDB(db);
        emit({ type: 'ticket:updated', payload: t });
      }
      return simulateLatency(t);
    },
    completeConsult: async (ticketId: string, outcome: Types.TicketOutcome, note?: string) => {
      const db = getDB();
      const t = db.tickets.find(t => t.id === ticketId);
      if (t) {
        t.status = 'DONE';
        t.endedAt = Date.now();
        t.outcome = outcome;
        t.note = note;
        saveDB(db);
        emit({ type: 'ticket:updated', payload: t });
      }
      return simulateLatency(t);
    },
    updateStatus: async (ticketId: string, status: Types.TicketStatus) => {
      const db = getDB();
      const t = db.tickets.find(t => t.id === ticketId);
      if (t) {
        t.status = status;
        saveDB(db);
        emit({ type: 'ticket:updated', payload: t });
      }
      return simulateLatency(t);
    },
    updateTier: async (ticketId: string, tier: Types.PriorityTier) => {
      const db = getDB();
      const t = db.tickets.find(t => t.id === ticketId);
      if (t) {
        t.tier = tier;
        saveDB(db);
        emit({ type: 'ticket:updated', payload: t });
      }
    }
  },

  swaps: {
    request: async (fromTicketId: string, toTicketId: string) => {
      const db = getDB();
      const swap: Types.SwapRequest = { id: `sw_${Date.now()}`, fromTicketId, toTicketId, status: 'PENDING' };
      db.swaps.push(swap);
      saveDB(db);
      return simulateLatency(swap);
    }
  },

  doctorStatus: {
    setStatus: async (doctorId: string, status: Types.CounterStatus) => {
      const db = getDB();
      const counter = db.counters.find(c => c.providerUserId === doctorId);
      if (counter) {
        counter.status = status;
        if (status !== 'AVAILABLE') {
          // Trigger reassignTickets mock behavior
          const waiting = db.tickets.filter(t => t.doctorId === doctorId && t.status === 'WAITING');
          waiting.forEach(t => {
            const proposal: Types.ReassignProposal = {
              id: `rp_${Date.now()}_${t.id}`,
              ticketId: t.id,
              fromDoctorId: doctorId,
              toDoctorId: 'u_doc_1', // dummy assignment to another doc
              status: 'PENDING',
              expiresAt: Date.now() + db.policy.reassignConsentMins * 60000
            };
            db.reassignProposals.push(proposal);
            emit({ type: 'reassign:proposed', payload: proposal });
          });
        }
        saveDB(db);
        emit({ type: 'doctor:status', payload: counter });
      }
      return simulateLatency(counter);
    }
  },

  reassignProposals: {
    list: async (doctorId: string) => {
      const db = getDB();
      return simulateLatency(db.reassignProposals.filter(rp => rp.fromDoctorId === doctorId));
    }
  },
  
  queue: {
    getAllByLane: async () => {
      const db = getDB();
      const active = db.tickets.filter(t => t.status === 'WAITING' || t.status === 'CALLED' || t.status === 'SERVING');
      const byTier = {
        EMERGENCY: orderQueue(active.filter(t => t.tier === 'EMERGENCY'), db.policy),
        SENIOR: orderQueue(active.filter(t => t.tier === 'SENIOR'), db.policy),
        MATERNITY: orderQueue(active.filter(t => t.tier === 'MATERNITY'), db.policy),
        ACCESSIBLE: orderQueue(active.filter(t => t.tier === 'ACCESSIBLE'), db.policy),
        STANDARD: orderQueue(active.filter(t => t.tier === 'STANDARD'), db.policy),
      };
      return simulateLatency(byTier);
    }
  }
};
