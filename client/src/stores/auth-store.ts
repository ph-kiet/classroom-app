import { create, StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface IUser {
  phoneNumber: string;
  name: string;
  role: string;
  email: string;
}

interface Store {
  user: IUser | null;
  isAuthenticated: boolean;
  setUser: (user: IUser | null) => void;
  clearUser: () => void;
}

const authStore: StateCreator<Store> = (set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
});

const useAuthStore = create(
  persist(authStore, {
    name: "auth-storage", // Key used in localStorage
    storage: createJSONStorage(() => localStorage),
  })
);

export default useAuthStore;
