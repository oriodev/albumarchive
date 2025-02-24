"use client";

// COMPONENTS.
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { User } from "@/types";
import ProfileImage from "../general/profile-image";
import { useRouter } from "next/navigation";

interface Props {
  users: User[];
}

export default function UserList({ users }: Props) {
  const limit = 2;
  const extra = users.length - limit;
  const slicedUsers = users.slice(0, limit);

  const router = useRouter();

  const handleClick = (username: string): void => {
    router.push(`/central/users/${username}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="hover:cursor-pointer">
        <div className="flex flex-row gap-2">
          {slicedUsers.map((user, index) => (
            <ProfileImage key={index} user={user} size={8} />
          ))}
          {users.length > limit && <div className="pl-2">+ {extra}</div>}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Users</DropdownMenuLabel>
        <DropdownMenuGroup>
          {users.map((user, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() => handleClick(user.username)}
            >
              {user.username}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
