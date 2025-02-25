"use client";

import { ImageType, User } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FullPagination } from "../general/full-pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import ImageLoader from "../general/imageloader";

export function FollowPreview({
  title,
  users = [],
}: {
  title: string;
  users: User[];
}) {
  const router = useRouter();
  const resPerPage = 5;

  const [cappedUsers, setCappedUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const count = users?.length || 0;

  useEffect(() => {
    if (users) {
      const startIndex = (currentPage - 1) * resPerPage;
      const endIndex = startIndex + resPerPage;

      setCappedUsers(users.slice(startIndex, endIndex));
    }
  }, [currentPage, users]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <h2 className="text-2xl">{title}</h2>
        <h2 className="text-2xl">[ {count} ]</h2>
      </div>
      <div className="flex gap-5">
        {cappedUsers &&
          cappedUsers.map((user) => (
            <div
              key={user._id}
              className=""
              onClick={() => router.push(`/central/users/${user.username}`)}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <ImageLoader
                      image={user.profileImg}
                      size={150}
                      type={ImageType.user}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{user.username}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}

        {!users && <div>none yet!</div>}
      </div>

      {users && (
        <FullPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          total={users.length}
          resPerPage={resPerPage}
        />
      )}
    </div>
  );
}
