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
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_API}/users/${id}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const user = await response.json();

      return {
        id: user._id,
        username: user.username,
        email: user.email,
        private: user.private,
        lists: user.lists,
      };
    }

    return null;
  } catch (error) {
    console.log("error: ", error);
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
