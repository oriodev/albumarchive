// TYPES.
import { Album, ImageType, RatingsCount } from "@/types";

// COMPONENTS.
import ImageLoader from "../general/imageloader";
import AlbumInfo from "./albuminfo";
import AlbumActionButton from "../buttons/albumactionbuttons";

// PROPS.
interface Props {
  album: Album;
  albumRating: number;
  ratingsCount: RatingsCount;
}

export default async function AlbumDetails({
  album,
  albumRating,
  ratingsCount,
}: Props) {
  return (
    <section className="flex flex-row flex-wrap gap-5 justify-center md:justify-start">
      <ImageLoader image={album.coverImage} size={400} type={ImageType.album} />

      <div className="flex flex-col justify-between gap-7 sm:gap-2">
        <AlbumInfo
          album={album}
          albumRating={albumRating}
          ratingsCount={ratingsCount}
        />

        <AlbumActionButton album={album} />
      </div>
    </section>
  );
}
