import { getSession } from "./session.api";
import { NotificationPayload } from "@/types";

/**
 * returns all notifications belonging to a given user.
 * @param id user id
 * @returns
 */
export const getNotifications = async (id: string) => {
  try {
    const token = await getSession();
    const url = new URL(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/notifications/${id}`,
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

/**
 * adds a notification to the database.
 * @param notification a notification. min: sender, receiver, type.
 * @returns
 */
export const storeNotification = async (notification: NotificationPayload) => {
  try {
    const token = await getSession();

    const newPayload = {
      ...notification,
      sender: notification.sender._id,
      receiver: notification.receiver._id,
      album: notification.album?._id,
      list: notification.list?._id,
    };

    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_API}/notifications`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPayload),
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
 * removes a notification from the database.
 * @param id notification id to remove.
 * @returns
 */
export const removeNotification = async (id: string) => {
  try {
    const token = await getSession();
    const url = new URL(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/notifications/${id}`,
    );

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const notification = await response.json();
      return notification;
    }

    return null;
  } catch (error) {
    console.log("error: ", error);
    return null;
  }
};
