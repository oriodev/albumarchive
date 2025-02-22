import { Album } from "@/types";

export default function GenreDisplay({ album }: { album: Album }) {
  return (
    <div className="flex flex-wrap gap-3 text-xl items-center">
      <p className="text-lg text-gray-200">Genres</p>
      <div className="flex flex-wrap gap-2">
        {album &&
          album.genre.map((genre: string) => (
            <p key={genre} className="underline">
              {genre}
            </p>
          ))}
      </div>
    </div>
  );
}
