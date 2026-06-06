import { Pressable, ScrollView, Text } from "react-native";
import { COLORS } from "@/constants/colors";
import { useDashboardStore } from "@/store/useDashboardStore";
import TransactionCard from "@/components/cards/TransactionCard";
import FloatingNav from "@/components/common/FloatingNav";
import { View } from "react-native";
import { getTransactionGroup } from "@/utils/getTransactionGroup";
import { useState } from "react";
import AppInput from "@/components/inputs/AppInput";
import { CATEGORIES } from "@/constants/categories";

export default function Transactions() {
  const transactions = useDashboardStore((state) => state.transactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.merchant
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || transaction.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedTransactions = filteredTransactions.reduce(
    (acc, transaction) => {
      const group = getTransactionGroup(transaction.timestamp);
      if (!acc[group]) acc[group] = [];
      acc[group].push(transaction);
      return acc;
    },
    {} as Record<string, typeof transactions>,
  );

  const totalSpent = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0,
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
        <Text
          style={{
            color: COLORS.text,
            fontSize: 32,
            fontWeight: "700",
            marginBottom: 24,
            marginTop: 32,
          }}
        >
          Transactions
        </Text>

        <View
          style={{
            backgroundColor: COLORS.card,

            borderRadius: 20,

            padding: 20,

            marginBottom: 24,
          }}
        >
          <Text
            style={{
              color: COLORS.textSecondary,
            }}
          >
            Total Recorded Spend
          </Text>

          <Text
            style={{
              color: COLORS.text,

              fontSize: 32,

              fontWeight: "700",
            }}
          >
            ₹{totalSpent}
          </Text>

          <Text
            style={{
              color: COLORS.textSecondary,
            }}
          >
            {transactions.length} transactions
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            marginBottom: 16,
          }}
        >
          {["All", ...CATEGORIES].map((category) => (
            <Pressable
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 8,

                backgroundColor:
                  selectedCategory === category ? COLORS.primary : COLORS.card,
              }}
            >
              <Text
                style={{
                  color: selectedCategory === category ? "white" : COLORS.text,
                }}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <AppInput
          value={searchQuery}
          placeholder="Search merchant..."
          onChangeText={setSearchQuery}
        />

        {filteredTransactions.length === 0 && (
          <Text
            style={{
              color: COLORS.textSecondary,
              textAlign: "center",
              marginTop: 40,
            }}
          >
            No transactions found
          </Text>
        )}

        {Object.entries(groupedTransactions).map(([group, items]) => (
          <View key={group}>
            <Text
              style={{
                color: COLORS.textSecondary,

                fontSize: 14,

                fontWeight: "700",

                marginTop: 16,

                marginBottom: 12,
              }}
            >
              {group}
            </Text>

            {items.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                id={transaction.id}
                merchant={transaction.merchant}
                amount={transaction.amount}
                category={transaction.category}
                timestamp={transaction.timestamp}
              />
            ))}
          </View>
        ))}
      </ScrollView>
      <FloatingNav />
    </View>
  );
}
