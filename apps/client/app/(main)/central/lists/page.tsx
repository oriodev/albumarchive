"use client";

import { getUserLikedLists } from "@/api/likes.api";
import { getListById } from "@/api/list.api";
// COMPONENTS.
import { ListScrollDisplay } from "@/components/lists/list-scroll-display";
import { NoUser } from "@/components/users/no-user";

// TYPES.
import { List } from "@/types";

// HOOKS.
import { useUser } from "@/utils/providers/UserProvider";
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

      if (fetchedLikedLists) {
        const fullLists = await Promise.all(
          fetchedLikedLists.map(async (listId) => await getListById(listId)),
        );

        const listsWithoutNulls = fullLists.filter((list) => list !== null);

        setLikedLists(listsWithoutNulls);
      }
    };

    fetchLikedLists();
  }, [user]);

  if (!user) <NoUser />;

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
        <ListScrollDisplay lists={user && user.lists} />
      </div>

      {/* LISTS YOU HAVE LIKED. */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl pl-3">Liked Lists.</h2>
        <ListScrollDisplay lists={likedLists || []} />
      </div>
    </div>
  );
}
