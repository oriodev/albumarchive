// COMPONENTS.
import { Badge } from "@/components/ui/badge";
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

// ICONS.
import { Edit, Trash2 } from "lucide-react";
import { type LucideIcon } from "lucide-react";

export function ActionBadge({
  Icon,
  label,
}: {
  Icon: LucideIcon;
  label: string;
}) {
  return (
    <Badge className="flex flex-wrap gap-1 bg-cyan-700 text-white hover:cursor-pointer hover:bg-cyan-800 hover:text-gray-200 transition-colors duration-200">
      <Icon size={20} />
      {label}
    </Badge>
  );
}

export function ListBadges() {
  return (
    <div className="flex flex-wrap gap-2">
      <ActionBadge Icon={Edit} label="Edit" />

      {/* DELETE. */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <ActionBadge Icon={Trash2} label="Delete" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
