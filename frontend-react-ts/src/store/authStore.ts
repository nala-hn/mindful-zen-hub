import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '../types';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string;
  id: string;
  role: string;
  exp: number;
}
interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  userId: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  getDecodedToken: () => DecodedToken | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      userId: null,

      setAuth: (user, token) => {
        const decodedToken = jwtDecode<DecodedToken>(token);
        set({ user, token, isLoggedIn: true, userId: decodedToken.id });
        localStorage.setItem('zen_token', token);
      },

      logout: () => {
        set({ user: null, token: null, isLoggedIn: false, userId: null });
        localStorage.removeItem('zen_token');
      },
      getDecodedToken: () => {
        const { token } = get();
        if (token) {
          try {
            return jwtDecode<DecodedToken>(token);
          } catch (error) {
            console.error('Failed to decode token:', error);
            return null;
          }
        }
        return null;
      },
    }),
    {
      name: 'zen-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);