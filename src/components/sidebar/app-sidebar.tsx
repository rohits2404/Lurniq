"use client";

import * as React from "react";
import { IconDashboard, IconListDetails } from "@tabler/icons-react";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";
import Image from "next/image";

const data = {
    navMain: [
        {
            title: "Dashboard",
            url: "/admin",
            icon: IconDashboard,
        },
        {
            title: "Courses",
            url: "/admin/courses",
            icon: IconListDetails,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader className="px-3 pt-3 pb-5">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="
                h-10
                px-2
                data-[slot=sidebar-menu-button]:p-1.5!
              "
                        >
                            <Link href="/">
                                <Image
                                    src="/logo.png"
                                    alt="Lurniq"
                                    width={24}
                                    height={24}
                                    className="rounded-md"
                                />

                                <span className="text-base font-semibold tracking-tight">
                                    LURNIQ
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-2">
                <div className="space-y-2">
                    <p className="px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                        Workspace
                    </p>

                    <NavMain items={data.navMain} />
                </div>
            </SidebarContent>

            <SidebarFooter className="px-2 pb-3 pt-5">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
