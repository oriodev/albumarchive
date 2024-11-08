"use client";

import * as React from "react";
import {
  Disc,
  Headphones,
  LifeBuoy,
  List,
  ListTodo,
  Send,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "ori",
    email: "ori@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "auth stuff temp",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "login page",
          url: "/login",
        },
        {
          title: "signup page",
          url: "/signup",
        },
        {
          title: "c",
          url: "#",
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
  lists: [
    {
      name: "Listened",
      url: "#",
      icon: Headphones,
    },
    {
      name: "To Listen",
      url: "#",
      icon: ListTodo,
    },
    {
      name: "Custom List",
      url: "#",
      icon: List,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavMain items={data.navMain} />
        <NavProjects projects={data.lists} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
