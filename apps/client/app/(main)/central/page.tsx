"use client";

// HOOKS.
import { useEffect, useState } from "react";

// COMPONENTS.
import { ListScrollDisplay } from "@/components/lists/list-scroll-display";

// TYPES.
import { List } from "@/types";

// APIS.
import { getTrendingLists } from "@/api/list.api";

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
      <h1 className="text-3xl pl-3">Central.</h1>

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
