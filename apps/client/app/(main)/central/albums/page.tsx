"use client";

// PACKAGES.
import { useEffect, useState } from "react";

// COMPONENTS.
import ExtendedSearchContainer from "@/components/containers/extenddedsearchcontainer";

// TYPES.
import { Album } from "@/types";

// API CALLS.
import { getAlbums } from "@/apis/albums.api";
import { getAlbumsFromDiscogs } from "@/apis/discogs.api";
import { AlbumDialogue } from "@/components/dialogs/album-dialogue";

export default function Page() {
  // STATES.
  const [albums, setAlbums] = useState<Album[]>([]);
  const [local, setLocal] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(1);

  // HANDLE PAGE CHANGE.
  useEffect(() => {
    const fetchAlbums = async () => {
      // LOCAL DATABASE PULL.
      if (local) {
        const localAlbums = await getAlbums(
          searchQuery,
          currentPage.toString(),
        );

        if (!localAlbums) return;

        setAlbums(localAlbums.albums);
        setTotal(localAlbums.total);
      }

      // WIDER DATABASE PULL.
      if (!local) {
        const widerAlbums = await getAlbumsFromDiscogs(
          searchQuery,
          currentPage.toString(),
        );

        if (!widerAlbums) return;

        setAlbums(widerAlbums.albums);
      }
    };

    fetchAlbums();
    // eslint-disable-next-line
  }, [currentPage]);

  // HANDLE SUBMIT.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // LOCAL DATABASE PULL.
    if (local) {
      const localAlbums = await getAlbums(searchQuery);
      setAlbums(localAlbums.albums);
      setCurrentPage(1);
      setTotal(localAlbums.total);
    }

    // WIDER DATABASE PULL.
    if (!local) {
      const widerAlbums = await getAlbumsFromDiscogs(
        searchQuery,
        currentPage.toString(),
      );
      setAlbums(widerAlbums.albums);
      setCurrentPage(1);
      setTotal(widerAlbums.total);
    }
  };

  const handleSetSearchType = (value: string) => {
    if (value === "local") setLocal(true);
    else if (value === "wider") setLocal(false);
  };

  return (
    <ExtendedSearchContainer
      title="Search For Your Favourite Albums"
      description="Check out albums you have loved forever or brand new ones you want to listen to. If you can't find an album you want, switch to wider search!"
      handleSubmit={handleSubmit}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      total={total}
      resPerPage={25}
      handleSetSearchType={handleSetSearchType}
    >
      {albums ? (
        albums.map((album: Album) => (
          <div key={`${album.title}+${album.artist}+${album.genre}`}>
            <AlbumDialogue
              album={album}
              setAlbums={setAlbums}
              albums={albums}
              layoutType="Grid"
              local={local}
            />
          </div>
        ))
      ) : (
        <div>
          <p>Can`&apos;`t find the album? Switch to Wider Search!</p>
        </div>
      )}
    </ExtendedSearchContainer>
  );
}
