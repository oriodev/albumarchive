"use server";

import { User } from "@/types";
import { getSession } from "./session.api";

export const getAllUsers = async (search: string = "", page: string = "1") => {
  try {
    const token = await getSession();

    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_API}/users/all`);
    url.searchParams.append("search", search);
    url.searchParams.append("page", page);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error: ", error);
  }
};

export const getUserId = async () => {
  try {
    const token = await getSession();

    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_API}/users`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const user = await response.json();
      return user.id;
    }

    return { error: "no user located" };
  } catch (error) {
    console.log("error: ", error);
  }
};

export const getUser = async (id: string) => {
  try {
    const token = await getSession();
    const url = new URL(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/users/id/${id}`,
    );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const user = await response.json();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;
      return rest as User;
    }

    return null;
  } catch (error) {
    console.log("error: ", error);
    return null;
  }
};

export const getUserByUsername = async (username: string) => {
  try {
    const token = await getSession();
    const url = new URL(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/users/username/${username}`,
    );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const user = await response.json();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;
      return rest as User;
    }

    return null;
  } catch (error) {
    console.log("error: ", error);
    return null;
  }
};

export const getUsersBatch = async (ids: string[]) => {
  try {
    const token = await getSession();
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_API}/users/batch`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ids }),
    });

    if (response.status === 201) {
      const users = await response.json();

      return users.map((user: User) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...rest } = user;
        return rest as User;
      });
    }

    return [];
  } catch (error) {
    console.log("error: ", error);
    return [];
  }
};

export const deleteUser = async (id: string) => {
  try {
    const token = await getSession();
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_API}/users/${id}`);

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const user = await response.json();
      return user;
    }

    return null;
  } catch (error) {
    console.log("error: ", error);
  }
};

export const updateUser = async (id: string, updatedUser: Partial<User>) => {
  try {
    const token = await getSession();
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_API}/users/${id}`);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedUser),
    });

    if (response.status === 200) {
      const user = await response.json();
      return user;
    }

    return null;
  } catch (error) {
    console.log("error: ", error);
  }
};

/**
 * Follow a user.
 * @param userId the id of the user you want to follow.
 * @param currentUserId the id of the user following.
 */
export const followUser = async (userId: string, currentUserId: string) => {
  try {
    const token = await getSession();
    const url = new URL(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/users/${userId}/${currentUserId}/follow`,
    );

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 201) {
      const user = await response.json();
      return user;
    }

    return null;
  } catch (error) {
    console.log("error: ", error);
  }
};

/**
 * Unfollow a user.
 * @param userId the id of the user you want to unfollow.
 * @param currentUserId the id of the user unfollowing.
 */
export const unfollowUser = async (userId: string, currentUserId: string) => {
  try {
    const token = await getSession();
    const url = new URL(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/users/${userId}/${currentUserId}/unfollow`,
    );

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const user = await response.json();
      return user;
    }

    return null;
  } catch (error) {
    console.log("error: ", error);
  }
};
