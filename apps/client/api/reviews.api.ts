// API.
import { getSession } from "./session.api";

// TYPES.
import { Review, ReviewWithUser } from "@/types";

const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_API}/reviews`;

/**
 * get specific review for a user and album.
 * @param userId string
 * @param albumId string
 * @returns Promise<Review | null>
 */
export const getReview = async (
  userId: string,
  albumId: string,
): Promise<Review | null> => {
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
    return null;
  }
};

/**
 * get all reviews for an album.
 * @param search
 * @param page
 * @returns
 */
export const getAllReviews = async (albumId: string, page: string = "1") => {
  const token = await getSession();

  const url = new URL(`${baseUrl}/albums`);
  url.searchParams.append("albumId", albumId);
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

/**
 * get all reviews for an album.
 * @param search
 * @param page
 * @returns
 */
export const getAllReviewsByUser = async (
  userId: string,
  page: string = "1",
) => {
  const token = await getSession();

  const url = new URL(`${baseUrl}/users`);
  url.searchParams.append("userId", userId);
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

/**
 * creates a new review.
 * @param review user, album, vibes, reviewText.
 * @returns Promise<Review | null>
 */
export const createReview = async (review: Review): Promise<Review | null> => {
  try {
    const token = await getSession();
    const url = new URL(baseUrl);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(review),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating rating:", error);
    return null;
  }
};

/**
 * edit a review
 * @param id
 * @param updatedReview
 * @returns
 */
export const editReview = async (
  id: string,
  updatedReview: Partial<Review>,
) => {
  try {
    const token = await getSession();
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_API}/reviews/${id}`);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedReview),
    });

    if (response.status === 200) {
      const user = await response.json();
      return user;
    }

    return null;
  } catch (error) {
    console.log("error: ", error);
    return null;
  }
};

/**
 * delete a review.
 * @param id
 * @returns Promise<Review | null>
 */
export const deleteReview = async (
  id: string,
): Promise<ReviewWithUser | null> => {
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
