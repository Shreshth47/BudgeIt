import { create } from "zustand";
import { User } from "firebase/auth";

interface AuthState {
  user: User | null;

  loading: boolean;

  isAuthenticated: boolean;

  profileLoaded: boolean;

  setUser: (user: User | null) => void;

  setLoading: (loading: boolean) => void;

  setProfileLoaded: (loaded: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  loading: true,

  isAuthenticated: false,

  profileLoaded: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  setLoading: (loading) =>
    set({
      loading,
    }),

  setProfileLoaded: (loaded) =>
    set({
      profileLoaded: loaded,
    }),
}));