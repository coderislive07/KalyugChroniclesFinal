import { create } from "zustand";
import { createAuthSlice } from "./slices/AuthSlice";

export const useAppStore = create((set) => ({
    ...createAuthSlice(set), 
}));
