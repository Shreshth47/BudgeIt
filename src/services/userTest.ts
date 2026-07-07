import { createUserDocument } from "./userService";

export async function testFirestore() {
  await createUserDocument({
    uid: "test-user",

    email: "test@test.com",

    fullName: "Test User",

    dateOfBirth: "",

    currency: "INR",

    upiId: "",

    currentBalance: 0,

    monthlyIncome: 10000,

    secondaryIncome: 0,

    fixedExpenses: [],

    savingsTarget: 0,

    emergencyFundGoal: 0,

    overrideDailyLimit: null,

    hasCompletedOnboarding: false,

    createdAt: Date.now(),

    updatedAt: Date.now(),
  });

  console.log("Firestore Write Success");
}