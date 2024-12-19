"use server";

import { List, Type } from "@/types";
import { getSession } from "./session.api";
import { getUserId } from "./user.api";

export const generateNewUserLists = async () => {
  const userId = await getUserId();

  const listenedList: List = {
    name: "Listened",
    slug: "listened",
    description: "Every album you have listened to!",
    type: Type.LISTENED,
    user: userId,
    albums: [],
  };

  const toListenList: List = {
    name: "To Listen",
    slug: "to-listen",
    description: "Albums you want to listen to!",
    type: Type.TOLISTEN,
    user: userId,
    albums: [],
  };

  try {
    const listenedResponse = await createList(listenedList);
    await createList(toListenList);

    return listenedResponse.data();
  } catch (error) {
    console.log(error);
  }
};

export const createList = async (list: List) => {
  const token = await getSession();

  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_API}/list`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(list),
  });

  if (!response.ok) {
    throw new Error("Failed to create list");
  }

  const data = await response.json();
  return data;
};

export const getList = async (slug: string, user: string) => {
  const token = await getSession();

  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_API}/list`);
  url.searchParams.append("user", user);
  url.searchParams.append("slug", slug);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch list");
  }

  const data = await response.json();
  return data;
};

export const deleteList = async (id: string) => {
  try {
    const token = await getSession();
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_API}/list/${id}`);

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
