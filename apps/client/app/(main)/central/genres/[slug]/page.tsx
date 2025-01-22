"use client";

import { getAlbumsByGenre } from "@/api/genre.api";
import { AlbumScrollDisplay } from "@/components/albums/album-scroll-display";
// import { ListScrollDisplay } from "@/components/lists/list-scroll-display";
import { Album } from "@/types";
import { capitalizeFirstLetter } from "@/utils/global.utils";
// HOOKS.
import { useEffect, useState } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [genre, setGenre] = useState("");
  const [genreAlbums, setGenreAlbums] = useState<Album[] | null>(null);
  // const [genreLists, setGenreLists] = useState<List[] | null>(null);

  useEffect(() => {
    const fetchGenre = async () => {
      const slug = (await params).slug;
      setGenre(slug);
    };

    const fetchGenreAlbums = async () => {
      const fetchedGenreAlbums = await getAlbumsByGenre(genre);
      if (!fetchedGenreAlbums) return;
      setGenreAlbums(fetchedGenreAlbums);
    };

    // const fetchGenreLists = async () => {
    //   if (!genre) return;
    //   console.log("genre: ", genre);
    //   const fetchedGenreLists = await getListsByGenre(genre);
    //   if (!fetchedGenreLists) return;
    //   // setGenreLists(fetchedGenreLists);
    //   console.log("genre lists: ", fetchedGenreLists);
    // };

    fetchGenre();
    fetchGenreAlbums();
    // fetchGenreLists();
  }, [params, genre]);

  return (
    <div className="flex flex-col gap-5">
      <p className="font-bold text-3xl pl-3">{genre}</p>
      {genreAlbums && (
        <div>
          <h2 className="text-2xl pl-3">
            Popular {capitalizeFirstLetter(genre)} Albums
          </h2>
          <AlbumScrollDisplay albums={genreAlbums} />
        </div>
      )}
      {/* 
      {genreLists && (
        <div>
          <h2 className="text-2xl pl-3">
            Popular {capitalizeFirstLetter(genre)} Albums
          </h2>
          <ListScrollDisplay lists={genreLists} />
        </div>
      )} */}
    </div>
  );
}
