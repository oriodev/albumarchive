"use client";

import { List } from "@/types";
import { slugify } from "@/utils/global.utils";
import { useRouter } from "next/navigation";

export function ProfileListDisplay({
  title,
  lists,
  username,
}: {
  title: string;
  lists: List[];
  username: string;
}) {
  const router = useRouter();

  const count = lists?.length || 0;

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl">
        {title}: {count}
      </h2>
      <div className="flex gap-2">
        {lists &&
          lists.map((list) => (
            <div
              key={list._id}
              className="flex-1 bg-gray-800 p-2 text-center hover:cursor-pointer hover:bg-gray-700"
              onClick={() =>
                router.push(`/central/users/${username}/${slugify(list.name)}`)
              }
            >
              {list.name}
            </div>
          ))}
      </div>

      {!lists && <p>none yet!</p>}
    </div>
  );
}
