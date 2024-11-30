"use client";

import { useUser } from "@/utils/providers/UserProvider";

export function Profile() {
  const user = useUser();

  return (
    <div>
      <p>{user?.username}</p>
      <p>{user?.email}</p>
    </div>
  );
}
