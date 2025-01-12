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

  const handleLink = async () => {
    const user = await getUser(list.user);
    const listUrl = slugify(list.name);

    if (!user?.username) {
      return null;
    }

    router.push(`/central/users/${user?.username}/${listUrl}`);
  };

  return (
    <Card onClick={handleLink} className="hover:cursor-pointer">
      <CardHeader className="relative h-64 m-2"></CardHeader>
      <CardContent className="flex flex-col gap-1">
        <CardTitle>{truncateString(list.name, 25)}</CardTitle>
        <CardDescription className="flex flex-wrap gap-2">
          <Badge className="mt-2 bg-cyan-300">
            {list.albums.length} albums
          </Badge>
          <Badge className="mt-2 bg-blue-300">x likes</Badge>
        </CardDescription>
      </CardContent>
    </Card>
  );
}
