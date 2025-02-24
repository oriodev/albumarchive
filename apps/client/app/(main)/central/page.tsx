"use client";

// HOOKS.
import { useEffect, useState } from "react";

// COMPONENTS.

// TYPES.
import { ImageType, List } from "@/types";

// APIS.
import { getTrendingLists } from "@/api/list.api";
import PageHeader from "@/components/general/header";
import Link from "next/link";
import { ScrollDisplay } from "@/components/general/scrolldisplay";
import ImageCard from "@/components/cards/imagecard";

export default function Page() {
  // STATES.
  const [trendingLists, setTrendingLists] = useState<List[]>([]);

  // SET STATES.
  useEffect(() => {
    const fetchLists = async () => {
      const fetchedTrendingLists = await getTrendingLists();
      if (fetchedTrendingLists) setTrendingLists(fetchedTrendingLists);
    };

    fetchLists();
  }, []);

  const navLinks = [
    {
      title: "Albums",
      url: "/central/albums",
      colour: "cyan",
    },
    {
      title: "Lists",
      url: "/central/discover",
      colour: "cyan",
    },
    {
      title: "Listened",
      url: "/central/lists/listened",
      colour: "cyan",
    },
    {
      title: "To Listen",
      url: "/central/lists/to-listen",
      colour: "cyan",
    },
    {
      title: "Users",
      url: "/central/users",
      colour: "cyan",
    },
    {
      title: "Rooms",
      url: "/central/rooms",
      colour: "cyan",
    },
    {
      title: "Profile",
      url: "/central/profile",
      colour: "cyan",
    },
    {
      title: "Account",
      url: "/central/account",
      colour: "cyan",
    },
  ];

  // RENDER PAGE.
  return (
    <main className="flex flex-col gap-4">
      <PageHeader
        title="Album Archive Central"
        description="Track your albums. Make new friends. Savour your music."
      />

      <div className="pl-3 grid grid-cols-2 md:grid-cols-4 gap-4">
        {navLinks.map((link) => (
          <Link
            key={link.title}
            className={`bg-${link.colour}-950 shadow-lg rounded-md p-5 font-bold hover:bg-${link.colour}-900 hover:cursor-pointer transition`}
            href={link.url}
          >
            {link.title}
          </Link>
        ))}
      </div>

      {/* TRENDING LISTS. */}
      {trendingLists.length >= 1 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl pl-3">Most Popular Lists</h2>
          <ScrollDisplay>
            {trendingLists.map((list: List) => (
              <div
                className="flex-shrink-0 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
                key={`${list.name}+${list.user}`}
              >
                <ImageCard
                  key={`${list.name}+${list.user}`}
                  image={list.listCoverImg}
                  title={list.name}
                  imageType={ImageType.list}
                />
              </div>
            ))}
          </ScrollDisplay>
        </div>
      )}
    </main>
  );
}
