import { differenceInMonths } from "date-fns";

/**
 * Calculate the monthly saving required to reach a target amount by a target date.
 */
export function calculateMonthlySaving(
  targetAmount: number,
  savedAmount: number,
  targetDate: Date | string
): number {
  const remaining = targetAmount - savedAmount;
  if (remaining <= 0) return 0;

  const months = differenceInMonths(new Date(targetDate), new Date());
  if (months <= 0) return remaining; // past due, need it all now

  return Math.ceil(remaining / months);
}

/**
 * Project when a savings goal will be completed given a monthly saving rate.
 */
export function projectCompletionDate(
  targetAmount: number,
  savedAmount: number,
  monthlySaving: number
): Date | null {
  if (monthlySaving <= 0) return null;
  const remaining = targetAmount - savedAmount;
  if (remaining <= 0) return new Date();

  const monthsNeeded = Math.ceil(remaining / monthlySaving);
  const date = new Date();
  date.setMonth(date.getMonth() + monthsNeeded);
  return date;
}

/**
 * Get months remaining until the target date.
 */
export function getMonthsRemaining(targetDate: Date | string): number {
  return Math.max(0, differenceInMonths(new Date(targetDate), new Date()));
}

/**
 * Project savings over time (monthly snapshots).
 */
export function projectSavings(
  savedAmount: number,
  monthlySaving: number,
  months: number
): Array<{ month: number; amount: number }> {
  const data: Array<{ month: number; amount: number }> = [];
  for (let i = 0; i <= months; i++) {
    data.push({
      month: i,
      amount: savedAmount + monthlySaving * i,
    });
  }
  return data;
}

/**
 * Calculate time to reach a goal given monthly saving amount.
 */
export function getTimeToGoal(
  targetAmount: number,
  savedAmount: number,
  monthlySaving: number
): { months: number; years: number; display: string } {
  if (monthlySaving <= 0) {
    return { months: Infinity, years: Infinity, display: "Never" };
  }
  const remaining = targetAmount - savedAmount;
  if (remaining <= 0) {
    return { months: 0, years: 0, display: "Done!" };
  }

  const months = Math.ceil(remaining / monthlySaving);
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  let display = "";
  if (years > 0) display += `${years}y `;
  if (remainingMonths > 0 || years === 0) display += `${remainingMonths}m`;

  return { months, years, display: display.trim() };
}

/**
 * Allocate savings across goals based on priority.
 */
export function allocateSavings(
  availableSavings: number,
  goals: Array<{
    id: string;
    title: string;
    targetAmount: number;
    savedAmount: number;
    targetDate: Date | string;
    priority?: string;
  }>
): Array<{
  id: string;
  title: string;
  allocation: number;
  monthlySavingNeeded: number;
  percentage: number;
}> {
  // Calculate monthly saving needed for each goal
  const goalsWithNeeds = goals
    .filter((g) => g.targetAmount > g.savedAmount)
    .map((g) => ({
      ...g,
      monthlySavingNeeded: calculateMonthlySaving(
        g.targetAmount,
        g.savedAmount,
        g.targetDate
      ),
    }))
    .sort((a, b) => a.monthlySavingNeeded - b.monthlySavingNeeded);

  const totalNeeded = goalsWithNeeds.reduce(
    (sum, g) => sum + g.monthlySavingNeeded,
    0
  );

  return goalsWithNeeds.map((g) => {
    const percentage =
      totalNeeded > 0 ? g.monthlySavingNeeded / totalNeeded : 0;
    const allocation = Math.round(availableSavings * percentage);

    return {
      id: g.id,
      title: g.title,
      allocation,
      monthlySavingNeeded: g.monthlySavingNeeded,
      percentage: Math.round(percentage * 100),
    };
  });
}
