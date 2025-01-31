"use client";

// HOOKS.
import { useUser } from "@/utils/providers/UserProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// COMPONENTS.
import { Button } from "../ui/button";
import { FollowPreview } from "../users/follow-preview";

// API CALLS.
import { getUsersBatch } from "@/api/user.api";
import { FallbackProfile } from "../users/fallback-profile";
import { Badge } from "../ui/badge";
import ProfileImage from "../users/profile-image";

export function Profile() {
  const { user } = useUser();
  const router = useRouter();

  const [profileData, setProfileData] = useState(user);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFollowingMoreBtn, setShowFollowingMoreBtn] = useState(true);
  const [showFollowersMoreBtn, setShowFollowersMoreBtn] = useState(true);

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

  const DisplayProfile = () => {
    return (
      <div className="flex flex-col items-center">
        <div className="flex flex-col gap-5 w-1/3 md:w-1/2">
          {/* TOP SECTION */}
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex items-center gap-3">
              {/* PROFILE PIC */}
              {profileData && <ProfileImage user={profileData} />}

              {/* NAME AND EMAIL */}
              <div>
                <p className="text-3xl font-bold">{profileData?.username}</p>
                <p>{profileData?.email}</p>
              </div>
            </div>

            <Badge className="text-md">
              {user?.private ? "Private" : "Public"}
            </Badge>
          </div>

          {/* BIO SECTION */}
          <div className="">
            <p className="text-2xl">Description</p>
            <p>{profileData?.description || "no description"}</p>
          </div>

          <div className="flex lg:justify-end">
            <Button onClick={() => router.push("/central/profile/editing")}>
              Edit Profile
            </Button>
          </div>
          <FollowPreview
            title="following"
            users={following}
            showMoreBtn={showFollowingMoreBtn}
            setShowMoreBtn={setShowFollowingMoreBtn}
          />
          <FollowPreview
            title="followers"
            users={followers}
            showMoreBtn={showFollowersMoreBtn}
            setShowMoreBtn={setShowFollowersMoreBtn}
          />
        </div>
      </div>
    );
  };

  return <div>{loading ? <FallbackProfile /> : <DisplayProfile />}</div>;
}
