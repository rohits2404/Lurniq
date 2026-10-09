"use client";

import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavMain({
    items,
}: {
    items: {
        title: string;
        url: string;
        icon?: Icon;
    }[];
}) {
    const pathname = usePathname();

    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-5">
                {/* Quick Create */}
                {pathname.startsWith("/admin") && (
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                tooltip="Quick Create"
                                className="
                  h-10
                  bg-primary
                  text-primary-foreground
                  hover:bg-primary/90
                  hover:text-primary-foreground
                  active:bg-primary/90
                  active:text-primary-foreground
                  transition-colors
                "
                            >
                                <Link href="/admin/courses/create">
                                    <IconCirclePlusFilled className="size-4" />
                                    <span>Quick Create</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                )}

                {/* Main Navigation */}
                <SidebarMenu className="gap-1.5">
                    {items.map((item) => {
                        const isActive = pathname === item.url;

                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    tooltip={item.title}
                                    asChild
                                    className={cn(
                                        "h-10 transition-colors",
                                        isActive &&
                                            "bg-accent text-accent-foreground",
                                    )}
                                >
                                    <Link href={item.url}>
                                        {item.icon && (
                                            <item.icon
                                                className={cn(
                                                    "size-4",
                                                    isActive && "text-primary",
                                                )}
                                            />
                                        )}

                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
