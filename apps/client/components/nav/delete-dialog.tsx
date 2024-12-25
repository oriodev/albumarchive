"use client";

import { deleteList } from "@/api/list.api";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { listToRender } from "@/types";
import { useRouter } from "next/navigation";

interface DeleteDialogProps {
  itemToDelete: { id: string; type: string } | undefined;
  setLists: React.Dispatch<React.SetStateAction<listToRender[]>>;
}

export function DeleteDialog({ itemToDelete, setLists }: DeleteDialogProps) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (id) {
      await deleteList(id);
      setLists((prev) => prev.filter((item) => item.id !== id));
      router.push("/central/lists/listened");
    }

    return null;
  };

  const deleteDialogInfo = {
    title: "Are you absolutely sure?",
    description:
      "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{deleteDialogInfo.title}</AlertDialogTitle>
        <AlertDialogDescription>
          {deleteDialogInfo.description}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>

        <AlertDialogAction
          onClick={() => {
            if (itemToDelete) {
              handleDelete(itemToDelete.id);
            }
          }}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
