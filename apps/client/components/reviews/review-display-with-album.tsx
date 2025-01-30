// TYPES.
import { Album, Review } from "@/types";
import { VibesDisplay } from "./vibes-display";
import ViewStarRating from "../albums/viewStarRating";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAlbumById } from "@/api/albums.api";
import { getRating } from "@/api/ratings.api";
import Image from "next/image";

export function ReviewDisplayWithAlbum({ review }: { review: Review }) {
  const [album, setAlbum] = useState<Album | null>(null);
  const [rating, setRating] = useState<number>(0);

  useEffect(() => {
    const fetchAlbum = async () => {
      const fetchedAlbum = await getAlbumById(review.album);
      if (!fetchedAlbum) return;
      setAlbum(fetchedAlbum);
    };

    const fetchRating = async () => {
      const fetchedRating = await getRating(review.user, review.album);
      if (!fetchedRating) return;
      setRating(fetchedRating.rating);
    };

    fetchAlbum();
    fetchRating();
  }, [review]);

  return (
    <>
      {review.user && album && (
        <div className={`flex justify-between gap-5`}>
          <div className="flex gap-5">
            <div className="flex flex-col gap-2">
              <Link
                href={`/central/albums/${album._id}`}
                className="flex hover:cursor-pointer w-[200px]"
              >
                <Image
                  src={album.coverImage}
                  alt={`${album.title}+${album.artist}`}
                  className="rounded-lg"
                  height={200}
                  width={200}
                />
              </Link>
              <h1 className="font-bold text-lg text-center">{`${album.title}`}</h1>
            </div>
            <div className="flex flex-col gap-3">
              {rating && <ViewStarRating rating={rating} centered={false} />}
              <VibesDisplay setVibes={review.vibes} />
              <p>{review.reviewText}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
