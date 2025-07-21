import { Toaster } from "@/components/ui/sonner";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex items-center justify-center py-4 lg:h-screen">
        {children}
      </div>
      <Toaster />
    </>
  );
}
