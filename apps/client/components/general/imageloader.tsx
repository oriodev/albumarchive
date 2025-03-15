// COMPONENTS.
import { ImageType } from "@/types";
import { CldImage } from "next-cloudinary";
import Image from "next/image";

export default function ImageLoader({
  image,
  type,
  size,
}: {
  image: string | undefined;
  type: ImageType;
  size: number;
}) {
  return (
    <>
      {type === ImageType.user ? (
        <>
          {image ? (
            <CldImage
              width={size}
              height={size}
              src={image}
              sizes={size.toString()}
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
      ) : type === ImageType.album ? (
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
      ) : (
        <div>
          {image ? (
            <CldImage
              width={size}
              height={size}
              src={image}
              sizes={"100vw 100vh"}
              alt="list cover image"
            />
          ) : (
            <Image
              src="/listfallback.png"
              width={size}
              height={size}
              alt="list fallback image"
            />
          )}
        </div>
      )}
    </>
  );
}
