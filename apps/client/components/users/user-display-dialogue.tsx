"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UserDisplayCard from "./user-display-card";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { FollowButton } from "./follow-button";
import { User } from "@/types";
// import Image from "next/image";

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
        <UserDisplayCard user={user} />
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
