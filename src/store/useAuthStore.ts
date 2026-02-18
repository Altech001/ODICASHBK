import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  activeWorkspaceId: string | null;
  setAuth: (user: User) => void;
  setWorkspaceId: (id: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      activeWorkspaceId: null,
      setAuth: (user) => set({ user, isAuthenticated: true }),
      setWorkspaceId: (id) => set({ activeWorkspaceId: id }),
      logout: () => set({ user: null, isAuthenticated: false, activeWorkspaceId: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
