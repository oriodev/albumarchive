"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { updateUser } from "@/api/user.api";
import { useUser } from "@/utils/providers/UserProvider";
import { useState } from "react";

export function PrivacyButton() {
  const { user } = useUser();
  const [privacy, setPrivacy] = useState(user?.private);

  const handlePrivacyToggle = async () => {
    if (user?.id) {
      await updateUser(user.id, {
        private: !privacy,
      });
      setPrivacy(!privacy);
    }

    return null;
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          {privacy ? "Set Public" : "Set Private"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {privacy ? "Set Public?" : "Set Private?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {privacy
              ? "This will make all your lists visible and allow anybody to follow you."
              : "This will make all your lists private and stop anybody following you without permission."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handlePrivacyToggle}>
            {privacy ? "Set Public" : "Set Private"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
