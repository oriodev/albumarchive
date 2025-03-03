"use server";

import { List, AlbumType, ListPayload } from "@/types";
import { getSession } from "./session.api";
import { getUserId } from "./user.api";

const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_API}/lists`;

export const getAllLists = async (search: string = "", page: string = "1") => {
  try {
    const token = await getSession();

    const url = new URL(`${baseUrl}/all`);
    url.searchParams.append("search", search);
    url.searchParams.append("page", page);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getListById = async (listId: string) => {
  const token = await getSession();

  const url = new URL(`${baseUrl}/${listId}/id`);

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
};

// GET ALL OF A USER'S LISTS.
export const getListsByUserId = async (userId: string) => {
  const token = await getSession();

  const url = new URL(`${baseUrl}/${userId}/user`);

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
};

export const getTrendingLists = async () => {
  try {
    const token = await getSession();

    const url = new URL(`${baseUrl}/trending`);

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
  } catch {
    return null;
  }
};

export const generateNewUserLists = async () => {
  const userId = await getUserId();

  const listenedList: ListPayload = {
    name: "Listened",
    slug: "listened",
    description: "Every album you have listened to!",
    type: AlbumType.LISTENED,
    user: userId,
    albums: [],
  };

  const toListenList: ListPayload = {
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

export const createList = async (list: ListPayload) => {
  const token = await getSession();

  const url = new URL(`${baseUrl}`);

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

// GET A LIST ON A PAGE VIA SLUG.
export const getList = async (slug: string, user: string) => {
  const token = await getSession();

  const url = new URL(`${baseUrl}`);
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
    const url = new URL(`${baseUrl}/${id}`);

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

  const url = new URL(`${baseUrl}/${id}`);

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

// ALBUM STUFF.

export const addAlbumToList = async (list_id: string, album_id: string) => {
  const token = await getSession();

  const url = new URL(`${baseUrl}/add-album`);
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

  const url = new URL(`${baseUrl}/delete-album/${list_id}`);

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

  const url = new URL(`${baseUrl}/album-in-list`);
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
