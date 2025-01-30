// TYPES.
import { Album, RatingsCount, ReviewWithUser } from "@/types";

// COMPONENTS.
import { ReviewDisplay } from "./review-display";
import { RatingDisplay } from "@/components/reviews/rating-display";

export function AlbumReviewsContainer({
  album,
  reviews,
  userReview,
  ratingsCount,
}: {
  album: Album;
  reviews: ReviewWithUser[];
  userReview: ReviewWithUser | null;
  ratingsCount: RatingsCount | null;
}) {
  return (
    <div className="p-5 bg-zinc-900 rounded-lg w-full flex flex-col gap-7">
      <p className="text-xl font-bold">Reviews</p>

      <div className="flex flex-col gap-5">
        {ratingsCount && <RatingDisplay ratings={ratingsCount} />}

        {/* TRYING TO ADD FILTERING TO DIFF RATINGS */}

        {userReview && (
          <ReviewDisplay album={album} review={userReview} userReview={true} />
        )}

        {reviews.map((review, index) => (
          <ReviewDisplay
            key={index}
            album={album}
            review={review}
            userReview={false}
          />
        ))}
      </div>
    </div>
  );
}
