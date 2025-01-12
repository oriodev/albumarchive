"use client";

import * as React from "react";
import {
  Album,
  CloudLightning,
  Headphones,
  LifeBuoy,
  Send,
  User,
} from "lucide-react";

import { NavLists } from "@/components/nav/nav-lists";
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
import Link from "next/link";
import { useEffect, useState } from "react";
import { listToRender } from "@/types";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  const [lists, setLists] = useState<listToRender[]>([]);

  useEffect(() => {
    if (user?.lists) {
      setLists(
        user?.lists?.map((list) => {
          const slug = slugify(list.name);

          return {
            id: list._id || "",
            name: list.name,
            type: list.type,
            url: `/central/lists/${slug}`,
            icon: Headphones,
            description: list.description,
          };
        }),
      );
    } else {
      setLists([]);
    }
  }, [user]);

  const data = {
    user: {
      username: user?.username || "",
      email: user?.email || "",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Discover",
        isActive: true,
        items: [
          {
            title: "Activity",
            url: "/central/activity",
            icon: CloudLightning,
          },
          {
            title: "Albums",
            url: "/central/albums",
            icon: Album,
          },
          {
            title: "Users",
            url: "/central/users",
            icon: User,
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "/central/support",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "/central/feedback",
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
                <div className="grid flex-1 text-left text-2xl leading-tight">
                  <span className="truncate font-semibold">Album Archive</span>
                  <span className="truncate text-xs">savour your music.</span>
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
                      <div>
                        {item.icon && <item.icon />}
                        <Link href={item.url}>{item.title}</Link>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <NavLists lists={data.lists || []} title="Lists" setLists={setLists} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
