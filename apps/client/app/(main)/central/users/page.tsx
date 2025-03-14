"use client";

import { getAllUsers } from "@/api/user.api";
import ImageCard from "@/components/cards/imagecard";
import SearchContainer from "@/components/containers/searchcontainer";
import { ImageType, User } from "@/types";
import { useUser } from "@/utils/providers/UserProvider";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const { user: currentUser } = useUser();

  const resPerPage = 15;

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
    <SearchContainer
      title="Find Friends to Follow"
      description="Find your friends and explore all their favourite music."
      handleSubmit={handleSubmit}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      total={total}
      resPerPage={resPerPage}
      searchType="users"
    >
      {users.map((user: User) => (
        <Link key={user.username} href={`/central/users/${user.username}`}>
          <ImageCard
            image={user.profileImg}
            title={user.username}
            imageType={ImageType.user}
          />
        </Link>
      ))}
    </SearchContainer>
  );
}
