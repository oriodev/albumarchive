// TYPES.
import { Album, ReviewWithUser } from "@/types";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { VibesDisplay } from "./vibes-display";
import ViewStarRating from "../albums/viewStarRating";
import Link from "next/link";
import { EditReviewDialogue } from "./edit-review-dialogue";
import { DeleteDialog } from "./delete-dialog";
import { deleteReview } from "@/api/reviews.api";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/utils/providers/UserProvider";

export function ReviewDisplay({
  review,
  userReview,
  album,
}: {
  review: ReviewWithUser;
  userReview: boolean;
  album?: Album;
}) {
  const { toast } = useToast();
  const { user, updateUserInfo } = useUser();

  const onDelete = async () => {
    if (!review._id) return;

    const deletedReview = await deleteReview(review._id);

    if (!deletedReview?._id || !user?.reviews) return;

    const updatedUser = {
      reviews: [
        ...user.reviews.filter((review) => review._id !== deletedReview._id),
      ],
    };

    updateUserInfo(updatedUser);

    if (deletedReview) {
      toast({
        title: "deleted review!",
      });
    }
  };

  return (
    <>
      {review.user && (
        <div className={`flex justify-between gap-5 bg-zine-900 w-full`}>
          <div className="flex gap-5">
            <div className="flex flex-col gap-2">
              <Link
                href={`/central/users/${review.user.username}`}
                className="flex hover:cursor-pointer"
              >
                <Avatar className="w-20 h-20 text-3xl">
                  <AvatarImage src="/userfallback.png" className="rounded-lg" />
                </Avatar>
              </Link>
              <h1 className="font-bold text-center">{review.user.username}</h1>
            </div>
            <div className="flex flex-col gap-3">
              {review.rating.rating && (
                <ViewStarRating
                  rating={review.rating.rating}
                  centered={false}
                />
              )}
              <VibesDisplay setVibes={review.vibes} />
              <p>{review.reviewText}</p>
            </div>
          </div>

          {userReview && album && (
            <div className="flex flex-col gap-3">
              <EditReviewDialogue review={review} album={album} />
              <DeleteDialog thingToDelete="Review" deleteFunction={onDelete} />
            </div>
          )}
        </div>
      )}
    </>
  );
}
