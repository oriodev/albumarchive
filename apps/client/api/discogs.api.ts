export const getAlbumsFromDiscogs = async (search: string = "") => {
  const url = new URL(`${process.env.BACKEND_API}/discogs`);
  url.searchParams.append("search", search);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch albums");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};
