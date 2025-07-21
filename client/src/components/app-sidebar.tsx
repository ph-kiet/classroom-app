"use client";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { FileText, MessageCircle, Users } from "lucide-react";
import { Badge } from "./ui/badge";
import useAuthStore from "@/stores/auth-store";
import { usePathname } from "next/navigation";

export default function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  return (
    <Sidebar className="z-41">
      <SidebarHeader className="py-5 flex-col items-center">
        <span className="text-2xl font-bold">Classroom App</span>
        <Badge variant={"default"} className="capitalize">
          {user?.role}
        </Badge>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs tracking-wider">
            MANAGE
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {user?.role === "instructor" && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/students"}
                  >
                    <Link href={"/students"}>
                      <Users />
                      <span>Students</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/lessons"}>
                  <Link href={"/lessons"}>
                    <FileText />
                    <span>Lessons</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/message"}>
                  <Link href={"/message"}>
                    <MessageCircle />
                    <span>Message</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
