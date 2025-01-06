"use server";

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
export const checkIfFollowing = async (
  currentUserId: string,
  user: User,
): Promise<boolean> => {
  if (!user.following || !currentUserId) {
    return false;
  }

  return user.following.includes(currentUserId);
};
