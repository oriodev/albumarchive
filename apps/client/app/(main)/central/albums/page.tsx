"use client";

import { getAlbums } from "@/api/albums.api";
import { getAlbumsFromDiscogs } from "@/api/discogs.api";
import { AlbumDialogue } from "@/components/albums/album-dialogue";
import { SearchBar } from "@/components/albums/search-form";
import { FullPagination } from "@/components/nav/full-pagination";
import { Button } from "@/components/ui/button";
import { Album } from "@/types";
import { useEffect, useState } from "react";

export default function Page() {
  // STATES.
  const [albums, setAlbums] = useState<Album[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMoreBtn, setShowMoreBtn] = useState(false);
  const [discogs, setDiscogs] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  // ON PAGE OPEN.
  useEffect(() => {
    const fetchAlbums = async () => {
      if (discogs) {
        const getDiscogsResponse = await getAlbumsFromDiscogs(
          searchQuery,
          currentPage.toString(),
        );
        const fetchedAlbums = getDiscogsResponse.albums;

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
        setTotal(getDiscogsResponse.total);
      }

      if (!discogs) {
        const fetchedAlbums = await getAlbums(
          searchQuery,
          currentPage.toString(),
        );

        if (fetchedAlbums) {
          setAlbums(fetchedAlbums.albums);
          setTotal(fetchedAlbums.total);
        }
      }
    };

    fetchAlbums();
  }, [currentPage, discogs, searchQuery]);

  // ON SEARCH.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const localAlbums = await getAlbums(searchQuery);

    setAlbums(localAlbums.albums);
    setCurrentPage(1);
    setTotal(localAlbums.total);
    setShowMoreBtn(true);
    setDiscogs(false);
  };

  // ON GET MORE.
  const handleMore = async () => {
    // const getDiscogsResponse = await getAlbumsFromDiscogs(
    //   searchQuery,
    //   currentPage.toString(),
    // );
    // const fetchedAlbums = getDiscogsResponse.albums;
    setCurrentPage(1);
    setDiscogs(true);

    // setTotal(getDiscogsResponse.total);

    setShowMoreBtn(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <p className="text-2xl pl-3">Albums.</p>
      <form onSubmit={handleSubmit}>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchType="albums"
        />
      </form>

      <div className="w-full grid grid-cols-1 gap-4 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2">
        {albums.map((album: Album) => (
          <div key={`${album.title}+${album.artist}+${album.genre}`}>
            <AlbumDialogue
              album={album}
              setAlbums={setAlbums}
              albums={albums}
              layoutType="Grid"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-5 items-center">
        {showMoreBtn && (
          <Button className="ml-3" onClick={handleMore}>
            Can&apos;t find what you&apos;re looking for?
          </Button>
        )}

        <FullPagination
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          total={total}
          resPerPage={10}
        />
      </div>
    </div>
  );
}
