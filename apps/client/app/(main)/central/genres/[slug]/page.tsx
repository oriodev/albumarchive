"use client";

import { getAlbumsByGenre } from "@/api/genre.api";
import { AlbumDialogue } from "@/components/albums/album-dialogue";
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

    fetchGenre();
    fetchGenreAlbums();
  }, [params, genre]);

  return (
    <div className="flex flex-col gap-5">
      <p className="font-bold text-3xl pl-3">
        Popular {capitalizeFirstLetter(genre)} Albums
      </p>
      {genreAlbums && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {genreAlbums.map((album: Album) => (
            <div
              className="flex-shrink-0"
              key={`${album.title}+${album.artist}`}
            >
              <AlbumDialogue album={album} layoutType="Grid" local={true} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
