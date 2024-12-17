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

export function AlbumCard({ album }: { album: Album }) {
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
        <CardDescription>
          <RatingStars rating={album.overallRating} centered={true} />
        </CardDescription>
        <CardTitle>{truncateString(album.title, 25)}</CardTitle>
        <p>{truncateString(album.artist, 25)}</p>
      </CardContent>
    </Card>
  );
}
