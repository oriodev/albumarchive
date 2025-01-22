import { Skeleton } from "../ui/skeleton";

export function FallbackAlbumPage() {
  return (
    <div className="flex p-10 space-x-4">
      <Skeleton className="h-[400px] w-[400px] rounded-large" />
      <div className="space-y-2">
        <Skeleton className="h-10 w-[500px]" />
        <Skeleton className="h-7 w-[200px]" />
      </div>
    </div>
  );
}
