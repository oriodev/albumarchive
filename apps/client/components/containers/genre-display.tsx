import { Album } from "@/types";

export default function GenreDisplay({ album }: { album: Album }) {
  return (
    <div className="flex flex-wrap gap-3 text-xl items-center justify-center md:justify-start">
      <p className="text-lg text-gray-200">Genres</p>
      <div className="flex flex-wrap gap-2">
        {album &&
          album.genre.map((genre: string) => <p key={genre}>{genre}</p>)}
      </div>
    </div>
  );
}
