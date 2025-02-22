"use client";

// HOOKS.
import { useUser } from "@/utils/providers/UserProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// API CALLS.
import { getUsersBatch } from "@/api/user.api";

// components.
import ProfileImage from "@/components/users/profile-image";
import { Button } from "@/components/ui/button";
import { FollowPreview } from "@/components/users/follow-preview";
import { FallbackProfile } from "@/components/users/fallback-profile";
import { Badge } from "@/components/ui/badge";

export default function Page() {
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

  const DisplayProfile = () => {
    return (
      <div className="flex flex-col items-center" role="main">
        <div
          className="flex flex-col gap-5 w-1/3 md:w-1/2"
          aria-labelledby="profile-header"
        >
          {/* TOP SECTION */}
          <header
            className="flex flex-wrap gap-3 items-center justify-between"
            id="profile-header"
          >
            <div className="flex items-center gap-3">
              {/* PROFILE PIC */}
              {profileData && <ProfileImage user={profileData} size={16} />}

              {/* NAME AND EMAIL */}
              <div>
                <p className="text-3xl font-bold" aria-live="polite">
                  {profileData?.username}
                </p>
                <p>{profileData?.email}</p>
              </div>
            </div>

            <Badge className="text-md" aria-label="Profile visibility">
              {user?.private ? "Private" : "Public"}
            </Badge>
          </header>

          {/* BIO SECTION */}
          <section aria-labelledby="bio-section">
            <h2 id="bio-section" className="text-2xl">
              Description
            </h2>
            <p>{profileData?.description || "No description available."}</p>
          </section>

          <div className="flex lg:justify-end">
            <Button
              onClick={() => router.push("/central/profile/editing")}
              aria-label="Edit Profile"
            >
              Edit Profile
            </Button>
          </div>

          <FollowPreview
            title="Following"
            users={following}
            aria-label="Users you are following"
          />
          <FollowPreview
            title="Followers"
            users={followers}
            aria-label="Users following you"
          />
        </div>
      </div>
    );
  };

  return <div>{loading ? <FallbackProfile /> : <DisplayProfile />}</div>;
}
