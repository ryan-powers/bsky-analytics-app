export const calculateChange = (current: number[], previous: number[]) => {
    const currentAvg = current.length ? current.reduce((a, b) => a + b, 0) / current.length : 0;
    const previousAvg = previous.length ? previous.reduce((a, b) => a + b, 0) / previous.length : 0;
    
    if (!previousAvg) return null;
    return ((currentAvg - previousAvg) / previousAvg) * 100;
};

// Suggested accounts to follow
export const suggestedAccounts = [
  {
    handle: "@mcuban.bsky.social",
    name: "Mark Cuban",
    avatar: "/mcuban.jpg",
  },
  {
    handle: "@aoc.bsky.social",
    name: "Alexandria Ocasio-Cortez",
    avatar: "/aoc.jpg",
  },
  {
    handle: "@karaswisher.bsky.social",
    name: "Kara Swisher",
    avatar: "/kara.jpg",
  },
];

// Time options for the chart
export const timeOptions = [
  { label: "30 days", value: 30 },
  { label: "60 days", value: 60 },
  { label: "90 days", value: 90 },
  { label: "180 days", value: 180 },
  { label: "1 Year", value: 365 },
  { label: "All Time", value: 0 },
];

// Normalize the handle to the correct format
export const normalizeHandle = (input: string): string => {
  let handle = input.trim().replace(/^@/, "").toLowerCase();
  
  if (!handle.includes(".")) {
    handle += ".bsky.social";
    }
  
    return handle;
};
