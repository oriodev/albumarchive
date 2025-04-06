import { Room } from "@/types";
import { getSession } from "./session.api";

/**
 * returns all rooms.
 * @returns rooms
 */
export const getRooms = async () => {
  try {
    const token = await getSession();
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_API}/rooms`);

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
    return [];
  }
};

/**
 * returns a room.
 * @returns rooms
 */
export const getRoom = async (slug: string) => {
  const token = await getSession();

  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_API}/rooms/${slug}`);

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
 * creates a room.
 * @param room
 * @returns
 */
export const createRoom = async (room: Room) => {
  try {
    const token = await getSession();

    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_API}/rooms`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(room),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response: ", errorText);
      throw new Error("Failed to create notifications");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error: ", error);
    return null;
  }
};

/**
 * add a user to a room.
 * @param userId
 * @param roomId
 * @returns
 */
export const addUserToRoom = async (userId: string, roomId: string) => {
  const token = await getSession();

  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_API}/rooms/add`);
  url.searchParams.append("userId", userId);
  url.searchParams.append("roomId", roomId);

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response: ", errorText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding user to room:", error);
    throw error;
  }
};

/**
 * remove a user from a room.
 * @param userId
 * @param roomId
 * @returns
 */
export const removeUserFromRoom = async (userId: string, roomId: string) => {
  const token = await getSession();

  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_API}/rooms/remove`);
  url.searchParams.append("userId", userId);
  url.searchParams.append("roomId", roomId);

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response: ", errorText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error removing user from a room:", error);
    throw error;
  }
};
