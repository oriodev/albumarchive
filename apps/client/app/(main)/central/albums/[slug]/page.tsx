"use client";

// API CALLS.
import { getAlbumById, getAlbumsByArtist } from "@/api/albums.api";
import { addAlbumToList } from "@/api/list.api";
import { getAlbumRating, getRatingsCount } from "@/api/ratings.api";

// COMPONENTS.
import { AddToList } from "@/components/albums/add-to-list";
import ViewStarRating from "@/components/albums/viewStarRating";
import StarRating from "@/components/albums/editStarRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// HOOKS.
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// TYPES.
import { Album, RatingsCount } from "@/types";

// UTILS.
import {
  getLocalDatabaseAlbum,
  isAlbumInListened,
  isAlbumInToListen,
} from "@/utils/lists.utils";
import { useUser } from "@/utils/providers/UserProvider";
import { makeUpdatedUser } from "@/utils/user.utils";
import { AlbumScrollDisplay } from "@/components/albums/album-scroll-display";
import { FallbackAlbumPage } from "@/components/albums/fallback-album-page";
import { AlbumRecDialogue } from "@/components/album recs/album-rec-dialogue";
import GenreDisplay from "@/components/albums/genre-display";

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // HOOKS.
  const router = useRouter();
  const { user, updateUserInfo } = useUser();
  const { toast } = useToast();

  // STATES.
  const [loading, setLoading] = useState<boolean>(true);
  const [album, setAlbum] = useState<Album | null>(null);
  const [albumRating, setAlbumRating] = useState(0);
  const [ratingsCount, setRatingsCount] = useState<RatingsCount | null>(null);
  const [showAddToListen, setShowAddToListen] = useState(false);
  const [albumsByArtist, setAlbumsByArtist] = useState<Album[] | null>(null);

  // FETCH USER.
  useEffect(() => {
    const fetchAlbum = async () => {
      const id = (await params).slug;

      const fetchedAlbum = await getAlbumById(id);

      if (!fetchedAlbum) {
        router.replace("/central/not-found");
      }

      setAlbum(fetchedAlbum);
    };

    fetchAlbum();
  }, [params, router]);

  // FETCH ALBUM RATING.
  useEffect(() => {
    const fetchAlbumRating = async () => {
      if (!album?._id) {
        return;
      }

      const fetchedAlbumRating = await getAlbumRating(album._id);
      if (fetchedAlbumRating) {
        setAlbumRating(fetchedAlbumRating);
      }
    };

    const fetchRatingCount = async () => {
      if (!album?._id) {
        return;
      }

      const fetchedRatingCount = await getRatingsCount(album._id);
      if (fetchedRatingCount) setRatingsCount(fetchedRatingCount);
    };

    const getShowToListen = async () => {
      if (!album || !user) return false;

      const toListen = await isAlbumInToListen(user, album);
      const listened = await isAlbumInListened(user, album);

      setShowAddToListen(!(toListen || listened));
    };

    const fetchAlbumsByArtist = async () => {
      if (!album) return;

      const artistName = album.artist;
      const fetchedAlbumsByArtist = await getAlbumsByArtist(artistName);

      const filteredArtists = fetchedAlbumsByArtist.filter(
        (fetchedAlbum: Album) => fetchedAlbum._id !== album._id,
      );

      if (filteredArtists.length === 0) {
        setLoading(false);
        return;
      }

      setAlbumsByArtist(filteredArtists.slice(0, 10));
      setLoading(false);
    };

    fetchAlbumRating();
    fetchRatingCount();
    getShowToListen();
    fetchAlbumsByArtist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [album, user]);

  const addToListen = async () => {
    if (!user || !album || !user.lists) return;

    // IS ALBUM IN LOCAL DATABASE?
    const albumFromLocal = await getLocalDatabaseAlbum(album);
    if (!albumFromLocal?._id) return;

    // GET THE TO LISTEN LIST.
    const toListen = user.lists.filter((list) => list.slug === "to-listen")[0];
    if (!toListen._id) return;

    // GATE LISTENED.
    const inListened = await isAlbumInListened(user, album);
    if (inListened) return;

    // ADD ALBUM TO TO LISTEN..
    await addAlbumToList(toListen._id, albumFromLocal._id);

    const updatedUser = makeUpdatedUser(
      user,
      toListen?._id,
      albumFromLocal._id,
    );

    if (!updatedUser) return;

    updateUserInfo(updatedUser);

    // SEND TOAST.
    toast({
      title: `Added ${albumFromLocal.title} to To Listen`,
    });
  };

  return (
    <>
      {!album && (
        <div>
          <p>no album found</p>
        </div>
      )}

      {!loading ? (
        <div className="p-5 flex flex-col gap-5">
          {/* TOP SECTION */}
          <div className="flex flex-wrap lg:flex-nowrap justify-center lg:justify-normal gap-5">
            {/* IMAGE */}
            <div>
              <Image
                alt={album?.title || "album cover image"}
                src={album?.coverImage || ""}
                width={400}
                height={400}
              />
            </div>

            {/* INFO SECTION */}
            <div className="flex flex-col justify-between">
              {/* INFO */}
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <p className="font-bold text-3xl">{album?.title}</p>
                  <p className="text-xl">{album?.artist}</p>
                </div>

                <div>
                  <Badge className="text-lg bg-rose-900 text-white hover:bg-rose-800">
                    Released {album?.releaseDate || "Unknown"}
                  </Badge>
                </div>

                <div>
                  <ViewStarRating
                    rating={albumRating}
                    ratingsCount={ratingsCount?.total}
                    centered={false}
                  />
                </div>

                {album && <GenreDisplay album={album} />}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap gap-2">
                {album && <AddToList album={album} />}
                {showAddToListen && (
                  <Button onClick={addToListen}>Want To Listen</Button>
                )}

                {album && <AlbumRecDialogue album={album} />}
              </div>
            </div>
          </div>

          {/* RATING AND REVIEWS */}
          <div className="flex flex-wrap lg:flex-nowrap gap-5 justify-center lg:justify-normal">
            {/* RATING */}
            <div className="gap-2 bg-zinc-900 rounded-lg p-5">
              <p className="text-xl font-bold">Rate This Album</p>
              {album && <StarRating album={album} />}
            </div>

            {/* REVIEWS. */}
            <div className="p-5 bg-zinc-900 rounded-lg w-full">
              <p className="text-xl font-bold">Reviews</p>
              <p>hello</p>
            </div>
          </div>

          {/* OTHER ALBUMS BY THIS ARTIST */}
          {albumsByArtist && (
            <div>
              <h3 className="text-2xl font-bold">More Albums By This Artist</h3>
              <AlbumScrollDisplay albums={albumsByArtist} />
            </div>
          )}
        </div>
      ) : (
        <FallbackAlbumPage />
      )}
    </>
  );
}
