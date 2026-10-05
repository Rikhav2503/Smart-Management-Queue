import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@careflow/shared';

interface StaffState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useStaffStore = create<StaffState>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null })
    }),
    {
      name: 'careflow-staff-storage'
    }
  )
);
