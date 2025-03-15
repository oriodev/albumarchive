import { List, User } from "@/types";
import {
  CldImage,
  CldUploadButton,
  CloudinaryUploadWidgetInfo,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";

export default function ImageUpload({
  imageUrl,
  user,
  list,
  setImageUrl,
}: {
  imageUrl: string;
  user?: User;
  list?: List;
  setImageUrl: (info: string) => void;
}) {

  const onAddImage = async (result: CloudinaryUploadWidgetResults) => {
    const info = result.info as CloudinaryUploadWidgetInfo;
    setImageUrl(info.secure_url);
  };


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
      options={{ maxFiles: 1 }}
      onSuccess={onAddImage}
      uploadPreset={
        user
          ? "profile"
          : "albumlist"
      }
      className={`flex items-center gap-2 border-2 border-default text-default 
      rounded-lg py-2 px-4 hover:bg-default/10`}
    >
        Upload new image
    </CldUploadButton>
    </div>
  );
}