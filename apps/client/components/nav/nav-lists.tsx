"use client";

// COMPONENTS.
import {
  Edit,
  Folder,
  MoreHorizontal,
  PlusCircleIcon,
  Share,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
// import { DeleteDialog } from "./delete-dialog";

import Link from "next/link";
import { listToRender } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { deleteList } from "@/apis/list.api";
import { useUser } from "@/utils/providers/UserProvider";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/utils/global.utils";
import { handleCreateNewList } from "@/utils/lists.utils";

export function NavLists({
  lists,
  title,
  setLists,
}: {
  lists: listToRender[];
  title: string;
  setLists: React.Dispatch<React.SetStateAction<listToRender[]>>;
}) {
  // HOOKS.
  const router = useRouter();
  const pathname = usePathname();
  const { user, updateUserInfo } = useUser();
  const { toast } = useToast();

  // STATES.
  const { isMobile } = useSidebar();

  const handleDelete = async (id: string) => {
    if (!user?.lists) return null;

    if (id) {
      // UPDATE USER PROVIDER.
      const listToDelete = user.lists.filter((list) => list._id === id)[0];
      const updatedLists = user.lists.filter((list) => !(list._id === id));
      updateUserInfo({ lists: updatedLists });

      await deleteList(id);

      const path = pathname.split("/");

      if (path[path.length - 1] === listToDelete.slug) {
        router.push("/central/lists/listened");
      }
    }

    return null;
  };

  const handleShare = async (name: string) => {
    try {
      if (!user) return null;
      const shareUrl = `www.albumarchive.live/central/users/${user.username}/${slugify(name)}`;
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "List url saved to clipboard",
        description: shareUrl,
      });
    } catch {
      toast({
        title: "Share failed",
      });
    }
  };

  return (
    <>
      {/* SIDEBAR. */}

      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <div className="flex justify-between">
          <SidebarGroupLabel>
            <Link
              href={"/central/lists"}
              className="transition-transform transform hover:scale-105"
            >
              {title}
            </Link>
          </SidebarGroupLabel>
        </div>

        {/* ITERATE THROUGH LISTS. */}
        <SidebarMenu>
          {lists.map((item) => (
            // SET NAME AND ICON.
            <SidebarMenuItem key={item.name} data-cy="listItem">
              <SidebarMenuButton asChild>
                <Link href={item.url || "/"}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>

              {/* DROPDOWN MENU. */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover data-cy="listDropdownBtn">
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  {/* VIEW LIST. */}
                  <DropdownMenuItem
                    onClick={() => {
                      router.push(item.url);
                    }}
                  >
                    <Folder className="text-muted-foreground" />
                    <span>View List</span>
                  </DropdownMenuItem>

                  {item.type !== "Listened" && item.type !== "To Listen" && (
                    <>
                      {/* SEPARATOR. */}
                      <DropdownMenuSeparator />

                      {/* EDIT LIST. */}
                      <DropdownMenuItem
                        onClick={() => {
                          router.push(`${item.url}/editing`);
                        }}
                      >
                        <Edit className="text-muted-foreground" />
                        <span>Edit List</span>
                      </DropdownMenuItem>

                      {/* DELETE LIST. */}
                      <DropdownMenuItem
                        onClick={() => handleDelete(item.id)}
                        data-cy="deleteListBtn"
                      >
                        <Trash2 className="text-muted-foreground" />
                        <span>Delete List</span>
                      </DropdownMenuItem>

                      {/* SHARE LIST. */}
                      <DropdownMenuItem onClick={() => handleShare(item.name)}>
                        <Share className="text-muted-foreground" />
                        <span>Share List</span>
                      </DropdownMenuItem>
                    </>
                  )}

                  {/* END OF DELETE. */}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}

          {/* MORE BUTTON. */}
          {lists.length > 10 && (
            <SidebarMenuItem>
              <SidebarMenuButton>
                <MoreHorizontal />
                <span>More</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() =>
                handleCreateNewList(
                  user,
                  lists,
                  router,
                  updateUserInfo,
                  setLists,
                )
              }
              data-cy="newListBtn"
            >
              <PlusCircleIcon />
              <span className="font-bold">Create New List</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
