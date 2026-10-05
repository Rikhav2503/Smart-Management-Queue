import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@careflow/shared';

interface AdminState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null })
    }),
    {
      name: 'careflow-admin-storage'
    }
  )
);
