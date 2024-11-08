import { getAlbumsFromDiscogs } from "@/api/discogs.api";
import { Album } from "@/types";

export default async function Page() {
  const data = await getAlbumsFromDiscogs("owl city");

  const albums = data.map((album: Album) => (
    <div key={album.title} className="pb-5">
      <p>title: {album.title}</p>
      <p>artist: {album.artist}</p>
      <p>genre: {album.genre}</p>
      <p>rating: {album.overallRating}</p>
    </div>
  ));

  return <div>{albums}</div>;
}
