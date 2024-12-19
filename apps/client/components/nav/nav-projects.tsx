"use client";

import {
  Edit,
  Folder,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
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
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { DeleteDialog } from "./delete-dialog";
// import { deleteList } from "@/api/lists.api";

export function NavProjects({
  projects,
  title,
}: {
  projects: {
    id: string;
    name: string;
    type: string;
    url: string;
    icon: LucideIcon;
  }[];
  title: string;
}) {
  const { isMobile } = useSidebar();
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    type: string;
  }>();

  return (
    <AlertDialog>
      {/* SIDEBAR. */}
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>{title}</SidebarGroupLabel>

        {/* ITERATE THROUGH PROJECTS. */}
        <SidebarMenu>
          {projects.map((item) => (
            // SET NAME AND ICON.
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>

              {/* DROPDOWN MENU. */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
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
                  <DropdownMenuItem>
                    <Folder className="text-muted-foreground" />
                    <span>View List</span>
                  </DropdownMenuItem>

                  {item.type !== "Listened" && item.type !== "To Listen" && (
                    <>
                      {/* EDIT LIST. */}
                      <DropdownMenuItem>
                        <Edit className="text-muted-foreground" />
                        <span>Edit List</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />

                      {/* DELETE LIST. */}
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onClick={() =>
                            // TRIGGER THE MENU OPENINGs.
                            setItemToDelete({
                              id: item.id,
                              type: item.type,
                            })
                          }
                        >
                          <Trash2 className="text-muted-foreground" />
                          <span>Delete List</span>
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                    </>
                  )}

                  {/* END OF DELETE. */}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}

          {/* MORE BUTTON. */}
          {projects.length > 10 && (
            <SidebarMenuItem>
              <SidebarMenuButton>
                <MoreHorizontal />
                <span>More</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroup>

      {/* DELETE DIALOG CONTENT. */}
      <DeleteDialog itemToDelete={itemToDelete} />
    </AlertDialog>
  );
}
