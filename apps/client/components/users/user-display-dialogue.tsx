import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import { useToast } from "@/hooks/use-toast";
import UserDisplayCard from "./user-display-card";
import { User } from "@/types";
import { Button } from "../ui/button";
// import Image from "next/image";

interface UserDisplayDialogueProps {
  user: User;
}

export function UserDisplayDialogue({ user }: UserDisplayDialogueProps) {
  //   const { toast } = useToast();

  const viewProfile = !user.private;

  const ViewableProfile = () => {
    return (
      <div className="flex gap-2">
        <Button>Visit Profile</Button>

        {/* TODO: MAKE THIS SHOW DEPENDING ON FOLLOW STATUS */}
        <Button>Follow</Button>
      </div>
    );
  };

  const UnviewableProfile = () => {
    return (
      <>
        <Button>Request Follow</Button>
      </>
    );
  };

  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <UserDisplayCard user={user} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user.username}</DialogTitle>
          <DialogDescription>{user.description}</DialogDescription>
        </DialogHeader>
        {viewProfile ? <ViewableProfile /> : <UnviewableProfile />}
      </DialogContent>
    </Dialog>
  );
}
