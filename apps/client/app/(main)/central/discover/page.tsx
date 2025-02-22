"use client";

// API CALLS.
import { getAllLists } from "@/api/list.api";

// TYPES.
import { List } from "@/types";

// HOOKS.
import { useEffect, useState } from "react";

// COMPONENTS.
import { ListCard } from "@/components/lists/list-card";
import SearchContainer from "@/components/containers/searchcontainer";

export default function Page() {
  const [lists, setLists] = useState<List[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const resPerPage = 15;

  useEffect(() => {
    const fetchLists = async () => {
      const fetchedLists = await getAllLists("", currentPage.toString());

      if (fetchedLists) {
        setLists(fetchedLists.lists);
        setTotal(fetchedLists.total);
      }
    };

    fetchLists();
  }, [currentPage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    const fetchedLists = await getAllLists(searchQuery);
    setLists(fetchedLists.lists);
    setTotal(fetchedLists.total);
  };

  return (
    <SearchContainer
      title="Discover New Lists"
      description="Search through the carefully crafted lists put together by our users. Discover your new favourite albums!"
      handleSubmit={handleSubmit}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      total={total}
      resPerPage={resPerPage}
      searchType="lists"
    >
      {lists.map((list) => (
        <ListCard key={`${list.name}+${list.user}`} list={list} />
      ))}
    </SearchContainer>
  );
}
