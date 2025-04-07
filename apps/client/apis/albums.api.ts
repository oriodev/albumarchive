import { Album } from "@/types";
import { getSession } from "./session.api";

const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_API}/albums`;

// GET.

export const getAlbums = async (search: string = "", page: string = "1") => {
  const token = await getSession();

  const url = new URL(`${baseUrl}`);
  url.searchParams.append("search", search);
  url.searchParams.append("page", page);

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

export const getAlbumByTitle = async (title: string) => {
  const token = await getSession();

  const url = new URL(`${baseUrl}/${title}/title`);

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

export const getAlbumById = async (id: string) => {
  try {
    const token = await getSession();
    const url = new URL(`${baseUrl}/${id}/id`);

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
    console.log("error: ", error);
  }
};

export const getAlbumsByArtist = async (artist: string) => {
  try {
    const token = await getSession();
    const url = new URL(`${baseUrl}/${artist}/artist`);

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
    console.log("error: ", error);
  }
};

// POST.

export const createAlbum = async (album: Album) => {
  const token = await getSession();

  const url = new URL(`${baseUrl}`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(album),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error response: ", errorText);
    throw new Error("Failed to create albums");
  }

  const data = await response.json();
  return data;
};
