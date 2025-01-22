import { getSession } from "./session.api";

export const getAlbumsByGenre = async (genre: string) => {
  try {
    const token = await getSession();
    const url = new URL(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/album/${genre}/genre`,
    );

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

export const getListsByGenre = async (genre: string) => {
  try {
    const token = await getSession();
    const url = new URL(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/list/${genre}/genre`,
    );

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
