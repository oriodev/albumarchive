import { Rating } from "@/types";
import { getSession } from "./session.api";

const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_API}/ratings`;

/**
 * get specific rating for a user and album.
 * @param userId string
 * @param albumId string
 * @returns Promise<Rating | null>
 */
export const getRating = async (
  userId: string,
  albumId: string,
): Promise<Rating | null> => {
  try {
    const token = await getSession();

    const url = new URL(baseUrl);
    url.searchParams.append("user", userId);
    url.searchParams.append("album", albumId);

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
    console.error("Error updating rating:", error);
    throw error;
  }
};

/**
 * get overall rating for an album.
 * @param albumId string
 * @returns Promise<number | null>
 */
export const getAlbumRating = async (
  albumId: string,
): Promise<number | null> => {
  try {
    const token = await getSession();
    const url = new URL(`${baseUrl}/${albumId}`);

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
    console.error("Error updating rating:", error);
    throw error;
  }
};

/**
 * creates a new individual rating.
 * @param rating user, album, number rating.
 * @returns Promise<Rating | null>
 */
export const createRating = async (rating: Rating): Promise<Rating | null> => {
  try {
    const token = await getSession();
    const url = new URL(baseUrl);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rating),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating rating:", error);
    throw error;
  }
};

/**
 * update rating.
 * @param id rating id.
 * @param updatedRating number.
 * @returns Promise<Rating | null>
 */
export const updateRating = async (
  id: string,
  updatedRating: number,
): Promise<Rating | null> => {
  const token = await getSession();
  const url = new URL(`${baseUrl}/${id}`);

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating: updatedRating }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating rating:", error);
    throw error;
  }
};

/**
 * delete a rating.
 * @param id
 * @returns Promise<Rating | null>
 */
export const deleteRating = async (id: string): Promise<Rating | null> => {
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
    console.log("error: ", error);
    throw error;
  }
};
