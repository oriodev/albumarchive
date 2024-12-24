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

export function AlbumDialogue({ album }: { album: Album }) {
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
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-between gap-2 pt-5">
          <AddToList />
          <Button className="w-full">Reviews</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
