"use client";

// PACKAGES.
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// TYPES & SCHEMAS.
import { editListSchema } from "@/zod/edit-list-schema";
import { useRouter } from "next/navigation";
import { List } from "@/types";

// HOOKS.
import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useState } from "react";

// COMPONENTS.
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useUser } from "@/utils/providers/UserProvider";
import { slugify } from "@/utils/global.utils";
import { updateList } from "@/api/list.api";
import ImageUpload from "../image-upload";
import { CloudinaryUploadWidgetInfo } from "next-cloudinary";

// SET FORM DATA TYPE.
type FormData = z.infer<typeof editListSchema>;

export function EditList({ slug }: { slug: string }) {
  // HOOKS.
  const { user, updateUserInfo } = useUser();
  const router = useRouter();

  // STATES.
  const [list, setList] = useState<List | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  // GRAB LIST.
  useEffect(() => {
    const fetchList = async () => {
      if (user && user._id && user.lists) {
        const fetchedList = user.lists.filter(
          (list) => list.slug.toLowerCase() === slug.toLowerCase(),
        )[0];

        if (!fetchedList) {
          router.push("/central/lists");
        }

        setList(fetchedList);
      }
    };

    fetchList();
  }, [user, slug, router]);

  // SET FORM AND DEFAULT VALUES.
  const form = useForm<FormData>({
    resolver: zodResolver(editListSchema),
    defaultValues: {
      name: list?.name || "",
      description: list?.description || "",
    },
  });

  // RESET DEFAULT VALUES.
  useEffect(() => {
    if (list) {
      form.reset({
        name: list.name,
        description: list.description,
      });
    }
  }, [list, form]);

  // GET FORM STUFF.
  const { handleSubmit, control, setError } = form;

  // ON SUBMIT.
  const onSubmit = async (data: FormData) => {
    // CHECK IF NAME IS VALID.
    if (list?._id && user?.lists) {
      const nameExists =
        data.name !== list.name &&
        user.lists.some((list) => list.name === data.name);

      // SET NAME EXISTS ERROR.
      if (nameExists) {
        setError("name", {
          type: "manual",
          message: "List name already exists, please choose another one.",
        });
        return;
      }

      // SET SLUG NOT ALLOWED ERROR.
      const slug = slugify(data.name);

      if (!slug) {
        setError("name", {
          type: "manual",
          message:
            "List name must be sluggable, choose another with some actual letters or numbers in it pls.",
        });
        return;
      }

      // SLUGIFY THE LIST DATA.
      const slugifiedData = {
        name: data.name,
        slug: slug,
        description: data.description,
        listCoverImg: imageUrl,
      };

      // UPDATE THE LIST IN THE DATABASE.
      const updatedList = await updateList(list._id, slugifiedData);

      // UPDATE USER PROVIDER.
      const updatedLists = user.lists.map((list) =>
        list._id === updatedList._id ? updatedList : list,
      );
      updateUserInfo({ lists: updatedLists });

      router.push(`/central/lists/${updatedList.slug}`);
    } else {
      throw new Error("could not create list");
    }
  };

  // ON UPLOAD.
  const onUpload = async (info: CloudinaryUploadWidgetInfo) => {
    setImageUrl(info.secure_url);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl">Edit {list?.name || "List"}</h2>

      {list && (
        <ImageUpload imageUrl={imageUrl} list={list} onUpload={onUpload} />
      )}

      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 py-4 w-1/2"
        >
          {/* NAME FIELD */}
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
