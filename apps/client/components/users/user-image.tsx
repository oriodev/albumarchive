import { User } from "@/types";
import Image from "next/image";

import {} from "@/components/ui/tooltip";
import { CldImage } from "next-cloudinary";

export default function UserImage({
  user,
  size,
}: {
  user: User;
  size: number;
  useTooltip?: boolean;
}) {
  return (
    <div>
      <div>
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
      </div>
    </div>
  );
}
