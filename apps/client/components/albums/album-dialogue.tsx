import { Album } from "@/types";
import Image from "next/image";

import { AlbumCard } from "@/components/albums/album-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Button } from "../ui/button";
import { AddToList } from "./add-to-list";
import { useUser } from "@/utils/providers/UserProvider";
import { useEffect, useState } from "react";
import { isAlbumInToListen, removeAlbum } from "@/utils/lists.utils";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import { slugify } from "@/utils/global.utils";
import StarRating from "./star-rating";
import { getAlbumRating } from "@/api/ratings.api";
import { AlbumListCard } from "./album-list-card";

interface AlbumDialogueProps {
  album: Album;
  setAlbums: (albums: Album[]) => void;
  albums: Album[];
  layoutType: string;
}

export function AlbumDialogue({
  album,
  setAlbums,
  albums,
  layoutType,
}: AlbumDialogueProps) {
  // HOOKS.
  const { user } = useUser();
  const { toast } = useToast();
  const params = useParams();

  // STATES.
  const [showToListen, setShowToListen] = useState(false);
  const [albumRating, setAlbumRating] = useState(0);

  useEffect(() => {
    const getBooleans = async () => {
      const toListen = await isAlbumInToListen(user, album);

      setShowToListen(toListen);
    };

    const fetchAlbumRating = async () => {
      if (!album._id) {
        return;
      }

      const fetchedAlbumRating = await getAlbumRating(album._id);
      if (fetchedAlbumRating) {
        setAlbumRating(fetchedAlbumRating);
      }
    };

    getBooleans();
    fetchAlbumRating();
  }, [user, album, setAlbumRating]);

  const handleHaveListened = () => {
    if (!user?.lists) {
      throw new Error("no user lists");
    }

    const toListen = user?.lists.filter((list) => list.name === "To Listen")[0];
    const toListenId = toListen._id;

    if (!toListenId) {
      throw new Error("no to listen id");
    }

    if (!album._id) {
      throw new Error("no album id");
    }

    const slug = Array.isArray(params.slug)
      ? params.slug[0]
      : params.slug || "";
    const updateState = slugify(toListen.name) === slug;

    removeAlbum(toListenId, album._id, albums, setAlbums, updateState);

    toast({
      title: "Moved To Listened",
      description: "Congrats on listening to a new album <3",
    });
  };

  return (
    <Dialog>
      <DialogTrigger className="w-full">
        {layoutType === "Grid" ? (
          <AlbumCard album={album} />
        ) : (
          <AlbumListCard album={album} />
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <VisuallyHidden.Root>
            <DialogTitle>{album.title}</DialogTitle>
          </VisuallyHidden.Root>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex gap-5">
          {/* LEFT SIDE */}
          <div>
            <Image
              alt={album.title}
              src={album.coverImage}
              width={400}
              height={400}
            />
          </div>

          {/* RIGHT SIDE */}
          <div className="text-l flex flex-col gap-2 w-1/3">
            <div>
              <p>Title</p>
              <p className="font-bold">{album.title}</p>
            </div>

            <div>
              <p>Artist</p>
              <p className="font-bold">{album.artist}</p>
            </div>

            <div>
              <p>Genre</p>
              <p className="font-bold">{album.genre.join(", ")}</p>
            </div>

            <div>
              <p>Release Year</p>
              <p className="font-bold">{album.releaseDate || "Unknown"}</p>
            </div>

            <div>
              <p>Overall Rating</p>
              <p className="font-bold">{albumRating}</p>
            </div>

            <div>
              <p>Your Rating</p>
              <StarRating album={album} />
            </div>

            {/* <div>
              <p>Tags</p>
              <AlbumBadges album={album} />
            </div> */}
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
          <Button className="w-full">Reviews</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
