export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <div className="flex flex-col mx-8 gap-8">{children}</div>
    </div>
  );
}
