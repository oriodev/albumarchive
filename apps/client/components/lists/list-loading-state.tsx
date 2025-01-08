import { Skeleton } from "../ui/skeleton";

export function ListLoadingState() {
  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[250px]" />
      </div>

      <Skeleton className="h-[350px] w-[350px] rounded-xl" />
    </div>
  );
}
