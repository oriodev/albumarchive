"use client";

// ZOD.
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// SCHEMAS.
import { editUserSchema } from "@/zod/edit-user-schema";

// HOOKS.
import { FormProvider, useForm } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "../ui/textarea";
import { updateUser } from "@/api/user.api";
import { useRouter } from "next/navigation";
import { useUser } from "@/utils/providers/UserProvider";
import { useEffect, useState } from "react";

// COMPONENTS.
import {
  CldImage,
  CldUploadButton,
  CloudinaryUploadWidgetInfo,
} from "next-cloudinary";
import { Button } from "../ui/button";
import { destroyImage } from "@/api/cloudinary.api";

type FormData = z.infer<typeof editUserSchema>;

export function EditingProfile({}) {
  // HOOKS.
  const router = useRouter();
  const { user, updateUserInfo } = useUser();

  // STATES.
  const [imageUrl, setImageUrl] = useState("");
  const [publicId, setPublicId] = useState("");

  // FORM.
  const form = useForm<FormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      description: user?.description,
    },
  });

  // SET FORM DEFAULTS.
  useEffect(() => {
    if (user) {
      form.reset({ description: user.description });
    }
  }, [user, form]);

  // FORM.
  const { handleSubmit, control } = form;

  // ON SUBMIT.
  const onSubmit = async (data: FormData) => {
    if (!user?._id) {
      throw new Error("no user id");
    }

    const userPayload = {
      description: data.description,
      profileImg: imageUrl,
    };

    await updateUser(user?._id, userPayload);
    updateUserInfo(userPayload);
    router.push("/central/profile");
  };

  // ON DISCARD.
  const onDiscard = async () => {
    console.log("public id: ", publicId);
    if (imageUrl) await destroyImage(publicId);
    router.push("/central/profile");
  };

  // ON UPLOAD.
  const onUpload = async (info: CloudinaryUploadWidgetInfo) => {
    console.log(info);
    if (imageUrl) await destroyImage(publicId);
    setImageUrl(info.secure_url);
    setPublicId(info.public_id);
  };

  console.log("user", user);

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-5">
        {imageUrl ||
          (user?.profileImg && (
            <CldImage
              width="300"
              height="300"
              src={imageUrl || user?.profileImg}
              sizes="100vw"
              alt={user?.username || "profile picture"}
            />
          ))}
        <CldUploadButton
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME}
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

      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 py-4 w-1/2"
        >
          {/* DESCRIPTION FIELD */}
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full space-x-2">
            {/* SUBMIT BUTTON */}
            <Button
              type="submit"
              className="mt-4 w-1/2 bg-white text-black font-bold py-2 px-4 rounded hover:bg-gray-200"
            >
              Save Changes
            </Button>

            {/* DISCARD BUTTON */}
            <Button
              type="button"
              onClick={onDiscard}
              className="mt-4 w-1/2 bg-white text-black font-bold py-2 px-4 rounded hover:bg-gray-200"
            >
              Discard Changes
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
