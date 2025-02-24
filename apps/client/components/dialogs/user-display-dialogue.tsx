"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { FollowButton } from "../buttons/follow-button";
import { ImageType, User } from "@/types";
import ImageCard from "../cards/imagecard";

interface UserDisplayDialogueProps {
  user: User;
}

export function UserDisplayDialogue({ user }: UserDisplayDialogueProps) {
  const router = useRouter();

  const Profile = () => {
    return (
      <div className="flex gap-2">
        <Button onClick={() => router.push(`/central/users/${user.username}`)}>
          Visit Profile
        </Button>

        <FollowButton user={user} />
      </div>
    );
  };

  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <ImageCard
          image={user.profileImg}
          title={user.username}
          imageType={ImageType.user}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user.username}</DialogTitle>
          <DialogDescription>{user.description}</DialogDescription>
        </DialogHeader>
        <Profile />
      </DialogContent>
    </Dialog>
  );
}
