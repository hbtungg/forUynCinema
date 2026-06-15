"use client";

import Link from "next/link";
import { getCurrentEvent } from "@/lib/eventNavigation";

export default function EventButton() {
  const event = getCurrentEvent();

  return (
    <Link
      href={event.href}
      aria-label={`Mở sự kiện ${event.label}`}
      title={event.label}
      className="w-9 h-9 hidden md:flex items-center justify-center rounded-xl text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-all flex-shrink-0"
    >
      <TrophyIcon />
    </Link>
  );
}

function TrophyIcon() {
  return (
    <svg
      width="17"
      height="17"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 9H4.5A2.5 2.5 0 0 1 2 6.5v0A2.5 2.5 0 0 1 4.5 4H6M18 9h1.5A2.5 2.5 0 0 0 22 6.5v0A2.5 2.5 0 0 0 19.5 4H18"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15v4M9 20h6M12 2v2"
      />
    </svg>
  );
}