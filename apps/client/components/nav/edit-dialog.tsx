"use client";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { listToRender } from "@/types";
import { Textarea } from "../ui/textarea";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, FormItem, FormControl, FormMessage } from "../ui/form";
import { editListSchema } from "@/zod/edit-list-schema";
import { useEffect } from "react";
import { updateList } from "@/api/list.api";
import { Headphones } from "lucide-react";
import { slugify } from "@/utils/global.utils";
import { useRouter } from "next/navigation";

interface EditDialogProps {
  itemToEdit: listToRender | undefined;
  setLists: React.Dispatch<React.SetStateAction<listToRender[]>>;
  lists: listToRender[];
}

type FormData = z.infer<typeof editListSchema>;

export function EditDialog({ itemToEdit, setLists, lists }: EditDialogProps) {
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(editListSchema),
    defaultValues: {
      name: itemToEdit?.name,
      description: itemToEdit?.description,
    },
  });

  useEffect(() => {
    if (itemToEdit) {
      form.reset({
        name: itemToEdit.name,
        description: itemToEdit.description,
      });
    }
  }, [itemToEdit, form]);

  const { handleSubmit, control, setError } = form;

  const onSubmit = async (data: FormData) => {
    if (itemToEdit?.id) {
      const nameExists = lists.some((list) => list.name === data.name);

      if (nameExists) {
        setError("name", {
          type: "manual",
          message: "List name already exists, please choose another one.",
        });
        return;
      }

      const slug = slugify(data.name);

      if (!slug) {
        setError("name", {
          type: "manual",
          message:
            "List name must be sluggable, choose another with some actual letters or numbers in it pls.",
        });
        return;
      }

      const slugifiedData = {
        name: data.name,
        slug: slug,
        description: data.description,
      };

      const updatedList = await updateList(itemToEdit?.id, slugifiedData);

      const listToUpdate: listToRender = {
        id: updatedList._id,
        name: updatedList.name,
        type: updatedList.type,
        url: `/central/lists/${updatedList.slug}`,
        icon: Headphones,
        description: updatedList.description,
      };

      if (updatedList) {
        setLists((prev) =>
          prev.map((list) =>
            list.id === listToUpdate.id ? listToUpdate : list,
          ),
        );
        router.push(listToUpdate.url);
      } else {
        throw new Error("could not create list");
      }
    }
  };

  const editDialogInfo = {
    title: "Edit List",
    description: "Make edits to your list info. Press save when you're done.",
  };

  return (
    <AlertDialogContent className="sm:max-w-[425px]">
      <AlertDialogHeader>
        <AlertDialogTitle>{editDialogInfo.title}</AlertDialogTitle>
        <AlertDialogDescription>
          {editDialogInfo.description}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          {/* NAME FIELD */}
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" type="text" required {...field} />
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

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {}
            <AlertDialogAction type="submit" className="w-full">
              Save Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </FormProvider>
    </AlertDialogContent>
  );
}
