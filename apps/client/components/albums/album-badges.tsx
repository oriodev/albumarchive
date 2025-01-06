import { Album } from "@/types";
import { Badge } from "../ui/badge";
import { isAlbumInListened, isAlbumInToListen } from "@/utils/lists.utils";
import { useEffect, useState } from "react";
import { useUser } from "@/utils/providers/UserProvider";

interface AlbumBadgesProps {
  album: Album;
}

export function AlbumBadges({ album }: AlbumBadgesProps) {
  const { user } = useUser();

  const [showListened, setShowListened] = useState(false);
  const [showToListen, setShowToListen] = useState(false);

  useEffect(() => {
    const getBooleans = async () => {
      const listened = await isAlbumInListened(user, album);
      const toListen = await isAlbumInToListen(user, album);

      setShowListened(listened);
      setShowToListen(toListen);
    };

    getBooleans();
  }, [user, album]);

  return (
    <div className="flex gap-2">
      {showListened && (
        <Badge className="bg-emerald-800 text-white hover:bg-emerald-700 hover:text-white">
          Listened
        </Badge>
      )}
      {showToListen && (
        <Badge className="bg-cyan-800 text-white hover:bg-cyan-700 hover:text-white">
          To Listen
        </Badge>
      )}
    </div>
  );
}
