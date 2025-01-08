// "use server";

import { getUser, getUserId } from "@/api/user.api";
import { User } from "@/types";

export const getUserDetails = async () => {
  const id = await getUserId();
  const user = await getUser(id);
  return user;
};

/**
 * Check if the current user is following a given user.
 * @param currentUserId the current user that's logged in.
 * @param user the user we want to check if we are following.
 */
export const checkIfFollowing = (
  currentUserId: string,
  user: User,
): boolean => {
  if (!user.following || !currentUserId) {
    return false;
  }

  return user.following.includes(currentUserId);
};

/**
 * Returns the first letter of a username or '?' if no username.
 * @param profileData User | null
 * @returns string
 */
export const getUsernameInitial = (profileData: User | null): string => {
  let initial = "?";

  if (profileData?.username) {
    initial = profileData?.username[0].toUpperCase();
  }

  return initial;
};
