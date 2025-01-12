// TYPES.
import { User } from "@/types";

// COMPONENTS.
import { Button } from "../ui/button";
import { useUser } from "@/utils/providers/UserProvider";
import { useToast } from "@/hooks/use-toast";
import { unfollowUser } from "@/api/user.api";

export function RemoveFollowerButton({
  user,
  setCurrentlyFollowing,
}: {
  user: User | null;
  setCurrentlyFollowing: (currentlyFollowing: boolean) => void;
}) {
  const { user: currentUser } = useUser();
  const { toast } = useToast();

  const handleRemoveFollower = async () => {
    if (!user?._id || !currentUser?._id) {
      toast({
        title: "Could not remove user as follower",
        description: "User id does not exist",
      });
      return;
    }

    const unfollow = await unfollowUser(currentUser?._id, user._id);
    setCurrentlyFollowing(false);

    if (!unfollow) {
      toast({
        title: "Could not remove user as follower",
      });
      return;
    }
  };

  return <Button onClick={handleRemoveFollower}>Remove Follower</Button>;
}
