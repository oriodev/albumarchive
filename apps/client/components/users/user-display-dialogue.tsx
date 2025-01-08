"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import UserDisplayCard from "./user-display-card";
import { User } from "@/types";
import { Button } from "../ui/button";
import { followUser, unfollowUser } from "@/api/user.api";
import { useEffect, useState } from "react";
import { checkIfFollowing } from "@/utils/user.utils";
import { useUser } from "@/utils/providers/UserProvider";
import { useRouter } from "next/navigation";
// import Image from "next/image";

interface UserDisplayDialogueProps {
  user: User;
}

export function UserDisplayDialogue({ user }: UserDisplayDialogueProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { user: currentUser } = useUser();

  const [currentlyFollowing, setCurrentlyFollowing] = useState(true);

  useEffect(() => {
    const getCurrentlyFollowing = async () => {
      if (!currentUser?._id) {
        setCurrentlyFollowing(false);
        return;
      }

      const followStatus = await checkIfFollowing(currentUser?._id, user);
      setCurrentlyFollowing(followStatus);
    };

    getCurrentlyFollowing();
  }, [currentUser?._id, user]);

  const viewProfile = !user.private;

  const handleFollow = async () => {
    if (!user._id) {
      toast({
        title: "Could not follow user",
        description: "User id does not exist",
      });
      return;
    }

    const follow = await followUser(user._id);

    if (!follow) {
      toast({
        title: "Could not follow user",
        description: "Follow user failed",
      });
      return;
    }

    setCurrentlyFollowing(true);
    toast({
      title: `Followed ${user.username}`,
    });
    return;
  };

  const handleUnfollow = async () => {
    if (!user._id) {
      toast({
        title: "Could not unfollow user",
        description: "User id does not exist",
      });
      return;
    }

    const unfollow = await unfollowUser(user._id);

    if (!unfollow) {
      toast({
        title: "Could not unfollow user",
        description: "Unfollow user failed",
      });
      return;
    }

    setCurrentlyFollowing(false);
    toast({
      title: `Unfollowed ${user.username}`,
    });
    return;
  };

  const handleRequestFollow = async () => {
    toast({
      title: "Request to follow not yet implemented",
      description: "Sorry",
    });
    return;
  };

  const ViewableProfile = () => {
    return (
      <div className="flex gap-2">
        <Button onClick={() => router.push(`/central/users/${user.username}`)}>
          Visit Profile
        </Button>

        {currentlyFollowing ? (
          <Button onClick={handleUnfollow}>Unfollow</Button>
        ) : (
          <Button onClick={handleFollow}>Follow</Button>
        )}
      </div>
    );
  };

  const UnviewableProfile = () => {
    return (
      <div className="flex gap-2">
        <Button onClick={() => router.push(`/central/users/${user.username}`)}>
          Visit Profile
        </Button>

        <Button onClick={handleRequestFollow}>Request Follow</Button>
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
        {viewProfile ? <ViewableProfile /> : <UnviewableProfile />}
      </DialogContent>
    </Dialog>
  );
}
