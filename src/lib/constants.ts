// Move initial state values and other constants here
export const INITIAL_DAYS_BACK = 30;

export const INITIAL_CHART_STATE = {
  showTotal: true,
  showLikes: true,
  showReposts: true,
  showReplies: true,
};

export const INITIAL_PROFILE_STATE = {
  name: "",
  handle: "",
  avatar: "",
  description: "",
  followersCount: 0,
};

export const ERROR_MESSAGES = {
  NOT_FOUND: "Couldn't find that user. Please try again.",
  INVALID_HANDLE: "That doesn't look like a valid handle. Please try again.",
  BAD_REQUEST: "Something's wrong with that handle. Please try again.",
  GENERIC: "Something went wrong. Please try again.",
}; 