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

interface DeleteDialogProps {
  itemToDelete: { id: string; type: string } | undefined;
}

export function DeleteDialog({ itemToDelete }: DeleteDialogProps) {
  const handleDelete = async (id: string) => {
    if (id) {
      // await deleteList(id);
      console.log("DELETING: ", id);
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
