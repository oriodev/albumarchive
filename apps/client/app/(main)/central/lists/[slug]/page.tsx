"use client";

// HOOKS.
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/utils/providers/UserProvider";

// TYPES.
import { Album, AlbumType, List } from "@/types";

// COMPONENTS.
import ListGrid from "@/components/lists/list-grid";
import { Button } from "@/components/ui/button";
import { ListLoadingState } from "@/components/lists/list-loading-state";

// API.
import { getAlbumById } from "@/api/albums.api";
import { LikeList } from "@/components/lists/like-list";
import ListLayoutSwitch from "@/components/lists/list-layout-switch";
import ListList from "@/components/lists/list-list";

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // USE STATE.
  const { user } = useUser();
  const [list, setList] = useState<List>();
  const [loading, setLoading] = useState(true);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [layoutType, setLayoutType] = useState("Grid");

  // HOOKS.
  const router = useRouter();

  // GRAB THE FULL LIST.
  useEffect(() => {
    const fetchList = async () => {
      if (user && user._id && user.lists) {
        const slug = (await params).slug;

        const fetchedList = user.lists.filter(
          (list) => list.slug.toLowerCase() === slug.toLowerCase(),
        )[0];

        if (!fetchedList) {
          setLoading(false);
        }

        setList(fetchedList);
      }
    };

    fetchList();
  }, [user, params]);

  // GRAB THE FULL ALBUMS.
  useEffect(() => {
    const getFullAlbums = async () => {
      if (list && list.albums) {
        const fullAlbums = await Promise.all(
          list.albums.map(async (albumId) => await getAlbumById(albumId)),
        );

        setAlbums(fullAlbums);
        setLoading(false);
      }
    };

    getFullAlbums();
  }, [list]);

  // LOADING STATE.
  if (loading) {
    return <ListLoadingState albumCount={5} />;
  }

  // NO LIST STATE.
  if (!list) {
    return <div>No list found.</div>;
  }

  // EMPTY LIST STATE.
  if (list.albums.length < 1) {
    return (
      <div className="flex flex-col gap-2 justify-center items-center h-full">
        <p className="text-xl">There are no albums here yet.</p>
        {
          !(
            list.type === AlbumType.LISTENED || list.type === AlbumType.TOLISTEN
          )
        }
        {/* fix this ^^^ */}
        <Button
          className="w-1/5"
          onClick={() => router.push("/central/albums")}
        >
          Add Albums Now
        </Button>
      </div>
    );
  }

  // NORMAL LIST STATE.
  return (
    // TOTAL.
    <div className="flex flex-col gap-5">
      {/* HEADER. */}
      <div className="flex flex-col flex-wrap gap-2">
        {/* NAME AND DESCRIPTION. */}
        <div>
          <h1 className="text-2xl">{list.name}</h1>
          <p className="italic">{list.description}</p>
        </div>

        {/* BAR. */}
        <div className="flex flex-wrap gap-3">
          {!(
            list.type === AlbumType.LISTENED || list.type === AlbumType.TOLISTEN
          ) && <LikeList list={list} clickable={false} />}
          <ListLayoutSwitch
            layoutType={layoutType}
            setLayoutType={setLayoutType}
          />
        </div>
      </div>

      {/* ALBUMS. */}
      {layoutType === "Grid" ? (
        <ListGrid
          albums={albums}
          setAlbums={setAlbums}
          layoutType={layoutType}
        />
      ) : (
        <ListList
          albums={albums}
          setAlbums={setAlbums}
          layoutType={layoutType}
        />
      )}
    </div>

    // <div className="">
    //   <div className="">

    //   </div>

    // </div>
  );
}
