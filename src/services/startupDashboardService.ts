import { User } from "firebase/auth";

import { downloadDashboard } from "./dashboardService";
import { useDashboardStore } from "@/store/useDashboardStore";

export async function initializeDashboard(user: User) {
  try {
    const dashboard = await downloadDashboard(user.uid);

    console.log("DOWNLOADED DASHBOARD");
    console.log(dashboard);

    if (!dashboard) {
      return;
    }

    useDashboardStore.setState({
      todaysSpend: dashboard.todaysSpend,

      rollover: dashboard.rollover,

      debtCarryForward: dashboard.debtCarryForward,

      monthlySavings: dashboard.monthlySavings,

      lastActiveDate: dashboard.lastActiveDate,

      lastActiveMonth: dashboard.lastActiveMonth,
    });

    console.log("AFTER HYDRATE");
    console.log(useDashboardStore.getState());

    console.log("Dashboard Loaded Successfully");
  } catch (error) {
    console.log("Dashboard Startup Error:", error);
  }
}
