// TYPES.
import { Album, RatingsCount, ReviewWithUser } from "@/types";

// COMPONENTS.
import { ReviewDisplay } from "../cards/review-display";
import { RatingDisplay } from "@/components/ratings/rating-display";
import { FullPagination } from "../general/full-pagination";

export function AlbumReviewsContainer({
  album,
  reviews,
  userReview,
  ratingsCount,
  totalReviews,
  currentPage,
  setCurrentPage,
}: {
  album: Album;
  reviews: ReviewWithUser[];
  userReview: ReviewWithUser | null;
  ratingsCount: RatingsCount | null;
  totalReviews: number;
  currentPage: number;
  setCurrentPage: (currentPage: number) => void;
}) {
  return (
    <div className="p-5 bg-zinc-900 rounded-lg w-full flex flex-col gap-7">
      <div className="flex flex-col gap-2">
        <p className="text-xl font-bold">Reviews</p>
        {ratingsCount && <RatingDisplay ratings={ratingsCount} />}
      </div>

      <div className="flex flex-col gap-5">
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
