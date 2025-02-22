import { MessagePayload } from "@/types";
import { getSession } from "./session.api";

/**
 * returns all messages belonging to a room.
 * @param room room slug
 * @returns
 */
export const getMessages = async (room: string) => {
  try {
    const token = await getSession();
    const url = new URL(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/messages/${room}`,
    );

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
 * adds a message to the database.
 * @param message
 * @returns
 */
export const storeMessage = async (message: MessagePayload) => {
  try {
    const token = await getSession();

    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_API}/messages`);

    const newMessage = {
      ...message,
      sender: message.sender._id,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMessage),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response: ", errorText);
      throw new Error("Failed to create message");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error: ", error);
    return null;
  }
};

export const deleteMessage = async (room: string, timestamp: string) => {
  try {
    const token = await getSession();
    const url = new URL(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/messages/${room}/${timestamp}`,
    );

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
