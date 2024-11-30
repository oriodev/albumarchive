"use server";

import { getUser, getUserId } from "@/api/user.api";

export const getUserDetails = async () => {
  const id = await getUserId();
  const user = await getUser(id);
  return user;
};
