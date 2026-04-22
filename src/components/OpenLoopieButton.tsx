"use client";

import type { ReactNode } from "react";

type OpenLoopieButtonProps = {
  children: ReactNode;
  className?: string;
};

export default function OpenLoopieButton({
  children,
  className = "",
}: OpenLoopieButtonProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        const chatButton = document.querySelector(
          '[aria-label="Chat with Loopie"]',
        ) as HTMLElement | null;

        chatButton?.click();
      }}
    >
      {children}
    </button>
  );
}
