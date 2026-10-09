import { Navbar } from "@/modules/home/components/navbar";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-dvh flex-col overflow-hidden">
            <Navbar />
            <main className="container mx-auto min-h-0 flex-1 px-4 md:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
