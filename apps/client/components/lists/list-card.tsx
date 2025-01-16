"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { List } from "@/types";
import { slugify, truncateString } from "@/utils/global.utils";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";
import { getUser } from "@/api/user.api";

export function ListCard({ list }: { list: List }) {
  const router = useRouter();

  console.log("list: ", list);

  const handleLink = async () => {
    const user = await getUser(list.user);
    const listUrl = slugify(list.name);

    if (!user?.username) {
      return null;
    }

    router.push(`/central/users/${user?.username}/${listUrl}`);
  };

  const listText = list.totalLikes === 1 ? "like" : "likes";
  const albumText = list.albums.length === 1 ? "album" : "albums";

  return (
    <Card onClick={handleLink} className="hover:cursor-pointer">
      <CardHeader className="relative h-64 m-2"></CardHeader>
      <CardContent className="flex flex-col gap-1">
        <CardTitle>{truncateString(list.name, 25)}</CardTitle>
        <CardDescription className="flex flex-wrap gap-2">
          <Badge className="mt-2 bg-cyan-800 text-white hover:bg-cyan-900 hover:cursor-default">
            {list.albums.length} {albumText}
          </Badge>
          <Badge className="mt-2 bg-rose-800 text-white hover:bg-rose-900 hover:cursor-default">
            {list.totalLikes} {listText}
          </Badge>
        </CardDescription>
      </CardContent>
    </Card>
  );
}
