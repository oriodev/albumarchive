// HOOKS.
import { useContext, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/utils/providers/UserProvider";

// COMPONENTS.
import { Button } from "../ui/button";
import { checkIfFollowing } from "@/utils/user.utils";

// TYPES.
import { NotificationType, User } from "@/types";
import { followUser, unfollowUser } from "@/api/user.api";
import { sendNotification } from "@/utils/notifications.utils";
import { WebsocketContext } from "@/utils/providers/WebsocketProvider";

export function FollowButton({ user }: { user: User | null }) {
  // HOOKS.
  const { toast } = useToast();
  const { user: currentUser } = useUser();
  const socket = useContext(WebsocketContext);

  // SET USER PRIVACY.
  const isPrivate = user?.private || false;

  // SET INITIAL FOLLOW STATUS.
  const followStatus = checkIfFollowing(currentUser?._id, user);
  const [currentlyFollowing, setCurrentlyFollowing] = useState(followStatus);

  // FOLLOW USER.
  const handleFollow = async () => {
    if (!user || !currentUser) {
      toast({
        title: "Could not follow user",
        description: "User id does not exist",
      });
      return;
    }

    const follow = await followUser(user._id, currentUser?._id);

    if (!follow) {
      toast({
        title: "Could not follow user",
        description: "Follow user failed",
      });
      return;
    }

    setCurrentlyFollowing(true);
  };

  // UNFOLLOW USER.
  const handleUnfollow = async () => {
    if (!user || !currentUser) {
      toast({
        title: "Could not unfollow user",
        description: "User id does not exist",
      });
      return;
    }

    const unfollow = await unfollowUser(user._id, currentUser?._id);

    if (!unfollow) {
      toast({
        title: "Could not unfollow user",
        description: "Unfollow user failed",
      });
      return;
    }

    setCurrentlyFollowing(false);
  };

  // REQUEST FOLLOW.
  const handleRequestFollow = async () => {
    if (!currentUser?._id || !user) {
      toast({
        title: "Request failed.",
        description: "No user id.",
      });
      return;
    }

    const followRequestNotificationPayload = {
      sender: currentUser._id,
      receiver: user._id,
      type: NotificationType.FRIENDREQUEST,
    };

    const sendFollowRequest = await sendNotification(
      socket,
      followRequestNotificationPayload,
    );

    if (!sendFollowRequest) {
      toast({
        title: "Request failed.",
        description: "Could not send request.",
      });
    }

    toast({
      title: "Sent follow request.",
    });
    return;
  };

  return (
    <div>
      {isPrivate ? (
        currentlyFollowing ? (
          <Button onClick={handleUnfollow}>Unfollow</Button>
        ) : (
          <Button onClick={handleRequestFollow}>Request Follow</Button>
        )
      ) : currentlyFollowing ? (
        <Button onClick={handleUnfollow}>Unfollow</Button>
      ) : (
        <Button onClick={handleFollow}>Follow</Button>
      )}
    </div>
  );
}
