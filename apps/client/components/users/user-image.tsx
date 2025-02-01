import { User } from "@/types";
import Image from "next/image";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CldImage } from "next-cloudinary";

export default function UserImage({
  user,
  size,
  useTooltip = true,
}: {
  user: User;
  size: number;
  useTooltip?: boolean;
}) {
  return (
    <div>
      {useTooltip ? (
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div>
                  {user.profileImg ? (
                    <CldImage
                      width={size}
                      height={size}
                      src={user.profileImg}
                      sizes="100vw"
                      alt={"user profile image"}
                      crop="fill"
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
        </div>
      ) : (
        <div>
          {user.profileImg ? (
            <CldImage
              width={size}
              height={size}
              src={user.profileImg}
              sizes="100vw"
              alt={"user profile image"}
              crop="fill"
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
      )}
    </div>
  );
}
