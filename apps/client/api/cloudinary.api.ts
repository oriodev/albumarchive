"use server";

import cloudinary from "@/utils/cloudinary.utils";

export const destroyImage = async (publicId: string) => {
  try {
    // const timestamp = Math.round(new Date().getTime() / 1000);

    const api_secret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

    if (!api_secret) return null;

    // const signature = cloudinary.utils.api_sign_request({
    //     timestamp: timestamp,
    //     eager: 'w_400,h_300,c_pad|w_260,h_200,c_crop',
    //     public_id: 'sample_image'}, api_secret);

    const response = await cloudinary.uploader.destroy(
      publicId,
      function (result) {
        console.log(result);
      },
    );
    if (!response.ok) return null;
    console.log("response: ", response);
    return response;
  } catch (error) {
    console.log("error in cloudinary delete image: ", error);
    return null;
  }
};
