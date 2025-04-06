// "use server";

import { getUser, getUserId } from "@/apis/user.api";
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

/**
 * returns updated user to use to update the user provider
 * @param prevUser user
 * @param listId string
 * @param albumId string
 * @returns an updated user or null.
 */
export const makeUpdatedAlbumInListUser = (
  prevUser: User,
  listId: string,
  albumId: string,
) => {
  if (prevUser && prevUser.lists) {
    const updatedLists = prevUser.lists.map((list) => {
      if (list._id === listId) {
        const albumIndex = list.albums.indexOf(albumId);

        if (albumIndex === -1) {
          return { ...list, albums: [...list.albums, albumId] };
        } else {
          return {
            ...list,
            albums: list.albums.filter((id) => id !== albumId),
          };
        }
      }
      return { ...list, albums: [...list.albums] };
    });
    return { ...prevUser, lists: updatedLists };
  }
  return null;
};
