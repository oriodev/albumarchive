import { Album } from "@/types";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { truncateString } from "@/utils/global.utils";
import { AlbumBadges } from "./album-badges";

export function AlbumCard({ album }: { album: Album }) {
  return (
    <Card className="hover:cursor-pointer transition-transform transform hover:scale-105">
      <CardHeader className="relative h-64 m-2">
        {album.coverImage ? (
          <Image
            alt={album.title}
            src={album.coverImage}
            placeholder="blur"
            blurDataURL="/albumfallback.png"
            style={{ objectFit: "cover" }}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <Image
            alt={album.title}
            src="/albumfallback.png"
            style={{ objectFit: "cover" }}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-1 pt-3">
        <CardDescription></CardDescription>
        <CardTitle>{truncateString(album.title, 25)}</CardTitle>
        <p>{truncateString(album.artist, 25)}</p>
        <AlbumBadges album={album} />
      </CardContent>
    </Card>
  );
}
