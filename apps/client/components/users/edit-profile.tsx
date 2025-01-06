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
import { useEffect } from "react";

type FormData = z.infer<typeof editUserSchema>;

export function EditingProfile({}) {
  const router = useRouter();
  const { user, updateUserInfo } = useUser();

  const form = useForm<FormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      description: user?.description,
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({ description: user.description });
    }
  }, [user, form]);

  const { handleSubmit, control } = form;

  const onSubmit = async (data: FormData) => {
    if (!user?.id) {
      throw new Error("no user id");
    }

    await updateUser(user?.id, data);
    updateUserInfo({ description: data.description });
    router.push("/central/profile");
  };

  return (
    <div className="flex justify-center">
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
          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="mt-4 bg-white text-black font-bold py-2 px-4 rounded hover:bg-gray-200"
          >
            Save Changes
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
