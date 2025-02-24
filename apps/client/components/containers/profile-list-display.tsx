"use client";

import { ImageType, List } from "@/types";
import { ScrollDisplay } from "../general/scrolldisplay";
import ImageCard from "../cards/imagecard";

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
        <ScrollDisplay>
          {lists.map((list: List) => (
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

      {!lists && <p>none yet!</p>}
    </div>
  );
}
