"use client";

import { getAlbumById } from "@/api/albums.api";
// API CALLS.
import { getList } from "@/api/list.api";
import { getUserByUsername } from "@/api/user.api";
import { LikeList } from "@/components/lists/like-list";
import { ListAlbumDisplay } from "@/components/lists/list-album-display";
import ListLayoutSwitch from "@/components/lists/list-layout-switch";
import { ListLoadingState } from "@/components/lists/list-loading-state";

// TYPES.
import { Album, List, User } from "@/types";
import { useUser } from "@/utils/providers/UserProvider";
import Link from "next/link";

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
  const { user: currentUser } = useUser();
  const router = useRouter();

  // USESTATES.
  const [user, setUser] = useState<User | null>(null);
  const [list, setList] = useState<List | null>(null);
  const [loading, setLoading] = useState(true);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [layoutType, setLayoutType] = useState("Grid");

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

        const fetchedList = await getList(slug.toLowerCase(), user._id);

        if (user.username === currentUser?.username) {
          router.push(`/central/lists/${fetchedList.slug}`);
        }

        if (!fetchedList) {
          router.replace("/central/not-found");
        }

        setList(fetchedList);
        setLoading(false);
      };

      fetchList();
    }
  }, [params, user, currentUser, router]);

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
    <div className="flex flex-col gap-5">
      {/* HEADER. */}
      <div className="flex flex-col flex-wrap gap-2">
        {/* NAME AND DESCRIPTION. */}
        <div>
          {/* HEADING */}
          <div className="flex flex-wrap gap-2">
            <h1 className="text-2xl">{list.name} </h1>
            <Link href={`/central/users/${user?.username}`}>
              <p className="text-2xl hover:text-rose-700 transition-colors duration-200">
                {" "}
                by {user?.username || "idk"}
              </p>
            </Link>
          </div>
          <p className="italic">{list.description}</p>
        </div>

        {/* BAR. */}
        <div className="flex flex-wrap gap-2">
          <LikeList list={list} clickable={true} />
          <ListLayoutSwitch
            layoutType={layoutType}
            setLayoutType={setLayoutType}
          />
        </div>
      </div>

      {/* ALBUMS. */}
      <ListAlbumDisplay
        albums={albums}
        setAlbums={setAlbums}
        layoutType={layoutType}
      />
    </div>
  );
}
