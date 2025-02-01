"use client";

// API CALLS.
import { getAllLists } from "@/api/list.api";

// TYPES.
import { List } from "@/types";

// HOOKS.
import { useEffect, useState } from "react";

// COMPONENTS.
import { SearchBar } from "@/components/albums/search-bar";
import { ListCard } from "@/components/lists/list-card";
import { FullPagination } from "@/components/nav/full-pagination";

export default function Page() {
  const [lists, setLists] = useState<List[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

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
    <>
      <p className="text-2xl pl-3">Discover.</p>

      <h2 className="text-2xl pl-3">Search Lists</h2>
      <form onSubmit={handleSubmit}>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchType="lists"
        />
      </form>

      <div className="pl-3 grid grid-cols-1 gap-4 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2">
        {lists.map((list: List) => (
          <ListCard key={`${list.name}+${list.user}`} list={list} />
        ))}
      </div>

      <FullPagination
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        total={total}
        resPerPage={5}
      />
    </>
  );
}
