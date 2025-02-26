import { Album, RatingsCount } from "@/types";
import { Badge } from "../ui/badge";
import ViewStarRating from "../ratings/viewStarRating";
import GenreDisplay from "./genre-display";

interface Props {
  album: Album;
  albumRating: number;
  ratingsCount: RatingsCount;
}

export default function AlbumInfo({ album, albumRating, ratingsCount }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1 text-center sm:text-left">
        <p className="font-bold text-3xl">{album.title}</p>
        <p className="text-xl">{album.artist}</p>
      </div>

      <div className="flex justify-center md:justify-start">
        <Badge className="text-lg bg-rose-900 text-white ">
          Released {album.releaseDate || "Unknown"}
        </Badge>
      </div>

      <div className="flex justify-center md:justify-start">
        <ViewStarRating
          rating={albumRating}
          ratingsCount={ratingsCount.total}
          centered={false}
        />
      </div>

      {album && <GenreDisplay album={album} />}
    </div>
  );
}
