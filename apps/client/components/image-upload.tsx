import { List, User } from "@/types";
import {
  CldImage,
  CldUploadButton,
  CloudinaryUploadWidgetInfo,
} from "next-cloudinary";

export default function ImageUpload({
  imageUrl,
  user,
  list,
  onUpload,
}: {
  imageUrl: string;
  user?: User;
  list?: List;
  onUpload: (info: CloudinaryUploadWidgetInfo) => void;
}) {
  return (
    <div className="flex gap-5">
      {imageUrl ? (
        <CldImage
          width="300"
          height="300"
          src={imageUrl}
          sizes="100vw"
          alt={user?.username || list?.name || "image"}
          crop="fill"
        />
      ) : user?.profileImg ? (
        <CldImage
          width="300"
          height="300"
          src={user.profileImg}
          sizes="100vw"
          alt={user.username || "profile picture"}
          crop="fill"
        />
      ) : list?.listCoverImg ? (
        <CldImage
          width="300"
          height="300"
          src={list.listCoverImg}
          sizes="100vw"
          alt={list.name || "list cover image"}
          crop="fill"
        />
      ) : null}

      <CldUploadButton
        uploadPreset={
          user
            ? process.env.NEXT_PUBLIC_CLOUDINARY_PROFILE_PRESET_NAME
            : process.env.NEXT_PUBLIC_CLOUDINARY_LISTS_PRESET_NAME
        }
        onUpload={(result) => {
          if (result.event === "success") {
            if (!result.info) return;
            onUpload(result.info as CloudinaryUploadWidgetInfo);
          }
        }}
      >
        <span className="bg-white text-black p-2 pl-5 pr-5 rounded-lg">
          Upload Image
        </span>
      </CldUploadButton>
    </div>
  );
}
