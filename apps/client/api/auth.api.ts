import { User } from "@/types";

export const signUp = async (user: User) => {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/signup`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const login = async (user: User) => {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/login`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();
    console.log("login data: ", data);

    return data;
  } catch (error) {
    console.log(error);
  }
};
