// COMPONENTS.
import { ImageType } from "@/types";
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
            <Image
              src="/userfallback.png"
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
            <Image
              src="/userfallback.png"
              width={size}
              height={size}
              alt="user fallback image"
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
