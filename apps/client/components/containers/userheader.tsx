import { User } from "@/types";
import ProfileImage from "../general/profile-image";
import { ReactNode } from "react";

interface Props {
  user: User;
  children: ReactNode;
}

export default function UserHeader({ user, children }: Props) {
  return (
    <header
      className="flex flex-wrap gap-7 items-center justify-between"
      id="profile-header"
    >
      <div className="flex items-center gap-3">
        {/* PROFILE PIC */}
        <ProfileImage user={user} size={16} />

        {/* NAME AND DESCRIPTION */}
        <div>
          <p className="text-3xl font-bold" aria-live="polite">
            {user.username}
          </p>
          <p>{user.description}</p>
        </div>
      </div>

      <div>{children}</div>
    </header>
  );
}
