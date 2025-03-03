"use client";

import { UploadDropzone } from "@/utils/uploadthing.utils";
import Image from "next/image";

import { useState } from "react";

export default function EditProfile() {
  const [imageUrl, setImageUrl] = useState("");

  return (
    <div className={"max-w-2xl p-8"}>
      <UploadDropzone
        endpoint={"imageUpload"}
        onClientUploadComplete={(res) => {
          if (res?.[0].url) {
            console.log("Good job!. We did it!", res?.[0].url);
            setImageUrl(res?.[0].url);
          }
        }}
        onUploadError={(error: Error) => {
          console.error("Ooops something is wrong", error);
        }}
      />

      {imageUrl && (
        <div>
          <div className="relative aspect-video mt-2">
            <Image
              alt="Upload"
              fill
              className="object-cover rounded-md"
              src={imageUrl}
            />
          </div>
        </div>
      )}
    </div>
  );
}
