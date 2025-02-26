import { getAlbumById, getAlbumsByArtist } from "@/api/albums.api";
import { getAlbumRating, getRatingsCount } from "@/api/reviews.api";
import { getUser, getUserId } from "@/api/user.api";
import AlbumDetails from "@/components/containers/albumdetails";
import AlbumScrollDisplay from "@/components/containers/albumscrolldisplay";
import ReviewsContainer from "@/components/containers/reviewscontainer";
import { Album, RatingsCount } from "@/types";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

const fakeRatingsCount: RatingsCount = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  total: 0,
};

export default async function Page({ params }: Props) {
  // FETCH ALBUM.
  const id = (await params).slug;
  const album = await getAlbumById(id);
  if (!album) redirect("/central/albums");

  // FETCH USER.
  const userId = await getUserId();
  const user = await getUser(userId);
  if (!user) redirect("/central");

  // FETCH ALBUM OVERALL RATING.
  const albumRating: number = (await getAlbumRating(id)) || 0;

  // FETCH NUMBER OF ALBUM RATINGS.
  const ratingsCount: RatingsCount =
    (await getRatingsCount(id)) || fakeRatingsCount;

  // FETCH OTHER ALBUMS BY THIS ARTIST.
  const fetchedAlbumsByArtist: Album[] = await getAlbumsByArtist(album.artist);
  const albumsByArtist: Album[] = fetchedAlbumsByArtist
    .filter((a: Album) => a._id !== album._id)
    .slice(0, 10);

  return (
    <main>
      <AlbumDetails
        album={album}
        albumRating={albumRating}
        ratingsCount={ratingsCount}
      />
      <section className="hidden md:block pt-5">
        <h3 className="text-2xl font-bold">More Albums By This Artist</h3>
        <AlbumScrollDisplay albums={albumsByArtist} />
      </section>
      {/* REVIEWS. */}
      <ReviewsContainer album={album} user={user} ratingsCount={ratingsCount} />
    </main>
  );
}
