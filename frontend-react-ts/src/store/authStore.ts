import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,

      setAuth: (user, token) => {
        set({ user, token, isLoggedIn: true });
        localStorage.setItem('zen_token', token);
      },

      logout: () => {
        set({ user: null, token: null, isLoggedIn: false });
        localStorage.removeItem('zen_token');
      },
    }),
    {
      name: 'zen-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);