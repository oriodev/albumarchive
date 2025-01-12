"use client";

import { getAlbums } from "@/api/albums.api";
import { getAlbumsFromDiscogs } from "@/api/discogs.api";
import { AlbumDialogue } from "@/components/albums/album-dialogue";
import { SearchBar } from "@/components/albums/search-form";
import { Button } from "@/components/ui/button";
import { Album } from "@/types";
import { useState } from "react";

export default function Page() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMoreBtn, setShowMoreBtn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const localAlbums = await getAlbums(searchQuery);
    setAlbums(localAlbums);
    setShowMoreBtn(true);
  };

  const handleMore = async () => {
    const fetchedAlbums = await getAlbumsFromDiscogs(searchQuery);

    setAlbums((prevAlbums) => {
      const existingTitlesAndArtists = new Set(
        prevAlbums.map((album) => `${album.title}+${album.artist}`),
      );

      const uniqueFetchedAlbums = fetchedAlbums.filter((album: Album) => {
        const identifier = `${album.title}+${album.artist}`;
        if (existingTitlesAndArtists.has(identifier)) {
          return false;
        }
        existingTitlesAndArtists.add(identifier);
        return true;
      });

      return [...prevAlbums, ...uniqueFetchedAlbums];
    });

    setShowMoreBtn(false);
  };

  return (
    <>
      <p className="text-2xl pl-3">Albums.</p>
      <form onSubmit={handleSubmit}>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchType="albums"
        />
      </form>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2">
        {albums.map((album: Album) => (
          <div key={`${album.title}+${album.artist}+${album.genre}`}>
            <AlbumDialogue
              album={album}
              setAlbums={setAlbums}
              albums={albums}
            />
          </div>
        ))}

        <div>
          {showMoreBtn && (
            <Button className="ml-3" onClick={handleMore}>
              Can&apos;t find what you&apos;re looking for?
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
