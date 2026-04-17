export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* TODO: Add AppNav component */}
      <main className="flex-1">{children}</main>
      {/* TODO: Add MobileBottomNav component */}
    </div>
  );
}
