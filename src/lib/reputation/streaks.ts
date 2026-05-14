/* ═══════════════════════════════════════════════════════════
   Streaks Engine
   ─────────────────────────────────────────────────────────
   Logic to calculate current learning/collaboration streaks.
   ═══════════════════════════════════════════════════════════ */

/**
 * Calculates current streak and longest streak based on an array
 * of activity dates (ISO strings).
 */
export function calculateStreak(activityDates: string[]): {
  currentStreak: number;
  longestStreak: number;
  lastActive: string | null;
} {
  if (!activityDates || activityDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, lastActive: null };
  }

  // Normalize dates to YYYY-MM-DD
  const normalizedDates = activityDates
    .map((date) => new Date(date).toISOString().split("T")[0])
    .sort((a, b) => b.localeCompare(a)); // Descending order (newest first)

  // Remove duplicates
  const uniqueDates = Array.from(new Set(normalizedDates));

  if (uniqueDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, lastActive: null };
  }

  const todayStr = new Date().toISOString().split("T")[0];
  
  // Date logic setup
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const todayDate = new Date(todayStr).getTime();
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  // Check if active today or yesterday to maintain current streak
  const lastActiveStr = uniqueDates[0];
  const lastActiveDate = new Date(lastActiveStr).getTime();
  const diffDaysFromToday = Math.floor((todayDate - lastActiveDate) / ONE_DAY_MS);

  // If the last activity was more than 1 day ago (yesterday), current streak is broken
  if (diffDaysFromToday > 1) {
    currentStreak = 0;
  } else {
    currentStreak = 1;
  }

  // Calculate streaks historically
  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const d1 = new Date(uniqueDates[i]).getTime();
    const d2 = new Date(uniqueDates[i + 1]).getTime();
    const diffDays = Math.floor((d1 - d2) / ONE_DAY_MS);

    if (diffDays === 1) {
      tempStreak++;
      // Only increment current streak if we are in the continuous chain from today/yesterday
      if (i < currentStreak) {
        currentStreak++;
      }
    } else {
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
      tempStreak = 1;
    }
  }

  // Final check for longest
  if (tempStreak > longestStreak) {
    longestStreak = tempStreak;
  }

  return {
    currentStreak,
    longestStreak,
    lastActive: lastActiveStr,
  };
}
