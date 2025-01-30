"use client";

import { List } from "@/types";
import { ListScrollDisplay } from "./list-scroll-display";

export function ProfileListDisplay({
  title,
  lists,
}: {
  title: string;
  lists: List[];
  username: string;
}) {
  const count = lists?.length || 0;

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl">
        {title}: {count}
      </h2>
      <div className="flex gap-2">
        <ListScrollDisplay lists={lists} />
      </div>

      {!lists && <p>none yet!</p>}
    </div>
  );
}
