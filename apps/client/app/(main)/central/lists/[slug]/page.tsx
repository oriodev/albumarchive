"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/utils/providers/UserProvider";
import { getList } from "@/api/list.api";
import { List } from "@/types";

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = useUser();
  const [list, setList] = useState<List>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchList = async () => {
      if (user && user.id) {
        const slug = (await params).slug;

        const fetchedList = await getList(slug, user.id);
        setList(fetchedList);
      }
      setLoading(false);
    };

    fetchList();
  }, [user, params]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!list) {
    return <div>No list found.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl">{list.name}</h1>
      <p className="italic">{list.description}</p>
    </div>
  );
}
