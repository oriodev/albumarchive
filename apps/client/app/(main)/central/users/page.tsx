"use client";

import { getAllUsers } from "@/api/user.api";
import { SearchBar } from "@/components/albums/search-form";
import { UserDisplayDialogue } from "@/components/users/user-display-dialogue";
import { User } from "@/types";
import { useUser } from "@/utils/providers/UserProvider";
import { useState } from "react";

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { user: currentUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const users = await getAllUsers(searchQuery);

    const usersWithoutSelf = users.filter(
      (user: User) => user.username !== currentUser?.username,
    );

    setUsers(usersWithoutSelf);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchType="users"
        />
      </form>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2">
        {users.map((user: User) => (
          <UserDisplayDialogue key={user.username} user={user} />
        ))}

        <div></div>
      </div>
    </>
  );
}
