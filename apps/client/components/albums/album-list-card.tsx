import { Album } from "@/types";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { truncateString } from "@/utils/global.utils";
import RatingStars from "./rating-stars";
import { AlbumBadges } from "./album-badges";

export function AlbumListCard({ album }: { album: Album }) {
  return (
    <Card className="flex hover:cursor-pointer transition-transform transform hover:scale-95">
      <div className="mr-4 relative w-[150px] h-[150px]">
        {/* Set width and height to the same value */}
        <Image
          alt={album.title}
          src={album.coverImage}
          style={{ objectFit: "cover" }}
          fill
        />
      </div>
      <CardContent className="flex flex-col justify-center">
        <CardDescription className="flex flex-col">
          <div>
            <CardTitle className="text-2xl text-left">
              {truncateString(album.title, 100)}
            </CardTitle>
            <p className="text-lg text-left">
              {truncateString(album.artist, 100)}
            </p>
            <RatingStars rating={album.overallRating} centered={false} />
          </div>
          <div className="pt-6">
            <AlbumBadges album={album} />
          </div>
        </CardDescription>
      </CardContent>
    </Card>
  );
}
