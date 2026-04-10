import BackButton from "./_components/BackButton";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="w-full justify-start m-4">
        <BackButton fallbackHref="/" />
      </div>
      <div className="flex flex-col min-h-screen gap-8 m-8">{children}</div>
    </>
  );
}
