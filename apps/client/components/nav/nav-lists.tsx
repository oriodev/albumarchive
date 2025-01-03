"use client";

import { Edit, Folder, MoreHorizontal, Trash2 } from "lucide-react";

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
import Link from "next/link";
import { Dialogs, listToRender } from "@/types";
import NewListBtn from "../lists/new-list-btn";
import { EditDialog } from "./edit-dialog";

export function NavLists({
  lists,
  title,
  setLists,
}: {
  lists: listToRender[];
  title: string;
  setLists: React.Dispatch<React.SetStateAction<listToRender[]>>;
}) {
  const { isMobile } = useSidebar();
  const [dialog, setDialog] = useState<Dialogs>();
  const [itemToHandle, setItemToHandle] = useState<listToRender>();

  return (
    <AlertDialog>
      {/* SIDEBAR. */}
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <div className="flex justify-between">
          <SidebarGroupLabel>{title}</SidebarGroupLabel>
          <NewListBtn setLists={setLists} lists={lists} />
        </div>

        {/* ITERATE THROUGH LISTS. */}
        <SidebarMenu>
          {lists.map((item) => (
            // SET NAME AND ICON.
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <Link href={item.url || "/"}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
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
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onClick={() => {
                            // TRIGGER THE MENU OPENINGs.
                            setItemToHandle(item);
                            setDialog(Dialogs.edit);
                          }}
                        >
                          <Edit className="text-muted-foreground" />
                          <span>Edit List</span>
                        </DropdownMenuItem>
                      </AlertDialogTrigger>

                      {/* SEPARATOR. */}
                      <DropdownMenuSeparator />

                      {/* DELETE LIST. */}
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onClick={() => {
                            // TRIGGER THE MENU OPENINGs.
                            setItemToHandle(item);
                            setDialog(Dialogs.delete);
                          }}
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
          {lists.length > 10 && (
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
      {dialog === Dialogs.delete ? (
        <DeleteDialog itemToDelete={itemToHandle} setLists={setLists} />
      ) : (
        <EditDialog
          itemToEdit={itemToHandle}
          setLists={setLists}
          lists={lists}
        />
      )}
    </AlertDialog>
  );
}
