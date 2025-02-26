"use client";

import UserHeader from "@/components/containers/userheader";
import { UserProfileTabs } from "@/components/containers/userprofiletabs";
import { FallbackProfile } from "@/components/loadingstates/fallback-profile";
import { Button } from "@/components/ui/button";
import { useUser } from "@/utils/providers/UserProvider";
import { useRouter } from "next/navigation";

export default function Page() {
  const { user } = useUser();
  const router = useRouter();

  return (
    <>
      {user ? (
        <div className="flex flex-col gap-7 p-7">
          <UserHeader user={user}>
            <Button
              onClick={() => router.push("/central/profile/editing")}
              aria-label="Edit Profile"
            >
              Edit Profile
            </Button>
          </UserHeader>
          <UserProfileTabs user={user} />
        </div>
      ) : (
        <FallbackProfile />
      )}
    </>
  );
}
