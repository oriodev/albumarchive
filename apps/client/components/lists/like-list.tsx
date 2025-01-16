// TYPES.
import { Likes, List } from "@/types";

// ICONS.
import { Heart } from "lucide-react";
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";
import {
  createLike,
  deleteLike,
  getLike,
  getTotalLikes,
} from "@/api/likes.api";
import { useUser } from "@/utils/providers/UserProvider";

export function LikeList({
  list,
  clickable,
}: {
  list: List;
  clickable: boolean;
}) {
  // UPDATE IN USER PROVIDER

  // HOOKS.
  const { user } = useUser();

  // STATES.
  const [liked, setLiked] = useState(false);
  const [likeId, setLikeId] = useState("");
  const [totalLikes, setTotalLikes] = useState(0);

  useEffect(() => {
    const fetchLiked = async () => {
      if (!user?._id || !list._id) return null;

      const fetchedLiked = await getLike(user._id, list._id);

      if (fetchedLiked && fetchedLiked._id) {
        setLiked(true);
        setLikeId(fetchedLiked._id);
      }
    };

    fetchLiked();
  }, [list, user]);

  useEffect(() => {
    const fetchTotalLikes = async () => {
      if (!list._id) return null;

      const fetchedTotalLikes = await getTotalLikes(list._id);

      if (fetchedTotalLikes) {
        setTotalLikes(fetchedTotalLikes);
      }
    };

    fetchTotalLikes();
  });

  const like = async () => {
    if (!clickable) return null;

    if (!liked && user) {
      if (!user._id || !list._id) return null;

      const likePayload: Likes = {
        user: user._id,
        list: list._id,
      };

      const createdLike = await createLike(likePayload);
      if (createdLike && createdLike._id) {
        setLiked(true);
        setLikeId(createdLike._id);
        setTotalLikes(totalLikes + 1);
      }
    } else {
      if (!user || !user._id || !list._id) return null;

      const deletedLike = await deleteLike(likeId);
      if (deletedLike) {
        setLiked(false);
        setLikeId("");
        setTotalLikes(totalLikes - 1);
      }
    }
  };

  return (
    <div onClick={like}>
      <Badge
        className={`flex flex-wrap gap-2 items-center bg-rose-800 text-white hover:bg-rose-900 ${clickable ? "hover:cursor-pointer" : "hover:default"}`}
      >
        <Heart size={22} fill={liked ? "white" : "none"} />
        <p className="text-xl">{totalLikes}</p>
      </Badge>
    </div>
  );
}
