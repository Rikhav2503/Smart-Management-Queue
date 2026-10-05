import { emit } from './events';
import * as Types from '../types';

const SCHEMA_VERSION = '1.0.0';
const STORAGE_PREFIX = 'careflow_';
const VERSION_KEY = `${STORAGE_PREFIX}schemaVersion`;

interface MockDB {
  users: Types.User[];
  dependents: Types.Dependent[];
  campuses: Types.Campus[];
  departments: Types.Department[];
  doctors: Types.DoctorProfile[];
  services: Types.Service[];
  counters: Types.Counter[];
  appointments: Types.Appointment[];
  tickets: Types.Ticket[];
  prepItems: Types.PrepItem[];
  swaps: Types.SwapRequest[];
  reassignProposals: Types.ReassignProposal[];
  followUps: Types.FollowUp[];
  notifications: Types.Notification[];
  shifts: Types.ShiftAssignment[];
  policy: Types.PolicySettings;
  auditLogs: Types.AuditLog[];
  noShowStats: Types.NoShowStat[];
}

const defaultPolicy: Types.PolicySettings = {
  cancelWindowMins: 120,
  graceMins: 15,
  maxQueueLen: 50,
  agingBoostEveryMins: 30,
  walkInReservePct: 20,
  reassignConsentMins: 15
};

export function getDB(): MockDB {
  if (typeof window === 'undefined') return getEmptyDB();
  const version = localStorage.getItem(VERSION_KEY);
  if (version !== SCHEMA_VERSION) {
    console.log('Schema version mismatch. Resetting DB.');
    return resetDB();
  }
  const dbStr = localStorage.getItem(`${STORAGE_PREFIX}data`);
  if (!dbStr) return resetDB();
  return JSON.parse(dbStr);
}

export function saveDB(db: MockDB) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${STORAGE_PREFIX}data`, JSON.stringify(db));
  localStorage.setItem(VERSION_KEY, SCHEMA_VERSION);
  // Optional: trigger general update
}

export function getEmptyDB(): MockDB {
  return {
    users: [],
    dependents: [],
    campuses: [],
    departments: [],
    doctors: [],
    services: [],
    counters: [],
    appointments: [],
    tickets: [],
    prepItems: [],
    swaps: [],
    reassignProposals: [],
    followUps: [],
    notifications: [],
    shifts: [],
    policy: defaultPolicy,
    auditLogs: [],
    noShowStats: []
  };
}

export function resetDB(): MockDB {
  const empty = getEmptyDB();
  if (typeof window !== 'undefined') {
    saveDB(empty);
  }
  return empty;
}
