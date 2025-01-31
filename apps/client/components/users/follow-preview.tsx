"use client";

import { User } from "@/types";
import { useRouter } from "next/navigation";
import UserImage from "./user-image";
import { useEffect, useState } from "react";
import { FullPagination } from "../nav/full-pagination";

export function FollowPreview({
  title,
  users,
}: {
  title: string;
  users: User[];
  showMoreBtn?: boolean;
  setShowMoreBtn: (showMoreBtn: boolean) => void;
}) {
  const router = useRouter();
  const resPerPage = 5;

  const [cappedUsers, setCappedUsers] = useState<User[]>(
    users.slice(0, resPerPage),
  );
  const [currentPage, setCurrentPage] = useState(1);

  const count = users?.length || 0;

  useEffect(() => {
    const startIndex = (currentPage - 1) * resPerPage;
    const endIndex = startIndex + resPerPage;

    setCappedUsers(users.slice(startIndex, endIndex));
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
              <UserImage user={user} size={150} />
            </div>
          ))}
      </div>

      <FullPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        total={users.length}
        resPerPage={resPerPage}
      />

      {!users && <p>none yet!</p>}
    </div>
  );
}
