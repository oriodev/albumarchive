import { Star, StarHalf, StarOff } from "lucide-react";

export default function RatingStars({
  rating,
  centered,
}: {
  rating: number;
  centered: boolean;
}) {
  let finalRating: number = 0;
  let half: boolean = false;

  if (rating) {
    const splitNumber = rating.toString().split(".");
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
    <Star key={index} />
  ));

  if (half) {
    stars.push(<StarHalf key={"half"} />);
  }

  return (
    <div
      className={`flex ${centered ? "justify-center" : "justify-left"} gap-5`}
    >
      {rating === null && <StarOff />}
      {stars}
    </div>
  );
}
