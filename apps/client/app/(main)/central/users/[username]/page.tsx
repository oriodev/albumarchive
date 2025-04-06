"use client";

import { getUserByUsername } from "@/apis/user.api";
import { FollowButton } from "@/components/buttons/follow-button";
import { RemoveFollowerButton } from "@/components/buttons/remove-follower-button";
// COMPONENTS.
import UserHeader from "@/components/containers/userheader";
import { UserProfileTabs } from "@/components/containers/userprofiletabs";
import { FallbackProfile } from "@/components/loadingstates/fallback-profile";

// TYPES.
import { User } from "@/types";

// HOOKS.
import { useUser } from "@/utils/providers/UserProvider";
import { checkIfFollowing } from "@/utils/user.utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  // HOOKS
  const { user: currentUser } = useUser();
  const router = useRouter();

  //   STATE.
  const [user, setUser] = useState<User | null>(null);

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
  useEffect(
    function fetchUser() {
      const subFetchUser = async () => {
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

      subFetchUser();
    },
    [params, router, currentUser],
  );

  useEffect(
    function getIsFollowing() {
      if (user && currentUser) {
        // CURRENT USER FOLLOWS USER.
        const currentUserFollowsUser = checkIfFollowing(currentUser?._id, user);
        setCurrentUserIsFollowingUser(currentUserFollowsUser);

        // USER FOLLOWS CURRENT USER.
        const userFollowsCurrentUser = checkIfFollowing(user?._id, currentUser);
        setUserIsFollowingCurrentUser(userFollowsCurrentUser);
      }
    },
    [user, currentUser],
  );

  return (
    <>
      {user ? (
        <div className="flex flex-col gap-7 p-7">
          <UserHeader user={user}>
            <div className="flex gap-2">
              <FollowButton user={user} />
              {userIsFollowingCurrentUser && (
                <RemoveFollowerButton
                  user={user}
                  setCurrentlyFollowing={setUserIsFollowingCurrentUser}
                />
              )}
            </div>
          </UserHeader>
          {(!user?.private ||
            (user?.private && currentUserIsFollowingUser)) && (
            <UserProfileTabs user={user} />
          )}
        </div>
      ) : (
        <FallbackProfile />
      )}
    </>
  );
}
