"use server";

export const getUser = async (token: string) => {
  try {
    const url = new URL(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/users/${token}`,
    );
    const response = await fetch(url);

    if (response.status === 200) {
      const user = await response.json();

      const formattedUser = {
        username: user.username,
        email: user.email,
      };

      return formattedUser;
    }

    if (response.status === 400) {
      return { error: "no user located" };
    }
  } catch (error) {
    console.log("error: ", error);
  }
};
