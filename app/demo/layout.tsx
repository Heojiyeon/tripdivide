export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex flex-col min-h-screen gap-8 m-8">{children}</div>;
}
