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
import Image from "next/image";

export function ListCard({ list }: { list: List }) {
  const router = useRouter();

  const handleLink = async () => {
    const user = await getUser(list.user);
    const listUrl = slugify(list.name);

    if (!user?.username) {
      return null;
    }

    router.push(`/central/users/${user?.username}/${listUrl}`);
  };

  const listText = list.totalLikes === 1 ? "like" : "likes";
  const albumText = list.albums
    ? list.albums.length === 1
      ? "album"
      : "albums"
    : 0;

  return (
    <Card
      onClick={handleLink}
      className="flex flex-col gap-5 hover:cursor-pointer transition-transform transform hover:scale-105"
    >
      <CardHeader className="relative">
        <Image
          src="/listfallback.png"
          width={500}
          height={500}
          alt="list fallback image"
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <CardTitle>{truncateString(list.name, 25)}</CardTitle>
        <CardDescription className="flex flex-wrap gap-2">
          <Badge className="mt-2 bg-cyan-800 text-white hover:bg-cyan-900 hover:cursor-default">
            {list.albums.length || 0} {albumText}
          </Badge>
          <Badge className="mt-2 bg-rose-800 text-white hover:bg-rose-900 hover:cursor-default">
            {list.totalLikes || 0} {listText}
          </Badge>
        </CardDescription>
      </CardContent>
    </Card>
  );
}
