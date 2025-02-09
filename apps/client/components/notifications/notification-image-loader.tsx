// TYPES.
import { NotificationType } from "@/types";

// COMPONENTS.
import { CldImage } from "next-cloudinary";
import Image from "next/image";

// COMPONENTS.

export default function NotificationImageLoader({
  image,
  type,
}: {
  image: string | undefined;
  type: NotificationType;
}) {
  const size = 200;

  return (
    <>
      {type === NotificationType.FRIENDREQUEST ||
      type === NotificationType.RESPONSE ? (
        <>
          {image ? (
            <CldImage
              width={size}
              height={size}
              src={image}
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
        </>
      ) : (
        <div>
          {image ? (
            <Image alt={"album image"} src={image} width={size} height={size} />
          ) : (
            <Image
              src="/albumfallback.png"
              width={size}
              height={size}
              alt="album fallback image"
            />
          )}
        </div>
      )}
    </>
  );
}
