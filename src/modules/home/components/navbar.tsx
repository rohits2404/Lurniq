"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";
import { UserDropdown } from "./user-dropdown";

const navigationItems = [
    {
        name: "Home",
        href: "/",
    },
    {
        name: "Courses",
        href: "/courses",
    },
    {
        name: "Dashboard",
        href: "/dashboard",
    },
];

export const Navbar = () => {
    const { data: session, isPending } = authClient.useSession();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
            <div className="container mx-auto grid min-h-16 grid-cols-3 items-center px-4 md:px-6 lg:px-8">
                {/* LEFT - Logo */}
                <div className="flex items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/logo.png"
                            alt="Lurniq"
                            width={36}
                            height={36}
                        />

                        <span className="font-bold">LURNIQ</span>
                    </Link>
                </div>

                {/* CENTER - Navigation */}
                <nav className="hidden md:flex items-center justify-center gap-8">
                    {navigationItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm font-medium transition-colors hover:text-primary"
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* RIGHT - Actions */}
                <div className="hidden md:flex items-center justify-end gap-4">
                    <ThemeToggle />

                    {isPending ? null : session ? (
                        <UserDropdown
                            email={session.user.email}
                            image={
                                session.user.image ??
                                `https://avatar.vercel.sh/rauchg/${session.user.email}`
                            }
                            name={
                                session.user.name &&
                                session.user.name.length > 0
                                    ? session.user.name
                                    : session.user.email.split("@")[0]
                            }
                        />
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className={buttonVariants({
                                    variant: "secondary",
                                })}
                            >
                                Login
                            </Link>

                            <Link href="/login" className={buttonVariants()}>
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};
