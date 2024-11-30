import { Album } from "@/types";

export function AlbumCard(album: Album) {
  return (
    <div>
      <p>{album.title}</p>
    </div>
  );
}
