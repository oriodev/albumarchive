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
 * @param currentUserId the one doing the following
 * @param user the one being followed (or not)
 */
export const checkIfFollowing = (
  currentUserId: string | undefined,
  user: User | null,
): boolean => {
  if (!user || !user.followers || !currentUserId) {
    return false;
  }

  return user.followers.includes(currentUserId);
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
