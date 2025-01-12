"use client";

import { getAllUsers } from "@/api/user.api";
import { SearchBar } from "@/components/albums/search-form";
import { FullPagination } from "@/components/nav/full-pagination";
import { UserDisplayDialogue } from "@/components/users/user-display-dialogue";
import { User } from "@/types";
import { useUser } from "@/utils/providers/UserProvider";
import { useEffect, useState } from "react";

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const { user: currentUser } = useUser();

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getAllUsers("", currentPage.toString());

      if (fetchedUsers) {
        const usersWithoutSelf = fetchedUsers.users.filter(
          (user: User) => user.username !== currentUser?.username,
        );

        setUsers(usersWithoutSelf);
        setTotal(fetchedUsers.total);
      }
    };

    fetchUsers();
  }, [currentPage, currentUser?.username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);

    const fetchedUsers = await getAllUsers(searchQuery);

    const usersWithoutSelf = fetchedUsers.users.filter(
      (user: User) => user.username !== currentUser?.username,
    );

    setUsers(usersWithoutSelf);
    setTotal(fetchedUsers.total);
  };

  return (
    <>
      <p className="text-2xl pl-3">Users.</p>

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
      </div>

      <FullPagination
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        total={total}
        resPerPage={3}
      />
    </>
  );
}
