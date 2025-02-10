"use client";

import { SearchBar } from "@/components/albums/search-bar";
import IconCard from "@/components/cards/iconcard";
import {
  Cloud,
  CloudLightning,
  DollarSignIcon,
  Guitar,
  Heart,
  Hourglass,
  LucideIcon,
} from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface Room {
  icon: LucideIcon;
  title: string;
  slug: string;
  description: string;
}

const roomData: Room[] = [
  {
    icon: Heart,
    title: "troye sivan",
    slug: "troye-sivan",
    description: "a room to talk abt troye sivan.",
  },
  {
    icon: CloudLightning,
    title: "all time low",
    slug: "all-time-low",
    description: "a room to talk abt all time low.",
  },
  {
    icon: Cloud,
    title: "green day",
    slug: "green-day",
    description: "a room to talk abt green day.",
  },
  {
    icon: Hourglass,
    title: "chappell roan",
    slug: "chappell-roan",
    description: "a room to talk abt chappell roan.",
  },
  {
    icon: DollarSignIcon,
    title: "drake",
    slug: "drake",
    description: "a room to talk abt drake.",
  },
  {
    icon: Guitar,
    title: "taylor swift",
    slug: "taylor-swift",
    description: "a room to talk abt taylor swift.",
  },
];

export default function Page() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [rooms, setRooms] = useState<Room[]>(roomData);

  useEffect(() => {
    setRooms(
      roomData.filter((room) => room.title.includes(searchQuery.toLowerCase())),
    );
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

      <div className="pl-2 grid gap-4 grid-cols-1 lg:grid-cols-3 md:grid-cols-2">
        {rooms.map((room) => (
          <IconCard
            key={room.title}
            room={room}
            active={true}
            handleOnClick={() => handleEnter(router, room.slug)}
          />
        ))}
      </div>
    </div>
  );
}
