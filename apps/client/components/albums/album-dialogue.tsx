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
import RatingStars from "./rating-stars";
import { AddToList } from "./add-to-list";
import { useUser } from "@/utils/providers/UserProvider";
import { useEffect, useState } from "react";
import { isAlbumInToListen, removeAlbum } from "@/utils/lists.utils";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import { slugify } from "@/utils/global.utils";

interface AlbumDialogueProps {
  album: Album;
  setAlbums: (albums: Album[]) => void;
  albums: Album[];
}

export function AlbumDialogue({
  album,
  setAlbums,
  albums,
}: AlbumDialogueProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const params = useParams();

  const [showToListen, setShowToListen] = useState(false);

  useEffect(() => {
    const getBooleans = async () => {
      const toListen = await isAlbumInToListen(user, album);

      setShowToListen(toListen);
    };

    getBooleans();
  }, [user, album]);

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
        <AlbumCard album={album} />
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
              <RatingStars rating={album.overallRating} centered={false} />
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
