import { List } from "@/types";
import { CldImage } from "next-cloudinary";
import Image from "next/image";

export default function ListImage({
  list,
  size,
}: {
  list: List;
  size: number;
}) {
  return (
    <div>
      {list.listCoverImg ? (
        <CldImage
          width={size}
          height={size}
          src={list.listCoverImg}
          sizes="100vw"
          alt={"user fallback image"}
          crop="fill"
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
  );
}
