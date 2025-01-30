import { Star, StarHalf, StarOff } from "lucide-react";

export default function ViewStarRating({
  rating,
  ratingsCount,
  centered,
}: {
  rating: number;
  ratingsCount?: number | undefined;
  centered: boolean;
}) {
  let finalRating: number = 0;
  let half: boolean = false;

  if (rating) {
    const splitNumber = rating.toFixed(1).split(".");
    const first = parseInt(splitNumber[0]);
    const second = parseInt(splitNumber[1]);

    if (!second) {
      finalRating = first;
    } else if (second <= 3) {
      finalRating = first;
    } else if (second >= 4 && second <= 7) {
      finalRating = first;
      half = true;
    } else if (second >= 8 && second <= 9) {
      finalRating = first + 1;
    }
  }

  const stars = Array.from({ length: finalRating }, (_, index) => (
    <Star
      size={40}
      key={index}
      strokeWidth={0}
      fill={"#fcd34d"}
      className={`transition-colors duration-200`}
    />
  ));

  if (half) {
    stars.push(
      <StarHalf
        size={40}
        key={"half"}
        strokeWidth={0}
        fill={"#fcd34d"}
        className={`transition-colors duration-200`}
      />,
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* STARS */}
      <div
        className={`flex ${centered ? "justify-center" : "justify-left"} gap-1`}
      >
        {rating === 0 && <StarOff />}
        {stars}
      </div>
      {ratingsCount && (
        <>
          <p className="text-3xl font-bold">{rating.toFixed(1)}</p>

          <div>
            <p className="text-md italic text-gray-200">
              ({ratingsCount} {ratingsCount === 1 ? "rating" : "ratings"})
            </p>
          </div>
        </>
      )}
    </div>
  );
}
