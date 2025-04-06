"use client";

// API CALLS.
// import { createRating, deleteRating, updateRating } from "@/apis/ratings.api";

// TYPES
import { Album } from "@/types";

// COMPONENTS.
import { Star } from "lucide-react";

// HOOKS.
import { useEffect, useState } from "react";
import { useUser } from "@/utils/providers/UserProvider";
import { getReview } from "@/apis/reviews.api";

export default function EditStarRating({
  album,
  rating,
  ratingError,
  setRatingError,
  setRating,
}: {
  album: Album;
  rating: number;
  ratingError: boolean;
  setRatingError: (ratingError: boolean) => void;
  setRating: (rating: number) => void;
}) {
  // STATES.
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  // HOOKS.
  const { user } = useUser();

  // SET INITIAL DATA.
  useEffect(() => {
    const fetchRating = async () => {
      if (!user || !album._id) return;

      const fetchedReview = await getReview(user._id, album._id);

      if (!fetchedReview?.rating) return;
      setRating(fetchedReview.rating);
    };
    fetchRating();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [album, user]);

  const handleMouseEnter = (index: number) => {
    setHoveredRating(index);
  };

  const handleMouseLeave = () => {
    setHoveredRating(0);
  };

  const handleClick = async (index: number) => {
    setRating(index);

    if (!user || !album._id) {
      return;
    }

    setRating(index);
    setRatingError(false);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center cursor-pointer">
        {[1, 2, 3, 4, 5].map((index) => (
          <Star
            strokeWidth={0}
            size={50}
            key={index}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
            fill={index <= (hoveredRating || rating) ? "#fcd34d" : "grey"}
            className={`transition-colors duration-200`}
            data-cy="star"
          />
        ))}
      </div>
      {ratingError && (
        <p className="text-sm text-rose-800 text-center">pls add a rating</p>
      )}
    </div>
  );
}
