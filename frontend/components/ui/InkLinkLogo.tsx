"use client";

import Image from "next/image";

interface InkLinkLogoProps {
  size?: number;
  className?: string;
  priority?: boolean;
}

export function InkLinkLogo({
  size = 40,
  className = "",
  priority = false,
}: InkLinkLogoProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/icon.svg"
        alt="InkLink Icon"
        width={size}
        height={size}
        priority={priority}
        className="w-full h-full object-contain drop-shadow-[0_4px_8px_rgba(49,46,129,0.25)] rounded-2xl"
      />
    </div>
  );
}
