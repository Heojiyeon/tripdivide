"use client";

import { Icon } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { HiOutlineX } from "react-icons/hi";

export default function Modal({ title, children }: { title: string; children: ReactNode }) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg  mx-4 rounded-lg bg-white p-6 shadow-xl">
        <button
          onClick={() => router.back()}
          className="absolute right-4 top-4 text-gray-500 hover:text-black"
        >
          <Icon size={"xl"}>
            <HiOutlineX />
          </Icon>
        </button>
        <h2 className="mb-4 text-xl font-bold">{title}</h2>
        <div>{children}</div>
      </div>
    </div>
  );
}
