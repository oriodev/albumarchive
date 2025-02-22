"use client";

import { getRooms } from "@/api/rooms.api";
import { SearchBar } from "@/components/albums/search-bar";
import TextCard from "@/components/cards/textcard";
import { Room } from "@/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// MAYBE:
// 1. send lists and albums.

export default function Page() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const fetchedRooms = await getRooms();
      setRooms(fetchedRooms);
      setFilteredRooms(fetchedRooms);
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    setFilteredRooms(
      rooms.filter((room) =>
        room.title.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleEnter = (router: AppRouterInstance | string[], slug: string) => {
    router.push(`/central/rooms/${slug}`);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl pl-3">Rooms.</h1>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchType="rooms"
        />
      </div>

      <div className="pl-2 grid gap-4 grid-cols-1 lg:grid-cols-3">
        {filteredRooms.map((room) => (
          <TextCard
            key={room.title}
            room={room}
            active={room.users.length > 0}
            handleOnClick={() => handleEnter(router, room.slug)}
          />
        ))}
      </div>
    </div>
  );
}
