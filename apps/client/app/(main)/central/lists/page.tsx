"use client";

import { getUserLikedLists } from "@/api/likes.api";
import ImageCard from "@/components/cards/imagecard";
import { ScrollDisplay } from "@/components/general/scrolldisplay";
// COMPONENTS.

// TYPES.
import { ImageType, List } from "@/types";

// HOOKS.
import { useUser } from "@/utils/providers/UserProvider";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  // HOOKS.
  const { user } = useUser();

  // STATES.
  const [likedLists, setLikedLists] = useState<List[]>([]);

  // GRAB LIKED LISTS.
  useEffect(() => {
    const fetchLikedLists = async () => {
      if (!user) return null;

      const fetchedLikedLists = await getUserLikedLists(user._id);
      setLikedLists(fetchedLikedLists);
    };

    fetchLikedLists();
  }, [user]);

  if (!user)
    <div>
      <h1 className="text-3xl">No User.</h1>
    </div>;
  if (!user?.lists)
    return (
      <div>
        <h1>No lists yet.</h1>
      </div>
    );

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl pl-3">Lists</h1>

      {/* ALL USER LISTS. */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl pl-3">All Your Lists.</h2>
        <ScrollDisplay>
          {user.lists.map((list: List) => (
            <Link
              href={`/central/${user.username}/${list.slug}`}
              className="flex-shrink-0 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
              key={`${list.name}+${list.user}`}
            >
              <ImageCard
                key={`${list.name}+${list.user}`}
                image={list.listCoverImg}
                title={list.name}
                imageType={ImageType.list}
              />
            </Link>
          ))}
        </ScrollDisplay>
      </div>

      {/* LISTS YOU HAVE LIKED. */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl pl-3">Liked Lists.</h2>
        <ScrollDisplay>
          {likedLists.map((list: List) => (
            <div
              className="flex-shrink-0 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
              key={`${list.name}+${list.user}`}
            >
              <ImageCard
                key={`${list.name}+${list.user}`}
                image={list.listCoverImg}
                title={list.name}
                imageType={ImageType.list}
              />
            </div>
          ))}
        </ScrollDisplay>
      </div>
    </div>
  );
}
