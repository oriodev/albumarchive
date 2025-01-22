"use client";

// PACKAGES.
import { useEffect, useState } from "react";

// COMPONENTS.
import { SearchBar } from "@/components/albums/search-bar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlbumDisplay } from "@/components/albums/album-display";
import { FullPagination } from "@/components/nav/full-pagination";

// TYPES.
import { Album } from "@/types";

// API CALLS.
import { getAlbums } from "@/api/albums.api";
import { getAlbumsFromDiscogs } from "@/api/discogs.api";
import { Button } from "@/components/ui/button";

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
    <div className="flex flex-col gap-3">
      <p className="text-2xl pl-3">Albums.</p>

      {/* SEARCH BAR AND DROPDOWN. */}
      <div className="flex gap-2 w-full items-center flex-wrap lg:flex-nowrap">
        <form onSubmit={handleSubmit} className="w-full">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchType="albums"
          />
        </form>
        <div className="pl-3 flex gap-5">
          <Button
            onClick={handleSubmit}
            className="md:w-[250px] sm:w-[150px] h-full p-2"
          >
            Search
          </Button>

          <Select defaultValue="local" onValueChange={handleSetSearchType}>
            <SelectTrigger className="md:w-[250px] sm:w-[150px] h-full p-2">
              <SelectValue placeholder="Search Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="local">Local (Recommended)</SelectItem>
              <SelectItem value="wider">Wider</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ALBUMS. */}
      <AlbumDisplay albums={albums} setAlbums={setAlbums} local={local} />

      {/* HINT */}
      {albums.length < 1 && (
        <div className="flex justify-center">
          <p>swap to wider search to find more albums</p>
        </div>
      )}

      {/* PAGINATION. */}
      <FullPagination
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        total={total}
        resPerPage={25}
      />
    </div>
  );
}
