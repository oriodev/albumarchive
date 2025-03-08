"use client";

// TYPES.
import { Album, RatingsCount, ReviewWithUser } from "@/types";

// COMPONENTS.
import { ReviewCard } from "../cards/reviewcard";
import { RatingDisplay } from "@/components/ratings/rating-display";
import { FullPagination } from "../general/full-pagination";
import { useEffect, useState } from "react";
import { useUser } from "@/utils/providers/UserProvider";
import { getReview } from "@/api/reviews.api";
import { AddReviewDialogue } from "../dialogs/add-review-dialogue";

interface Props {
  album: Album;
  initialReviews: ReviewWithUser[];
  initialUserReview: ReviewWithUser | null;
  ratingsCount: RatingsCount | null;
  totalReviews: number;
}

export function AlbumReviewsContainer({
  album,
  initialReviews,
  initialUserReview,
  ratingsCount,
  totalReviews,
}: Props) {
  const { user } = useUser();

  // TODO: ADD PAGINATION STATES INTO HERE.
  const [currentPage, setCurrentPage] = useState(1);
  const [reviews] = useState(initialReviews);
  const [userReview, setUserReview] = useState(initialUserReview);

  useEffect(() => {
    const fetchUserReview = async () => {
      if (!album?._id || !user) return;

      const fetchedUserReview = await getReview(user._id, album._id);
      if (fetchedUserReview) setUserReview({ ...fetchedUserReview, user });
    };

    fetchUserReview();
  }, [album, user]);

  return (
    <div className="p-5 bg-zinc-900 rounded-lg max-w-full flex flex-col gap-7">
      <div className="flex flex-col gap-2">
        <p className="text-2xl font-bold">Reviews</p>
        {ratingsCount && <RatingDisplay ratings={ratingsCount} />}
      </div>

      <div className="flex flex-col gap-7">
        {userReview ? (
          <ReviewCard album={album} review={userReview} userReview={true} />
        ) : (
          <div>
            <AddReviewDialogue album={album} />
          </div>
        )}

        {reviews.map((review, index) => (
          <ReviewCard
            key={index}
            album={album}
            review={review}
            userReview={false}
          />
        ))}

        <FullPagination
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          total={totalReviews}
          resPerPage={10}
        />
      </div>
    </div>
  );
}
