"use client";

import { List, User } from "@/types";
import { UploadButton } from "@/utils/uploadthing.utils";

export default function ImageUpload(
  {
    // imageUrl,
    // user,
    // list,
    // onUpload,
  }: {
    // imageUrl: string;
    user?: User;
    list?: List;
    onUpload: () => void;
  },
) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
    </main>
    // <div className="flex gap-5">
    //   {/* Display the uploaded image or the user's/profile list's image */}
    //   {imageUrl ? (
    //     <p>hi</p>
    //   ) : user?.profileImg ? (
    //     <p>hi</p>
    //   ) : list?.listCoverImg ? (
    //     <p>hi</p>
    //   ) : null}

    //   <main className="flex min-h-screen flex-col items-center justify-between p-24">
    //     <UploadButton
    //       endpoint="imageUploader" // Ensure this matches your Uploadthing endpoint
    //       onClientUploadComplete={(res) => {
    //         // Handle the response from Uploadthing
    //         console.log("Files: ", res);
    //         alert("Upload Completed");

    //         // Call the onUpload callback to perform any additional actions
    //         onUpload();
    //       }}
    //       onUploadError={(error: Error) => {
    //         // Handle any errors during the upload
    //         alert(`ERROR! ${error.message}`);
    //       }}
    //     />
    //   </main>
    // </div>
  );
}
