import { useDashboardStore } from "@/store/useDashboardStore";
import { useOnBoardingStore } from "@/store/useOnBoardingStore";
import { getDailyBudget } from "@/utils/getDailyBudget";
import { ScrollView, Text, View } from "react-native";
import { COLORS } from "@/constants/colors";
import ProfileItem from "@/components/profile/ProfileItem";
import FloatingNav from "@/components/common/FloatingNav";
import { useState } from "react";
import EditFinancialModal from "@/components/profile/EditFinancialModal";
import PrimaryButton from "@/components/buttons/PrimaryButton";

export default function Profile() {
  const {
    fullName,
    dateOfBirth,
    upiId,
    monthlyIncome,
    secondaryIncome,
    savingsTarget,
    fixedExpenses,
  } = useOnBoardingStore();

  const { setField } = useOnBoardingStore();

  const [editVisible, setEditVisible] = useState(false);

  const sectionStyle = {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "700" as const,
    marginTop: 24,
    marginBottom: 12,
  };

  const { debtCarryForward, monthlySavings } = useDashboardStore();
  const dailyBudget = getDailyBudget(
    monthlyIncome + secondaryIncome,
    fixedExpenses,
    savingsTarget,
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: COLORS.background,
        }}
        contentContainerStyle={{
          padding: 24,
          paddingBottom: 120,
        }}
      >
        <View
          style={{
            alignItems: "center",
            marginBottom: 24,
            marginTop: 32,
          }}
        >
          <View
            style={{
              width: 90,
              height: 90,
              borderRadius: 45,
              backgroundColor: COLORS.primary,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 36,
                fontWeight: "700",
              }}
            >
              {fullName?.charAt(0)}
            </Text>
          </View>

          <Text
            style={{
              color: COLORS.text,
              fontSize: 24,
              fontWeight: "700",
              marginTop: 12,
            }}
          >
            {fullName}
          </Text>
        </View>
        <Text style={sectionStyle}>Personal</Text>
        <ProfileItem label="Date of Birth" value={dateOfBirth} />

        <ProfileItem label="UPI ID" value={upiId || "Not Set"} />
        <Text style={sectionStyle}>Budget Snapshot</Text>

        <ProfileItem label="Daily Budget" value={`₹${dailyBudget}`} />

        <ProfileItem label="Current Savings" value={`₹${monthlySavings}`} />

        <ProfileItem label="Current Debt" value={`₹${debtCarryForward}`} />

        <PrimaryButton
          title="Edit Financial Details"
          onPress={() => setEditVisible(true)}
        />
        <EditFinancialModal
          visible={editVisible}
          monthlyIncome={monthlyIncome}
          secondaryIncome={secondaryIncome}
          savingsTarget={savingsTarget}
          fixedExpenses={fixedExpenses}
          onClose={() => setEditVisible(false)}
          onSave={(income, secondary, savings) => {
            setField("monthlyIncome", income);

            setField("secondaryIncome", secondary);

            setField("savingsTarget", savings);
          }}
        />
      </ScrollView>
      <FloatingNav />
    </View>
  );
}
