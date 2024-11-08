import { Album } from "@/types";

export const getAlbums = async (search: string = "", page: string = "1") => {
  const url = new URL(`${process.env.BACKEND_API}/album`);
  url.searchParams.append("search", search);
  url.searchParams.append("page", page);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch albums");
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
