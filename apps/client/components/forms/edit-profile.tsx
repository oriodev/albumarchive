"use client";

import Image from "next/image";
import { CldUploadButton } from "next-cloudinary";

import { useState } from "react";

export default function EditProfile() {
  const [imageUrl, setImageUrl] = useState("");

  const handleUpload = () => {
    console.log("hello");
  };

  return (
    <div className={"max-w-2xl p-8"}>
      <CldUploadButton
        options={{
          maxFiles: 1,
        }}
        onSuccess={handleUpload}
        uploadPreset="profile"
      >
        <div className="p-2 pl-10 pr-10 rounded-lg bg-white text-black font-bold">
          <p>upload image</p>
        </div>
      </CldUploadButton>

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
