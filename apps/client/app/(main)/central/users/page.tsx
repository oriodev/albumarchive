"use client";

import { getAllUsers } from "@/api/user.api";
import { SearchBar } from "@/components/albums/search-form";
import UserDisplayCard from "@/components/users/user-display-card";
import { User } from "@/types";
import { useState } from "react";

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const users = await getAllUsers(searchQuery);

    setUsers(users);
  };

  console.log(users);

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
          <UserDisplayCard key={user.username} user={user} />
        ))}

        <div></div>
      </div>
    </>
  );
}
