import { getDB, saveDB, getEmptyDB } from './db';
import * as Types from '../types';

export function seedDemoData() {
  const db = getEmptyDB();
  
  // 1. Users
  db.users.push(
    { id: 'u_patient', role: 'PATIENT', name: 'Demo Patient', phone: '1234567890', email: 'patient@demo.com', passwordHash: 'Demo@1234' },
    { id: 'u_reception', role: 'RECEPTIONIST', name: 'Demo Receptionist', phone: '1234567891', email: 'reception@demo.com', passwordHash: 'Demo@1234' },
    { id: 'u_doctor', role: 'DOCTOR', name: 'Dr. Demo', phone: '1234567892', email: 'doctor@demo.com', passwordHash: 'Demo@1234' },
    { id: 'u_admin', role: 'ADMIN', name: 'Demo Admin', phone: '1234567893', email: 'admin@demo.com', passwordHash: 'Demo@1234' }
  );

  // Receptionists
  for (let i = 1; i <= 3; i++) {
    db.users.push({ id: `u_rec_${i}`, role: 'RECEPTIONIST', name: `Receptionist ${i}`, phone: `223456789${i}`, email: `rec${i}@demo.com`, passwordHash: 'Demo@1234' });
  }

  // Doctors
  for (let i = 1; i <= 11; i++) {
    db.users.push({ id: `u_doc_${i}`, role: 'DOCTOR', name: `Dr. Doc ${i}`, phone: `323456789${i}`, email: `doc${i}@demo.com`, passwordHash: 'Demo@1234' });
  }

  // Patients
  for (let i = 1; i <= 49; i++) {
    db.users.push({ id: `u_pat_${i}`, role: 'PATIENT', name: `Patient ${i}`, phone: `423456789${i % 10}`, email: `pat${i}@demo.com`, passwordHash: 'Demo@1234' });
  }

  // 2. Campuses
  db.campuses.push(
    { id: 'c_1', name: 'North Campus', address: '123 Health Way', openHours: '08:00-20:00', qrCode: 'QR_NORTH' },
    { id: 'c_2', name: 'South Campus', address: '456 Wellness Blvd', openHours: '24/7', qrCode: 'QR_SOUTH' }
  );

  // 3. Departments
  db.departments.push(
    { id: 'd_cardio', campusId: 'c_1', name: 'Cardiology' },
    { id: 'd_ortho', campusId: 'c_1', name: 'Orthopedics' },
    { id: 'd_neuro', campusId: 'c_1', name: 'Neurology' },
    { id: 'd_peds', campusId: 'c_1', name: 'Pediatrics' },
    { id: 'd_gen', campusId: 'c_2', name: 'General Medicine' },
    { id: 'd_derma', campusId: 'c_2', name: 'Dermatology' },
    { id: 'd_support', campusId: 'c_1', name: 'Support Services' }
  );

  // 4. Non-OPD Services
  db.services.push(
    { id: 's_lab', departmentId: 'd_support', kind: 'LAB', name: 'Blood Test', avgMins: 15, slaMins: 30, prep: { fastingHours: 12, requiredDocs: [], insuranceCheck: false } },
    { id: 's_rad', departmentId: 'd_support', kind: 'RADIOLOGY', name: 'X-Ray', avgMins: 20, slaMins: 45, prep: { requiredDocs: ['Referral'], insuranceCheck: true } },
    { id: 's_pharm', departmentId: 'd_support', kind: 'PHARMACY', name: 'Prescription Pickup', avgMins: 5, slaMins: 15, prep: { requiredDocs: [], insuranceCheck: true } },
    { id: 's_bill', departmentId: 'd_support', kind: 'BILLING', name: 'Discharge Billing', avgMins: 10, slaMins: 20, prep: { requiredDocs: [], insuranceCheck: true } }
  );

  // OPD Services (one per department as an example)
  db.services.push(
    { id: 's_opd_cardio', departmentId: 'd_cardio', kind: 'OPD', name: 'Cardiology Consult', avgMins: 20, slaMins: 60, prep: { requiredDocs: [], insuranceCheck: false } },
    { id: 's_opd_ortho', departmentId: 'd_ortho', kind: 'OPD', name: 'Orthopedics Consult', avgMins: 15, slaMins: 60, prep: { requiredDocs: [], insuranceCheck: false } }
  );

  // 5. Doctors Profile
  db.doctors.push({ userId: 'u_doctor', departmentId: 'd_cardio', specialty: 'Interventional Cardiology', qualification: 'MD, DM', avgConsultMins: 20 });
  for (let i = 1; i <= 11; i++) {
    db.doctors.push({ userId: `u_doc_${i}`, departmentId: i % 2 === 0 ? 'd_cardio' : 'd_ortho', specialty: 'Specialist', qualification: 'MD', avgConsultMins: 15 });
  }

  // 6. Counters
  for (let i = 1; i <= 10; i++) {
    db.counters.push({
      id: `cnt_${i}`,
      campusId: 'c_1',
      name: `Counter ${i}`,
      departmentId: i <= 5 ? 'd_cardio' : 'd_support',
      serviceIds: i <= 5 ? ['s_opd_cardio'] : ['s_lab', 's_rad', 's_pharm', 's_bill'],
      status: 'AVAILABLE'
    });
  }

  // 7. Historical Tickets
  const now = Date.now();
  for (let i = 1; i <= 400; i++) {
    db.tickets.push({
      id: `t_hist_${i}`,
      code: `H${i.toString().padStart(3, '0')}`,
      campusId: 'c_1',
      serviceId: i % 2 === 0 ? 's_opd_cardio' : 's_lab',
      doctorId: i % 2 === 0 ? 'u_doctor' : undefined,
      patientId: `u_pat_${(i % 49) + 1}`,
      source: 'KIOSK',
      tier: 'STANDARD',
      status: 'COMPLETED',
      joinedAt: now - (i * 1000 * 60 * 60), // spread over past hours
      calledAt: now - (i * 1000 * 60 * 60) + 1000 * 60 * 10,
      startedAt: now - (i * 1000 * 60 * 60) + 1000 * 60 * 12,
      endedAt: now - (i * 1000 * 60 * 60) + 1000 * 60 * 30,
      swapUsed: false,
      readinessScore: 100,
      outcome: 'COMPLETED'
    });
  }

  saveDB(db);
}
