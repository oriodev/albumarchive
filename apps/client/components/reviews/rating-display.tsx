import { RatingsCount } from "@/types";
import { Progress } from "../ui/progress";

export function RatingDisplay({ ratings }: { ratings: RatingsCount }) {
  const ratingPercentages = {
    1: (ratings[1] / ratings.total) * 100,
    2: (ratings[2] / ratings.total) * 100,
    3: (ratings[3] / ratings.total) * 100,
    4: (ratings[4] / ratings.total) * 100,
    5: (ratings[5] / ratings.total) * 100,
  };

  return (
    <div className="lg:w-1/3 w-1/2">
      {Object.entries(ratingPercentages).map(([rating, percentage]) => {
        return (
          <div key={rating} className="flex w-full gap-5 items-center">
            <p className="flex-shrink-0">{rating} stars</p>
            <Progress value={percentage} />
          </div>
        );
      })}
    </div>
  );
}
