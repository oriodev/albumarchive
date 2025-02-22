"use client";

// HOOKS.
import { useEffect, useState } from "react";

// COMPONENTS.
import { ListScrollDisplay } from "@/components/lists/list-scroll-display";

// TYPES.
import { List } from "@/types";

// APIS.
import { getTrendingLists } from "@/api/list.api";
import PageHeader from "@/components/header";

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

  // RENDER PAGE.
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Album Archive Central"
        description="Track your albums. Make new friends. Savour your music."
      />

      {/* TRENDING LISTS. */}
      {trendingLists.length >= 1 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl pl-3">Most Popular Lists</h2>
          <ListScrollDisplay lists={trendingLists || []} />
        </div>
      )}
    </div>
  );
}
