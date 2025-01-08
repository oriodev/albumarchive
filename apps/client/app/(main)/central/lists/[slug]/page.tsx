"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/utils/providers/UserProvider";
import { Album, List } from "@/types";
import { getAlbumById } from "@/api/albums.api";
import ListGrid from "@/components/lists/list-grid";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ListLoadingState } from "@/components/lists/list-loading-state";

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
    return <ListLoadingState />;
  }

  // NO LIST STATE.
  if (!list) {
    return <div>No list found.</div>;
  }

  // EMPTY LIST STATE.
  if (list.albums.length < 1) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xl">There are no lists here yet.</p>
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
    <div>
      <h1 className="text-2xl">{list.name}</h1>
      <p className="italic">{list.description}</p>
      <ListGrid albums={albums} setAlbums={setAlbums} />
    </div>
  );
}
