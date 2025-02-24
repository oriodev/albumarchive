// SHADCN IMPORTS.
import { AppSidebar } from "@/components/containers/app-sidebar";
import { BreadcrumbWithPath } from "@/components/general/breadcrumb-with-path";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { UserProvider } from "@/utils/providers/UserProvider";
import { WebsocketProvider } from "@/utils/providers/WebsocketProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <UserProvider>
        <WebsocketProvider>
          <SidebarProvider>
            {/* SIDEBAR. */}
            <AppSidebar />

            {/* MAIN BODY. */}
            <SidebarInset>
              {/* HEADER. */}
              <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />

                  {/* BREADCRUMB. */}
                  <BreadcrumbWithPath />
                </div>
              </header>

              {/* PAGE CONTENT. */}
              <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </WebsocketProvider>
      </UserProvider>
    </div>
  );
}
