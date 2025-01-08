"use client";

import { getAlbumById } from "@/api/albums.api";
// API CALLS.
import { getList } from "@/api/list.api";
import { getUserByUsername } from "@/api/user.api";
import ListGrid from "@/components/lists/list-grid";
import { ListLoadingState } from "@/components/lists/list-loading-state";

// TYPES.
import { Album, List, User } from "@/types";

// HOOKS.
// import { useUser } from "@/utils/providers/UserProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ username: string; listname: string }>;
}) {
  // HOOKS
  //   const { user: currentUser } = useUser();
  const router = useRouter();

  // USESTATES.
  const [user, setUser] = useState<User | null>(null);
  const [list, setList] = useState<List | null>(null);
  const [loading, setLoading] = useState(true);
  const [albums, setAlbums] = useState<Album[]>([]);

  // FETCH USER.
  useEffect(() => {
    const fetchUser = async () => {
      const slug = (await params).username;

      const fetchedUser = await getUserByUsername(slug.toLowerCase());

      if (!fetchedUser) {
        router.replace("/central/not-found");
      }

      setUser(fetchedUser);
    };

    fetchUser();
  }, [params, router]);

  // FETCH LIST.
  useEffect(() => {
    if (user) {
      const fetchList = async () => {
        const slug = (await params).listname;

        if (!user?._id) {
          return null;
        }

        const fetchedList = await getList(slug.toLowerCase(), user._id);

        if (!fetchedList) {
          router.replace("/central/not-found");
        }

        setList(fetchedList);
        setLoading(false);
      };

      fetchList();
    }
  }, [params, user, router]);

  useEffect(() => {
    const getFullAlbums = async () => {
      if (list && list.albums) {
        const fullAlbums = await Promise.all(
          list.albums.map(async (albumId) => await getAlbumById(albumId)),
        );

        setAlbums(fullAlbums);
      }
    };

    getFullAlbums();
  }, [list]);

  if (loading) {
    return <ListLoadingState />;
  }

  if (!list) {
    return <div>No list found.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl">{list.name}</h1>
      <p className="italic">{list.description}</p>
      <ListGrid albums={albums} setAlbums={setAlbums} />
    </div>
  );
}
