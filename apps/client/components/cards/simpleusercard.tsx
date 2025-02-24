// COMPONENTS.
import Link from "next/link";
import ImageLoader from "../general/imageloader";

// TYPES.
import { ImageType } from "@/types";

interface Props {
  image: string | undefined;
  title: string;
  link: string;
}

/**
 * simple user display on room sidebar.
 */
export default function SimpleUserCard({ image, title, link }: Props) {
  return (
    <div>
      <div className="flex flex-row gap-5 justify-between pt-5">
        <Link href={link}>
          <div className="flex flex-row gap-5">
            <ImageLoader image={image} type={ImageType.user} size={30} />
            <div className="flex flex-col gap-2">
              <p className="text-lg text-gray-200">{title}</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
