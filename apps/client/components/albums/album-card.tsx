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

export function AlbumCard({ album }: { album: Album }) {
  console.log("album: ", album);

  return (
    <Card>
      <CardHeader className="relative h-64 m-2">
        <Image
          alt={album.title}
          src={album.coverImage}
          // width={500}
          layout="fill"
          objectFit="cover"
        />
      </CardHeader>
      <CardContent>
        <CardTitle>{truncateString(album.title, 25)}</CardTitle>
        <CardDescription>{album.overallRating || "???"}</CardDescription>
        <p>{truncateString(album.artist, 25)}</p>
        <p>{truncateString(album.genre, 25)}</p>
        <p>{truncateString(album.releaseDate, 25)}</p>
      </CardContent>
    </Card>
  );
}
