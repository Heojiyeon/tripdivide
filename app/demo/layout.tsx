import BackButton from "./_components/BackButton";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <div className="w-fit m-4 justify-start">
        <BackButton fallbackHref="/" />
      </div>
      <div className="flex flex-col mx-8 gap-8">{children}</div>
    </div>
  );
}
