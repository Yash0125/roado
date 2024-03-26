interface User {
  logged_in: Date;
  logged_out?: Date;
  lastSeenAt: Date;
}

function calculateMonthlyActivity(
  users: User[],
  startDate: Date,
  endDate: Date
): { [key: string]: { activeUsers: number; monthlyLogins: number } } {
  const activityData: {
    [key: string]: { activeUsers: number; monthlyLogins: number };
  } = {};

  // Helper function to get the start of a month
  const startOfMonth = (date: Date): Date =>
    new Date(date.getFullYear(), date.getMonth(), 1);

  // Helper function to get the end of a month
  const endOfMonth = (date: Date): Date =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const currentMonth = new Date(startDate); // Initialize current month with start date

  // Loop through months until endDate is reached
  while (currentMonth <= endDate) {
    const activeUsers: User[] = [];
    let monthlyLogins = 0;

    // Check activity for each user
    users.forEach((user) => {
      if (
        user.logged_in <= endOfMonth(currentMonth) &&
        (user.logged_out === undefined ||
          user.logged_out >= startOfMonth(currentMonth) ||
          user.lastSeenAt >= startOfMonth(currentMonth))
      ) {
        activeUsers.push(user);
        monthlyLogins++;
      }
    });

    activityData[currentMonth.toISOString().slice(0, 7)] = {
      activeUsers: new Set(activeUsers.map((user) => user.logged_in.toString()))
        .size, // Count unique active users
      monthlyLogins: monthlyLogins,
    };

    // Move to the next month
    currentMonth.setMonth(currentMonth.getMonth() + 1);
  }

  return activityData;
}

// Example usage
const users: User[] = [
  {
    logged_in: new Date("2023-01-02"),
    logged_out: new Date("2023-01-05"),
    lastSeenAt: new Date("2023-01-04"),
  },
  {
    logged_in: new Date("2023-02-15"),
    logged_out: new Date("2023-03-10"),
    lastSeenAt: new Date("2023-03-01"),
  },
  //We can add more users as needed
];

const startDate = new Date("2023-01-01");
const endDate = new Date("2023-03-31");

const monthlyActivity = calculateMonthlyActivity(users, startDate, endDate);
console.log(monthlyActivity);
