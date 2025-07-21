"use client";

import { PanelLeftIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useSidebar } from "./ui/sidebar";
import AppUser from "./app-user";

export default function AppHeader() {
  const { toggleSidebar } = useSidebar();
  return (
    <div className="sticky top-0 z-40">
      <header className="bg-background/50 flex w-full h-14 items-center justify-between gap-3 px-4 backdrop-blur-xl lg:h-[60px] ">
        <Button onClick={toggleSidebar} size="icon" variant="outline">
          <PanelLeftIcon />
        </Button>

        <AppUser />
      </header>
    </div>
  );
}
