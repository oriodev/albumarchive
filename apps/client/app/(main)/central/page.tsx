"use client";

import { useEffect, useState } from "react";
import { ListScrollDisplay } from "@/components/lists/list-scroll-display";
import { List } from "@/types";
import { getTrendingLists } from "@/api/list.api";

export default function Page() {
  const [trendingLists, setTrendingLists] = useState<List[]>([]);

  useEffect(() => {
    const fetchLists = async () => {
      const fetchedTrendingLists = await getTrendingLists();
      if (fetchedTrendingLists) setTrendingLists(fetchedTrendingLists);
    };

    fetchLists();
  }, []);

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

      {/* NOTIFICATIONS. */}
    </div>
  );
}
