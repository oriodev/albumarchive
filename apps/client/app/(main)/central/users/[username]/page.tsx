"use client";

// COMPONENTS.
import { FollowPreview } from "../../../../../components/users/follow-preview";

import { useEffect, useState } from "react";
// import { useUser } from "@/utils/providers/UserProvider";
import { getUserByUsername, getUsersBatch } from "@/api/user.api";
import { User } from "@/types";
import { checkIfFollowing } from "@/utils/user.utils";
import { FallbackProfile } from "@/components/users/fallback-profile";
import { ProfileListDisplay } from "@/components/lists/profile-list-display";
import { useRouter } from "next/navigation";
import { FollowButton } from "@/components/users/follow-button";
import { RemoveFollowerButton } from "@/components/users/remove-follower-button";
import { useUser } from "@/utils/providers/UserProvider";
import ProfileImage from "@/components/users/profile-image";

export default function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  // HOOKS.
  const { user: currentUser } = useUser();
  const router = useRouter();

  // USESTATES.
  const [user, setUser] = useState<User | null>(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  // CURRENT USER FOLLOWS USER.
  const currentUserFollowsUser = checkIfFollowing(currentUser?._id, user);
  const [currentUserIsFollowingUser, setCurrentUserIsFollowingUser] = useState(
    currentUserFollowsUser,
  );

  // USER FOLLOWS CURRENT USER.
  const userFollowsCurrentUser = checkIfFollowing(user?._id, currentUser);
  const [userIsFollowingCurrentUser, setUserIsFollowingCurrentUser] = useState(
    userFollowsCurrentUser,
  );

  // FETCH USER.
  useEffect(() => {
    const fetchUser = async () => {
      const slug = (await params).username;

      const fetchedUser = await getUserByUsername(slug.toLowerCase());

      if (fetchedUser?.username === currentUser?.username) {
        router.push("/central/profile");
      }

      if (!fetchedUser) {
        router.replace("/central/not-found");
      }

      setUser(fetchedUser);
    };

    fetchUser();
  }, [params, router, currentUser]);

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

  useEffect(() => {
    if (user && currentUser) {
      // CURRENT USER FOLLOWS USER.
      const currentUserFollowsUser = checkIfFollowing(currentUser?._id, user);
      setCurrentUserIsFollowingUser(currentUserFollowsUser);

      // USER FOLLOWS CURRENT USER.
      const userFollowsCurrentUser = checkIfFollowing(user?._id, currentUser);
      setUserIsFollowingCurrentUser(userFollowsCurrentUser);
    }
  }, [user, currentUser]);

  console.log("user: ", user);

  return (
    <>
      {loading ? (
        <FallbackProfile />
      ) : (
        // FULL COMPONENT
        <div className="flex flex-col items-center">
          <div className="flex flex-col gap-4 w-1/3 md:w-1/2">
            {/* TOP SECTION */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-3 items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* PROFILE PIC */}
                  {user && <ProfileImage user={user} />}

                  {/* NAME AND EMAIL */}
                  <div>
                    <p className="text-3xl font-bold">{user?.username}</p>
                    <p>{user?.email}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <FollowButton user={user} />
                  {userIsFollowingCurrentUser && (
                    <RemoveFollowerButton
                      user={user}
                      setCurrentlyFollowing={setUserIsFollowingCurrentUser}
                    />
                  )}
                </div>
              </div>

              {/* BIO SECTION */}
              <div>
                <p className="text-2xl">Description</p>
                <p>{user?.description || "no description"}</p>
              </div>
            </div>

            {/* BOTTOM SECTION */}

            {(!user?.private ||
              (user?.private && currentUserIsFollowingUser)) && (
              <div className="flex flex-col gap-5">
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
            )}
          </div>
        </div>
      )}
    </>
  );
}
