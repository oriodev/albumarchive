"use client";

// API CALLS.
import {
  createRating,
  deleteRating,
  getRating,
  updateRating,
} from "@/api/ratings.api";

// TYPES
import { Album, Rating } from "@/types";

// COMPONENTS.
import { Star } from "lucide-react";

// HOOKS.
import { useEffect, useState } from "react";
import { useUser } from "@/utils/providers/UserProvider";

export default function EditStarRating({ album }: { album: Album }) {
  // STATES.
  const [rating, setRating] = useState<number>(0);
  const [ratingId, setRatingId] = useState<string | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  // HOOKS.
  const { user } = useUser();

  // SET INITIAL DATA.
  useEffect(() => {
    const fetchRating = async () => {
      if (!user || !album._id) {
        return;
      }

      const fetchedRating = await getRating(user._id, album._id);

      if (fetchedRating?.rating && fetchedRating?._id) {
        setRating(fetchedRating.rating);
        setRatingId(fetchedRating?._id);
      }
    };

    fetchRating();
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
      return; // toast?
    }

    // delete rating.
    if (ratingId && rating === index) {
      const deletedRating = await deleteRating(ratingId);

      if (deletedRating) {
        setRating(0);
      }

      return;
    }

    let response;

    const ratingPayload: Rating = {
      user: user._id,
      album: album._id,
      rating: index,
    };

    if (!ratingId) {
      response = await createRating(ratingPayload);
    } else {
      response = await updateRating(ratingId, index);
    }

    if (response) {
      setRating(index);
    }
  };

  return (
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
        />
      ))}
    </div>
  );
}
