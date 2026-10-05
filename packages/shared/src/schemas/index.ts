import { z } from 'zod';

export const RoleSchema = z.enum(['PATIENT', 'RECEPTIONIST', 'DOCTOR', 'ADMIN']);
export const PriorityTierSchema = z.enum(['EMERGENCY', 'SENIOR', 'MATERNITY', 'ACCESSIBLE', 'STANDARD']);
export const ServiceKindSchema = z.enum(['OPD', 'LAB', 'RADIOLOGY', 'PHARMACY', 'BILLING']);
export const CounterStatusSchema = z.enum(['AVAILABLE', 'ROUNDS', 'OT', 'BREAK', 'CLOSED']);
export const AppointmentStatusSchema = z.enum(['BOOKED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED', 'NO_SHOW']);
export const TicketSourceSchema = z.enum(['APPOINTMENT', 'REMOTE', 'KIOSK']);
export const TicketStatusSchema = z.enum(['WAITING', 'CALLED', 'SERVING', 'DONE', 'NO_SHOW', 'CANCELLED']);
export const TicketOutcomeSchema = z.enum(['COMPLETED', 'FOLLOW_UP', 'LAB_ORDERED', 'REFERRED']);
export const PrepItemKindSchema = z.enum(['DOC', 'FASTING', 'INSURANCE']);
export const SwapRequestStatusSchema = z.enum(['PENDING', 'ACCEPTED', 'DECLINED']);
export const ReassignProposalStatusSchema = z.enum(['PENDING', 'ACCEPTED', 'KEPT_WAITING', 'EXPIRED']);
export const FollowUpStatusSchema = z.enum(['PENDING', 'BOOKED', 'DONE']);
export const SlotCrowdLevelSchema = z.enum(['QUIET', 'MODERATE', 'BUSY']);

export const UserSchema = z.object({
  id: z.string(),
  role: RoleSchema,
  name: z.string(),
  phone: z.string().regex(/^\d{10}$/, 'Must be a 10-digit number'),
  email: z.string().email(),
  passwordHash: z.string()
});

export const DependentSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  name: z.string(),
  relation: z.string(),
  dob: z.string() // ISO date string
});

export const CampusSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  openHours: z.string(),
  qrCode: z.string()
});

export const DepartmentSchema = z.object({
  id: z.string(),
  campusId: z.string(),
  name: z.string()
});

export const DoctorProfileSchema = z.object({
  userId: z.string(),
  departmentId: z.string(),
  specialty: z.string(),
  qualification: z.string(),
  avgConsultMins: z.number(),
  counterId: z.string().optional()
});

export const ServiceSchema = z.object({
  id: z.string(),
  departmentId: z.string(),
  kind: ServiceKindSchema,
  name: z.string(),
  avgMins: z.number(),
  slaMins: z.number(),
  prep: z.object({
    fastingHours: z.number().optional(),
    requiredDocs: z.array(z.string()),
    insuranceCheck: z.boolean()
  })
});

export const CounterSchema = z.object({
  id: z.string(),
  campusId: z.string(),
  name: z.string(),
  departmentId: z.string(),
  serviceIds: z.array(z.string()),
  status: CounterStatusSchema,
  breakType: z.string().optional(),
  providerUserId: z.string().optional()
});

export const AppointmentSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  dependentId: z.string().optional(),
  serviceId: z.string(),
  doctorId: z.string().optional(),
  campusId: z.string(),
  slotStart: z.string(),
  status: AppointmentStatusSchema,
  groupId: z.string().optional()
});

export const TicketSchema = z.object({
  id: z.string(),
  code: z.string(),
  campusId: z.string(),
  serviceId: z.string(),
  doctorId: z.string().optional(),
  patientId: z.string(),
  dependentId: z.string().optional(),
  groupId: z.string().optional(),
  source: TicketSourceSchema,
  tier: PriorityTierSchema,
  status: TicketStatusSchema,
  joinedAt: z.number(), // timestamp ms
  calledAt: z.number().optional(),
  startedAt: z.number().optional(),
  endedAt: z.number().optional(),
  counterId: z.string().optional(),
  outcome: TicketOutcomeSchema.optional(),
  note: z.string().optional(),
  swapUsed: z.boolean(),
  readinessScore: z.number()
});

export const PrepItemSchema = z.object({
  id: z.string(),
  ticketId: z.string().optional(),
  appointmentId: z.string().optional(),
  label: z.string(),
  kind: PrepItemKindSchema,
  done: z.boolean()
});

export const SwapRequestSchema = z.object({
  id: z.string(),
  fromTicketId: z.string(),
  toTicketId: z.string(),
  status: SwapRequestStatusSchema
});

export const ReassignProposalSchema = z.object({
  id: z.string(),
  ticketId: z.string(),
  fromDoctorId: z.string(),
  toDoctorId: z.string(),
  status: ReassignProposalStatusSchema,
  expiresAt: z.number()
});

export const FollowUpSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  doctorId: z.string(),
  dueDate: z.string(),
  status: FollowUpStatusSchema
});

export const NotificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  kind: z.string(),
  message: z.string(),
  at: z.number(),
  read: z.boolean(),
  action: z.string().optional()
});

export const ShiftAssignmentSchema = z.object({
  id: z.string(),
  doctorId: z.string(),
  counterId: z.string(),
  day: z.string(), // YYYY-MM-DD
  startHour: z.number(),
  endHour: z.number()
});

export const PolicySettingsSchema = z.object({
  cancelWindowMins: z.number(),
  graceMins: z.number(),
  maxQueueLen: z.number(),
  agingBoostEveryMins: z.number(),
  walkInReservePct: z.number(),
  reassignConsentMins: z.number()
});

export const AuditLogSchema = z.object({
  id: z.string(),
  actorId: z.string(),
  action: z.string(),
  entity: z.string(),
  entityId: z.string(),
  at: z.number(),
  meta: z.any(),
  prevHash: z.string(),
  hash: z.string()
});

export const NoShowStatSchema = z.object({
  doctorId: z.string(),
  hour: z.number(),
  weekday: z.number(),
  probability: z.number()
});
