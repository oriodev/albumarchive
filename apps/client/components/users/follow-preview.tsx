"use client";

import { User } from "@/types";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export function FollowPreview({
  title,
  users,
  disableSeeAll = false,
}: {
  title: string;
  users: User[];
  disableSeeAll?: boolean;
}) {
  const router = useRouter();
  // CAP HOW MANY FOLLOWERS ARE SHOWN.

  const count = users?.length || 0;

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl">
        {title}: {count}
      </h2>
      <div className="flex gap-2">
        {users &&
          users.map((user) => (
            <div
              key={user._id}
              className="flex-1 bg-gray-800 p-2 text-center hover:cursor-pointer hover:bg-gray-700"
              onClick={() => router.push(`/central/users/${user.username}`)}
            >
              {user.username}
            </div>
          ))}
      </div>

      {!disableSeeAll && users && <Button className="">See All</Button>}

      {!users && <p>none yet!</p>}
    </div>
  );
}
