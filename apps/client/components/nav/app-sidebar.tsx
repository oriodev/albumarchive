"use client";

import * as React from "react";
import { Album, Disc, Headphones, LifeBuoy, Send, User } from "lucide-react";

import { NavProjects } from "@/components/nav/nav-projects";
import { NavSecondary } from "@/components/nav/nav-secondary";
import { NavUser } from "@/components/nav/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUser } from "@/utils/providers/UserProvider";
import { slugify } from "@/utils/global.utils";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUser();

  const lists =
    user?.lists?.map((list) => {
      const slug = slugify(list.name);

      return {
        id: list._id || "",
        name: list.name,
        type: list.type,
        url: `/central/lists/${slug}`,
        icon: Headphones,
      };
    }) || [];

  const data = {
    user: {
      username: user?.username || "",
      email: user?.email || "",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "pages",
        isActive: true,
        items: [
          {
            title: "albums",
            url: "/central/albums",
            icon: Album,
          },
          {
            title: "users",
            url: "/central/users",
            icon: User,
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
      },
    ],
    lists: lists,
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-6 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Disc className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Album Archive</span>
                  <span className="truncate text-xs">welcome :)</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <NavProjects projects={data.lists} title="lists" />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
