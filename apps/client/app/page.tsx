import { getAlbumsFromDiscogs } from "@/api/discogs.api";
import { Album } from "@/types";

export default async function Page() {
  const data = await getAlbumsFromDiscogs("troye");

  const albums = data.map((album: Album) => (
    <div key={album.title} className="pb-5">
      <p>{album.title}</p>
      <p>{album.artist}</p>
      <p>{album.genre}</p>
      <p>{album.overallRating}</p>
    </div>
  ));

  return <div>{albums}</div>;
}
