"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

export function BreadcrumbWithPath() {
  const pathname = usePathname();
  const crumbs = pathname.substring(1).split("/");

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.map((crumb, index) => (
            <Fragment key={crumb}>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={`/${crumb}`}>
                  <p>{crumb}</p>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index < crumbs.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
