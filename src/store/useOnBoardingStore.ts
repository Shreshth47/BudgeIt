import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserDocument } from "@/types/user";

interface FixedExpense {
  id: string;
  name: string;
  amount: number;
}

interface OnboardingState {
  fullName: string;
  dateOfBirth: string;
  currency: string;
  upiId: string;
  profilePhoto: string;
  bio: string;

  currentBalance: number;
  monthlyIncome: number;
  secondaryIncome: number;

  fixedExpenses: FixedExpense[];

  savingsTarget: number;
  emergencyFundGoal: number;
  overrideDailyLimit: number | null;

  hasCompletedOnboarding: boolean;
  getProfileData: () => UserDocument;
  clearOnboarding: () => void;

  setField: (field: string, value: any) => void;
  addExpense: (expense: FixedExpense) => void;
  removeExpense: (id: string) => void;
  markOnboardingComplete: () => void;
}

export const useOnBoardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      fullName: "",
      dateOfBirth: "",
      currency: "INR",
      upiId: "",
      profilePhoto: "",
      bio: "Tap to add your bio",

      currentBalance: 0,
      monthlyIncome: 0,
      secondaryIncome: 0,

      fixedExpenses: [],

      savingsTarget: 0,
      emergencyFundGoal: 0,
      overrideDailyLimit: null,

      hasCompletedOnboarding: false,

      getProfileData: (): UserDocument => {
        const state = get();

        return {
          uid: "",
          email: "",

          fullName: state.fullName,
          dateOfBirth: state.dateOfBirth,
          currency: state.currency,
          upiId: state.upiId,
          profilePhoto: state.profilePhoto,
          bio: state.bio,

          currentBalance: state.currentBalance,
          monthlyIncome: state.monthlyIncome,
          secondaryIncome: state.secondaryIncome,

          fixedExpenses: state.fixedExpenses,

          savingsTarget: state.savingsTarget,
          emergencyFundGoal: state.emergencyFundGoal,
          overrideDailyLimit: state.overrideDailyLimit,

          hasCompletedOnboarding: state.hasCompletedOnboarding,

          createdAt: 0,
          updatedAt: Date.now(),
        };
      },

      clearOnboarding: () =>
        set({
          fullName: "",
          dateOfBirth: "",
          currency: "INR",
          upiId: "",

          currentBalance: 0,
          monthlyIncome: 0,
          secondaryIncome: 0,

          fixedExpenses: [],

          savingsTarget: 0,
          emergencyFundGoal: 0,
          overrideDailyLimit: null,

          hasCompletedOnboarding: false,
        }),

      setField: (field, value) =>
        set((state) => ({
          ...state,
          [field]: value,
        })),

      addExpense: (expense) =>
        set((state) => ({
          fixedExpenses: [...state.fixedExpenses, expense],
        })),

      markOnboardingComplete: () =>
        set({
          hasCompletedOnboarding: true,
        }),

      removeExpense: (id) =>
        set((state) => ({
          fixedExpenses: state.fixedExpenses.filter((item) => item.id !== id),
        })),
    }),
    {
      name: "budgeit-onboarding",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
