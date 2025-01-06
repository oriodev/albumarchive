"use client";

// HOOKS.
import { useUser } from "@/utils/providers/UserProvider";

// COMPONENTS.
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Profile() {
  const { user } = useUser();
  const router = useRouter();

  const [profileData, setProfileData] = useState(user);

  useEffect(() => {
    setProfileData(user);
  }, [user]);

  // SET INITIAL FOR PROFILE PIC FALLBACK
  let initial = "?";

  if (profileData?.username) {
    initial = profileData?.username[0].toUpperCase();
  }

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
        </div>
      </div>
    );
  };

  const FallbackProfile = () => {
    return (
      <div className="flex justify-center items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  };

  return <div>{user ? <DisplayProfile /> : <FallbackProfile />}</div>;
}
