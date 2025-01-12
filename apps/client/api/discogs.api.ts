import { getSession } from "./session.api";

export const getAlbumsFromDiscogs = async (
  search: string = "",
  page: string = "1",
) => {
  const token = await getSession();

  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_API}/discogs`);
  url.searchParams.append("search", search);
  url.searchParams.append("page", page);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch albums");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};
