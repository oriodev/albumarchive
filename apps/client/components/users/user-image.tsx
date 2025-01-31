import { User } from "@/types";
import Image from "next/image";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function UserImage({
  user,
  size,
}: {
  user: User;
  size: number;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div>
            {user.profileImg ? (
              <Image
                src={user.profileImg}
                width={size}
                height={size}
                alt="user fallback image"
              />
            ) : (
              <Image
                src="/userfallback.png"
                width={size}
                height={size}
                alt="user fallback image"
              />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{user.username}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
