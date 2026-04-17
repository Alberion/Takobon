import { BottomNav } from "@/components/takobon/nav/bottom-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <main className="flex-1 pb-16">{children}</main>
      <BottomNav />
    </div>
  );
}
