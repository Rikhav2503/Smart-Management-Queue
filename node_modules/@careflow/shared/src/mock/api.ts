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
    }
    // ... add more as needed
  },

  swaps: {
    request: async (fromTicketId: string, toTicketId: string) => {
      const db = getDB();
      const swap: Types.SwapRequest = { id: `sw_${Date.now()}`, fromTicketId, toTicketId, status: 'PENDING' };
      db.swaps.push(swap);
      saveDB(db);
      return simulateLatency(swap);
    }
  }
};
