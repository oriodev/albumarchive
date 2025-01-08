"use server";

import { List, AlbumType } from "@/types";
import { getSession } from "./session.api";
import { getUserId } from "./user.api";

export const generateNewUserLists = async () => {
  const userId = await getUserId();

  const listenedList: List = {
    name: "Listened",
    slug: "listened",
    description: "Every album you have listened to!",
    type: AlbumType.LISTENED,
    user: userId,
    albums: [],
  };

  const toListenList: List = {
    name: "To Listen",
    slug: "to-listen",
    description: "Albums you want to listen to!",
    type: AlbumType.TOLISTEN,
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

  console.log("api list: ", list);

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

export const updateList = async (id: string, updatedList: Partial<List>) => {
  const token = await getSession();

  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_API}/list/${id}`);

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedList),
    });

    if (!response.ok) {
      throw new Error("Failed to update list");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating list:", error);
    throw error;
  }
};

export const addAlbumToList = async (list_id: string, album_id: string) => {
  const token = await getSession();

  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_API}/list/add-album`);
  url.searchParams.append("id", list_id);

  const body = {
    albumId: album_id,
  };

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response: ", errorText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding album to list list:", error);
    throw error;
  }
};

export const removeAlbumFromList = async (
  list_id: string,
  album_id: string,
) => {
  const token = await getSession();

  const url = new URL(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/list/delete-album/${list_id}`,
  );

  const body = {
    albumId: album_id,
  };

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response: ", errorText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error removing album from list:", error);
    throw error;
  }
};

export const getIsAlbumInList = async (list_id: string, album_id: string) => {
  const token = await getSession();

  const url = new URL(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/list/album-in-list`,
  );
  url.searchParams.append("list", list_id);
  url.searchParams.append("album", album_id);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch is album in list info");
  }

  const data = await response.json();
  return data;
};
