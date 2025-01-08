"use client";

// COMPONENTS.
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FollowPreview } from "../../../../../components/users/follow-preview";

import { useEffect, useState } from "react";
// import { useUser } from "@/utils/providers/UserProvider";
import { getUserByUsername, getUsersBatch } from "@/api/user.api";
import { User } from "@/types";
import { getUsernameInitial } from "@/utils/user.utils";
import { FallbackProfile } from "@/components/users/fallback-profile";
import { ProfileListDisplay } from "@/components/lists/profile-list-display";
import { useRouter } from "next/navigation";

export default function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  // TODO: USE CURRENTUSER TO ADD FOLLOW/UNFOLLOW BUTTONS.
  //   const { user: currentUser } = useUser();

  // USESTATES.
  const [user, setUser] = useState<User | null>(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  // HOOKS.
  const router = useRouter();

  // FETCH USER.
  useEffect(() => {
    const fetchUser = async () => {
      const slug = (await params).username;

      const fetchedUser = await getUserByUsername(slug.toLowerCase());

      if (!fetchedUser) {
        router.replace("/central/not-found");
      }

      setUser(fetchedUser);
    };

    fetchUser();
  }, [params, router]);

  // SET THE FOLLOW DATA.
  useEffect(() => {
    if (user) {
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

  const initial = getUsernameInitial(user);

  return (
    <>
      {loading ? (
        <FallbackProfile />
      ) : (
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
                <p className="text-3xl font-bold">{user?.username}</p>
                <p>{user?.email}</p>
              </div>
            </div>

            {/* BIO SECTION */}
            <div className="">
              <p className="text-2xl">Description</p>
              <p>{user?.description || "no description"}</p>
            </div>

            {/* LIST SECTION */}
            <ProfileListDisplay
              title="Lists"
              lists={user?.lists || []}
              username={user?.username || ""}
            />

            {/* FOLLOW SECTION */}
            <FollowPreview
              title="Following"
              users={following}
              disableSeeAll={true}
            />
            <FollowPreview
              title="Followers"
              users={followers}
              disableSeeAll={true}
            />
          </div>
        </div>
      )}
    </>
  );
}
