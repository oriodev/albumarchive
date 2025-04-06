"use client";

import { useEffect, useState } from "react";
import { editUserSchema } from "@/zod/edit-user-schema";
import { z } from "zod";
import { useUser } from "@/utils/providers/UserProvider";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUser } from "@/apis/user.api";
import { Label } from "@radix-ui/react-label";
import { Button } from "../ui/button";
import { FormField, FormItem, FormControl, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";
import ImageUpload from "../buttons/imageupload";

type FormData = z.infer<typeof editUserSchema>;

export default function EditProfile() {
  // HOOKS.
  const router = useRouter();
  const { user, updateUserInfo } = useUser();

  const [imageUrl, setImageUrl] = useState<string>("");

  const form = useForm<FormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      description: user?.description || "",
    },
  });

  // SET FORM DEFAULTS.
  useEffect(() => {
    if (user) {
      form.reset({ description: user.description || "" });
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
      description: data.description || "",
      profileImg: imageUrl,
    };

    await updateUser(user?._id, userPayload);
    updateUserInfo(userPayload);
    router.push("/central/profile");
  };

  // ON DISCARD.
  const onDiscard = async () => {
    router.push("/central/profile");
  };

  return (
    <div className="flex flex-col items-center">
      {user && (
        <ImageUpload
          user={user}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
        />
      )}

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
