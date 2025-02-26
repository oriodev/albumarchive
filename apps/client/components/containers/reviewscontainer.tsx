import { Album, RatingsCount, Review, ReviewWithUser, User } from "@/types";
import { AlbumReviewsContainer } from "./reviewdisplaycontainer";
import { getAllReviews, getReview } from "@/api/reviews.api";

interface Props {
  album: Album;
  user: User;
  ratingsCount: RatingsCount;
}

export default async function ReviewsContainer({
  album,
  user,
  ratingsCount,
}: Props) {
  // TODO: RENDER THIS A CORRECT LOADING STATE.
  if (!album._id) return <div>no album TODO: FIX THIS !!</div>;

  const fetchedUserReview: Review | null = await getReview(user._id, album._id);
  const userReview: ReviewWithUser | null = fetchedUserReview
    ? { ...fetchedUserReview, user }
    : null;

  const allReviews = await getAllReviews(album._id, "1");
  const reviews = allReviews.reviews.filter(
    (review: ReviewWithUser) => review.user._id !== user._id,
  );
  const totalReviews = allReviews.total;

  return (
    <div className="max-w-full pt-5">
      <AlbumReviewsContainer
        album={album}
        initialReviews={reviews}
        initialUserReview={userReview}
        ratingsCount={ratingsCount}
        totalReviews={totalReviews}
      />
    </div>
  );
}
