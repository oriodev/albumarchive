import { Album } from "@/types";
import { getSession } from "./session.api";

export const getAlbums = async (search: string = "", page: string = "1") => {
  const token = await getSession();

  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_API}/album`);
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
};

export const createAlbum = async (album: Album) => {
  const url = new URL(`${process.env.BACKEND_API}/album`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(album),
  });

  if (!response.ok) {
    throw new Error("Failed to create albums");
  }

  const data = await response.json();
  return data;
};
