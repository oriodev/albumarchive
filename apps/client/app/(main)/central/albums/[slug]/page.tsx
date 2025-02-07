"use client";

// API CALLS.
import { getAlbumById, getAlbumsByArtist } from "@/api/albums.api";
import { addAlbumToList } from "@/api/list.api";
import { getAlbumRating, getRatingsCount } from "@/api/ratings.api";
import { getAllReviews, getReview } from "@/api/reviews.api";

// COMPONENTS.
import Image from "next/image";
import { AddToList } from "@/components/albums/add-to-list";
import ViewStarRating from "@/components/albums/viewStarRating";
import StarRating from "@/components/albums/editStarRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlbumScrollDisplay } from "@/components/albums/album-scroll-display";
import { FallbackAlbumPage } from "@/components/albums/fallback-album-page";
import { AlbumRecDialogue } from "@/components/album recs/album-rec-dialogue";
import GenreDisplay from "@/components/albums/genre-display";
import { AlbumReviewsContainer } from "@/components/reviews/album-reviews";
import { AddReviewDialogue } from "@/components/reviews/add-review-dialogue";

// HOOKS.
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/utils/providers/UserProvider";
import { useToast } from "@/hooks/use-toast";

// TYPES.
import { Album, RatingsCount, ReviewWithUser } from "@/types";

// UTILS.
import {
  getLocalDatabaseAlbum,
  isAlbumInListened,
  isAlbumInToListen,
} from "@/utils/lists.utils";
import { makeUpdatedAlbumInListUser } from "@/utils/user.utils";

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // HOOKS.
  const router = useRouter();
  const { user, updateUserInfo } = useUser();
  const { toast } = useToast();

  // STATES.
  const [album, setAlbum] = useState<Album | null>(null);
  const [albumRating, setAlbumRating] = useState(0);
  const [albumsByArtist, setAlbumsByArtist] = useState<Album[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [ratingsCount, setRatingsCount] = useState<RatingsCount | null>(null);
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [showAddToListen, setShowAddToListen] = useState(false);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [userReview, setUserReview] = useState<ReviewWithUser | null>(null);

  // FETCH ALBUM.
  useEffect(() => {
    const fetchAlbum = async () => {
      const id = (await params).slug;
      const fetchedAlbum = await getAlbumById(id);
      if (!fetchedAlbum) {
        router.replace("/central/albums");
      } else {
        setAlbum(fetchedAlbum);
      }
    };

    fetchAlbum();
  }, [params, router]);

  // FETCH RATINGS AND ALBUMS BY ARTIST.
  useEffect(() => {
    const fetchAlbumData = async () => {
      if (!album?._id) return;

      const [fetchedAlbumRating, fetchedRatingCount, fetchedAlbumsByArtist] =
        await Promise.all([
          getAlbumRating(album._id),
          getRatingsCount(album._id),
          getAlbumsByArtist(album.artist),
        ]);

      setAlbumRating(fetchedAlbumRating || 0);
      setRatingsCount(fetchedRatingCount);
      setAlbumsByArtist(
        fetchedAlbumsByArtist
          ?.filter((a: Album) => a._id !== album._id)
          .slice(0, 10) || [],
      );
      setShowAddToListen(
        !(
          (await isAlbumInToListen(user, album)) ||
          (await isAlbumInListened(user, album))
        ),
      );
    };

    fetchAlbumData();
  }, [album, user]);

  // FETCH USER REVIEW.
  useEffect(() => {
    const fetchUserReview = async () => {
      if (!album?._id || !user) return;

      const fetchedUserReview = await getReview(user._id, album._id);
      if (fetchedUserReview) setUserReview({ ...fetchedUserReview, user });
    };

    fetchUserReview();
  }, [album, user]);

  // FETCH REVIEWS.
  useEffect(() => {
    const fetchReviews = async () => {
      if (!album?._id || !user) return;

      const fetchedReviews = await getAllReviews(
        album._id,
        currentPage.toString(),
      );
      if (!fetchedReviews) return;

      setReviews(
        fetchedReviews.reviews.filter(
          (review: ReviewWithUser) => review.user._id !== user._id,
        ),
      );

      setTotalReviews(fetchedReviews.total);
      setLoading(false);
    };

    fetchReviews();
  }, [album, user, currentPage]);

  // ADD TO LISTEN.
  const addToListen = async () => {
    if (!user || !album || !user.lists) return;

    // IS ALBUM IN LOCAL DATABASE?
    const albumFromLocal = await getLocalDatabaseAlbum(album);
    if (!albumFromLocal?._id) return;

    // GET THE TO LISTEN LIST.
    const toListen = user.lists.filter((list) => list.slug === "to-listen")[0];
    if (!toListen._id) return;

    // GATE LISTENED.
    const inListened = await isAlbumInListened(user, album);
    if (inListened) return;

    // ADD ALBUM TO TO LISTEN..
    await addAlbumToList(toListen._id, albumFromLocal._id);

    const updatedUser = makeUpdatedAlbumInListUser(
      user,
      toListen?._id,
      albumFromLocal._id,
    );

    if (!updatedUser) return;

    updateUserInfo(updatedUser);

    // SEND TOAST.
    toast({
      title: `Added ${albumFromLocal.title} to To Listen`,
    });
  };

  if (!album) {
    return (
      <div>
        <FallbackAlbumPage />
      </div>
    );
  }

  return (
    <>
      {!loading ? (
        // MAIN COMPONENT.
        <div className="p-5 flex flex-col gap-5">
          {/* TOP SECTION */}
          <div className="flex flex-wrap lg:flex-nowrap justify-center lg:justify-normal gap-5">
            {/* IMAGE */}
            <div>
              <Image
                alt={album?.title || "album cover image"}
                src={album?.coverImage || ""}
                width={400}
                height={400}
              />
            </div>

            {/* INFO SECTION */}
            <div className="flex flex-col justify-between">
              {/* INFO */}
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <p className="font-bold text-3xl">{album?.title}</p>
                  <p className="text-xl">{album?.artist}</p>
                </div>

                <div>
                  <Badge className="text-lg bg-rose-900 text-white hover:bg-rose-800">
                    Released {album?.releaseDate || "Unknown"}
                  </Badge>
                </div>

                <div>
                  <ViewStarRating
                    rating={albumRating}
                    ratingsCount={ratingsCount?.total}
                    centered={false}
                  />
                </div>

                {album && <GenreDisplay album={album} />}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap gap-2">
                {album && <AddToList album={album} />}
                {showAddToListen && (
                  <Button onClick={addToListen}>Want To Listen</Button>
                )}

                {album && <AlbumRecDialogue album={album} />}
                {album && !userReview && <AddReviewDialogue album={album} />}
              </div>
            </div>
          </div>

          {/* OTHER ALBUMS BY THIS ARTIST */}
          {albumsByArtist && (
            <div>
              <h3 className="text-2xl font-bold">More Albums By This Artist</h3>
              <AlbumScrollDisplay albums={albumsByArtist} />
            </div>
          )}

          {/* RATING AND REVIEWS */}
          <div className="flex flex-wrap lg:flex-nowrap gap-5 justify-center lg:justify-normal">
            {/* RATING */}
            <div className="gap-2 bg-zinc-900 rounded-lg p-5 h-[130px]">
              <p className="text-xl font-bold">Rate This Album</p>
              {album && <StarRating album={album} />}
            </div>

            {/* REVIEWS. */}
            {album && ratingsCount && (
              <AlbumReviewsContainer
                album={album}
                reviews={reviews}
                userReview={userReview}
                ratingsCount={ratingsCount}
                totalReviews={totalReviews}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            )}
          </div>
        </div>
      ) : (
        // LOADING PAGE.
        <FallbackAlbumPage />
      )}
    </>
  );
}
