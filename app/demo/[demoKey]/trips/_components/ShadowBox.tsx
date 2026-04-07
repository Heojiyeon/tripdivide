import { ReactNode } from "react";

export default function ShadowBox({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-300 py-16 text-center">
      {children}
    </div>
  );
}
