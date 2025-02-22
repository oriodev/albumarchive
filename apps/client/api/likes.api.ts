import { Likes, List } from "@/types";
import { getSession } from "./session.api";

const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_API}/likes`;

/**
 * get specific like for a user and list.
 * @param userId string
 * @param listId string
 * @returns Promise<Likes | null>
 */
export const getLike = async (
  userId: string,
  listId: string,
): Promise<Likes | null> => {
  try {
    const token = await getSession();

    const url = new URL(baseUrl);
    url.searchParams.append("user", userId);
    url.searchParams.append("list", listId);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching like:", error);
    throw error;
  }
};

/**
 * get total likes for a list.
 * @param listId string
 * @returns Promise<number | null>
 */
export const getTotalLikes = async (listId: string): Promise<number | null> => {
  try {
    const token = await getSession();
    const url = new URL(`${baseUrl}/${listId}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching total likes:", error);
    throw error;
  }
};

/**
 * creates a new like.
 * @param like Likes object.
 * @returns Promise<Likes | null>
 */
export const createLike = async (like: Likes): Promise<Likes | null> => {
  try {
    const token = await getSession();
    const url = new URL(baseUrl);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(like),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating like:", error);
    throw error;
  }
};

/**
 * delete a like.
 * @param id string
 * @returns Promise<Likes | null>
 */
export const deleteLike = async (id: string): Promise<Likes | null> => {
  try {
    const token = await getSession();
    const url = new URL(`${baseUrl}/${id}`);

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting like:", error);
    throw error;
  }
};

/**
 * get specific like for a user and list.
 * @param userId string
 * @param listId string
 * @returns Promise<Likes | null>
 */
export const getUserLikedLists = async (userId: string): Promise<List[]> => {
  try {
    const token = await getSession();

    const url = new URL(`${baseUrl}/${userId}/user`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("response: ", response);

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching like:", error);
    throw error;
  }
};
