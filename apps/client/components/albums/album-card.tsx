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
import RatingStars from "./rating-stars";
import { AlbumBadges } from "./album-badges";

export function AlbumCard({ album }: { album: Album }) {
  return (
    <Card>
      <CardHeader className="relative h-64 m-2">
        <Image
          alt={album.title}
          src={album.coverImage}
          style={{ objectFit: "cover" }}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <CardDescription>
          <RatingStars rating={album.overallRating} centered={true} />
        </CardDescription>
        <CardTitle>{truncateString(album.title, 25)}</CardTitle>
        <p>{truncateString(album.artist, 25)}</p>
        <AlbumBadges album={album} />
      </CardContent>
    </Card>
  );
}
