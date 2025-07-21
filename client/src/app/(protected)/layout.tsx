import AppHeader from "@/components/app-header";
import AppSidebar from "@/components/app-sidebar";
import AuthProvider from "@/components/auth-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AuthProvider>
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full">
            <AppHeader />

            <div className="px-4 pt-5">{children}</div>
          </main>

          <Toaster />
        </SidebarProvider>
      </AuthProvider>
    </>
  );
}
