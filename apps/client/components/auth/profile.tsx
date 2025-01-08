"use client";

// HOOKS.
import { useUser } from "@/utils/providers/UserProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// COMPONENTS.
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { FollowPreview } from "../users/follow-preview";

// API CALLS.
import { getUsersBatch } from "@/api/user.api";
import { getUsernameInitial } from "@/utils/user.utils";
import { FallbackProfile } from "../users/fallback-profile";

export function Profile() {
  const { user } = useUser();
  const router = useRouter();

  const [profileData, setProfileData] = useState(user);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setProfileData(user);

      const setFollowData = async () => {
        const followerData = await getUsersBatch(user.followers || []);
        setFollowers(followerData);

        const followingData = await getUsersBatch(user.following || []);
        setFollowing(followingData);
        setLoading(false);
      };

      setFollowData();
    }
  }, [user]);

  // SET INITIAL FOR PROFILE PIC FALLBACK
  const initial = getUsernameInitial(profileData);

  const DisplayProfile = () => {
    return (
      <div className="flex flex-col items-center">
        <div className="flex flex-col gap-5 w-1/3">
          {/* TOP SECTION */}
          <div className="flex items-center gap-3">
            {/* PROFILE PIC */}
            <div>
              <Avatar className="w-16 h-16 text-3xl">
                <AvatarImage src="/" />
                <AvatarFallback>{initial}</AvatarFallback>
              </Avatar>
            </div>

            {/* NAME AND EMAIL */}
            <div>
              <p className="text-3xl font-bold">{profileData?.username}</p>
              <p>{profileData?.email}</p>
            </div>
          </div>

          {/* BIO SECTION */}
          <div className="">
            <p className="text-2xl">Description</p>
            <p>{profileData?.description || "no description"}</p>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => router.push("/central/profile/editing")}>
              Edit Profile
            </Button>
          </div>
          <FollowPreview title="following" users={following} />
          <FollowPreview title="followers" users={followers} />
        </div>
      </div>
    );
  };

  return <div>{loading ? <FallbackProfile /> : <DisplayProfile />}</div>;
}
