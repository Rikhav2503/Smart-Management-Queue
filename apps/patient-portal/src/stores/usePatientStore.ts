import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Campus } from '@careflow/shared';

interface PatientState {
  user: User | null;
  selectedCampus: Campus | null;
  login: (user: User) => void;
  logout: () => void;
  setCampus: (campus: Campus) => void;
}

export const usePatientStore = create<PatientState>()(
  persist(
    (set) => ({
      user: null,
      selectedCampus: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null, selectedCampus: null }),
      setCampus: (campus) => set({ selectedCampus: campus })
    }),
    {
      name: 'careflow-patient-storage'
    }
  )
);
