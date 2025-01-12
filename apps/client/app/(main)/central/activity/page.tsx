"use client";

import { NotificationContainer } from "@/components/notifications/notification-container";
// COMPONENTS.
import { Badge } from "@/components/ui/badge";

// HOOKS.
import { useState } from "react";

export default function Page() {
  // USE STATES.
  const [selectedFilter, setSelectedFilter] = useState<string>("Activity");

  // FILTERS.
  const filters = ["Activity", "Friend Requests", "Album Recs", "Likes"];

  return (
    <div className="pl-3">
      <h1 className="text-3xl">ACTIVITY</h1>

      {/* FILTER BADGES. */}
      <div className="flex flex-wrap gap-3 pt-5">
        {filters.map((filter) => (
          <Badge
            key={filter}
            className={`text-lg hover:cursor-pointer ${selectedFilter === filter ? "bg-cyan-600 text-white" : ""}`}
            onClick={() => setSelectedFilter(filter)}
          >
            {filter}
          </Badge>
        ))}
      </div>

      <div className="pt-6">
        <NotificationContainer selectedFilter={selectedFilter} />
      </div>
    </div>
  );
}
