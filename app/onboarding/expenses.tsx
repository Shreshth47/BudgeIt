import { View, Text, ScrollView } from "react-native";
import { router } from "expo-router";
import AppInput from "@/components/inputs/AppInput";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import ProgressIndicator from "@/components/common/ProgressIndicator";
import { COLORS } from "@/constants/colors";
import { useOnBoardingStore } from "@/store/useOnBoardingStore";
import { useState } from "react";
import ExpenseCard from "@/components/cards/ExpenseCard";
import getTotalFixedExpenses from '@/utils/getTotalFixedExpenses'

export default function ExpensesScreen() {
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const {
    fixedExpenses,
    addExpense,
    removeExpense,
  } = useOnBoardingStore();
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 24,
      }}
    >
      <ProgressIndicator
        currentStep={3}
        totalSteps={4}
      />

      <Text
        style={{
          color: "white",
          fontSize: 32,
          fontWeight: "700",
          marginBottom: 24,
        }}
      >
        Your fixed monthly costs
      </Text>
      <AppInput
        value={expenseName}
        placeholder="Expense Name"
        onChangeText={setExpenseName}
      />

      <AppInput
        value={expenseAmount}
        placeholder="Amount"
        onChangeText={setExpenseAmount}
        keyboardType="numeric"
      />
      <PrimaryButton
        title="Add Expense"
        onPress={() => {
          if (
            !expenseName.trim() ||
            !expenseAmount.trim()
          ) {
            return;
          }

          addExpense({
            id: Date.now().toString(),
            name: expenseName,
            amount: Number(expenseAmount),
          });

          setExpenseName("");
          setExpenseAmount("");
        }}
      />
      {fixedExpenses.map((expense) => (
        <ExpenseCard
          key={expense.id}
          name={expense.name}
          amount={expense.amount}
          onDelete={() =>
            removeExpense(expense.id)
          }
        />
      ))}
      <View
        style={{
          backgroundColor: COLORS.card,
          padding: 20,
          borderRadius: 16,
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            color: COLORS.textSecondary,
          }}
        >
          Total Fixed Expenses
        </Text>

        <Text
          style={{
            color: COLORS.text,
            fontSize: 30,
            fontWeight: "700",
            marginTop: 8,
          }}
        >
          ₹
          {getTotalFixedExpenses(
            fixedExpenses
          )}
        </Text>
      </View>

      <PrimaryButton
        title="Continue"
        onPress={() =>
          router.push("/onboarding/savings")
        }
      />
    </ScrollView>
  );
}