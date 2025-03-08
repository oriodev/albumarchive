// COMPONENTS.
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Button } from "../ui/button";

// TYPES.
import { Album, ImageType } from "@/types";

// API CALLS.
import { AddToList } from "../dropdowns/add-to-list-dropdown";
import { addAlbumToList } from "@/api/list.api";

// UTILS.
import { useUser } from "@/utils/providers/UserProvider";
import {
  getLocalDatabaseAlbum,
  isAlbumInToListen,
  removeAlbum,
} from "@/utils/lists.utils";
import { slugify } from "@/utils/global.utils";
import { makeUpdatedAlbumInListUser } from "@/utils/user.utils";

// HOOKS.
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import ImageCard from "../cards/imagecard";
// import ViewStarRating from "../ratings/viewStarRating";
import GenreDisplay from "../containers/genre-display";
import { ListCard } from "../cards/listcard";
// import { getAlbumRating } from "@/api/reviews.api";

interface AlbumDialogueProps {
  album: Album;
  setAlbums?: (albums: Album[]) => void;
  albums?: Album[];
  layoutType: string;
  local: boolean;
}

export function AlbumDialogue({
  album,
  setAlbums,
  albums,
  layoutType,
}: AlbumDialogueProps) {
  // HOOKS.
  const { user, updateUserInfo } = useUser();
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();

  // STATES.
  const [showToListen, setShowToListen] = useState(false);
  // const [albumRating, setAlbumRating] = useState(0);

  useEffect(() => {
    const getBooleans = async () => {
      const toListen = await isAlbumInToListen(user, album);

      setShowToListen(toListen);
    };

    const fetchAlbumRating = async () => {
      if (!album._id) {
        return;
      }

      // const fetchedAlbumRating = await getAlbumRating(album._id);
      // if (fetchedAlbumRating) {
      //   setAlbumRating(fetchedAlbumRating);
      // }
    };

    getBooleans();
    fetchAlbumRating();
  }, [user, album]);

  const handleHaveListened = async () => {
    if (!user?.lists) return;
    // remove it from to listen

    const toListenList = user?.lists.filter(
      (list) => list.name === "To Listen",
    )[0];
    const listenedList = user?.lists.filter(
      (list) => list.name === "Listened",
    )[0];
    const slug = Array.isArray(params.slug)
      ? params.slug[0]
      : params.slug || "";

    const updateState = slugify(toListenList.name) === slug;

    if (!toListenList._id || !album._id || !listenedList._id) return;

    await removeAlbum(
      toListenList._id,
      album._id,
      updateState,
      albums,
      setAlbums,
    );
    await addAlbumToList(listenedList._id, album._id);

    // UPDATE IN USER PROVIDER.
    const deletionUpdate = makeUpdatedAlbumInListUser(
      user,
      toListenList._id,
      album._id,
    );

    if (!deletionUpdate) return;

    const additionUpdate = makeUpdatedAlbumInListUser(
      deletionUpdate,
      listenedList._id,
      album._id,
    );

    if (!additionUpdate) return;

    updateUserInfo(additionUpdate);

    toast({
      title: "Moved To Listened",
      description: "Congrats on listening to a new album <3",
    });
  };

  const handleFullAlbum = async () => {
    const localAlbum = await getLocalDatabaseAlbum(album);
    if (!localAlbum) return;
    router.push(`/central/albums/${localAlbum._id}`);
  };

  return (
    <Dialog>
      <DialogTrigger className="w-full">
        {layoutType === "Grid" ? (
          <ImageCard
            image={album.coverImage}
            title={album.title}
            description={album.artist}
            imageType={ImageType.album}
          />
        ) : (
          <ListCard
            image={album.coverImage}
            title={album.title}
            description={album.artist}
            imageType={ImageType.album}
          />
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <VisuallyHidden.Root>
            <DialogTitle>{album.title}</DialogTitle>
          </VisuallyHidden.Root>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex gap-7">
          {/* LEFT SIDE */}
          <div>
            <Image
              alt={album.title}
              src={album.coverImage}
              width={300}
              height={300}
            />
          </div>

          {/* RIGHT SIDE */}
          <div className="text-l flex flex-col gap-4 w-1/3">
            <div>
              <p className="font-bold text-3xl">{album.title}</p>
              <p className="text-xl">{album.artist}</p>
            </div>

            <div>
              <Badge className="text-lg bg-rose-900 text-white hover:bg-rose-800">
                Released {album?.releaseDate || "Unknown"}
              </Badge>
            </div>

            {/* {local && (
              <>
                <div>
                  <ViewStarRating rating={albumRating} centered={false} />
                </div>
              </>
            )} */}

            <GenreDisplay album={album} />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-between gap-2 pt-5">
          <AddToList album={album} setAlbums={setAlbums} albums={albums} />
          {showToListen && (
            <Button
              className="bg-cyan-800 text-white hover:bg-cyan-700 hover:text-white"
              onClick={handleHaveListened}
            >
              Finished Listening
            </Button>
          )}
          <Button
            className="w-full"
            onClick={handleFullAlbum}
            data-cy="seeFullAlbumBtn"
          >
            See Full Album
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
