"use client";

import clsx from "clsx";
import { normalizeContentFormat, renderRichContent } from "@/lib/richText";

type BlogContentProps = {
  content: string;
  format?: string;
  className?: string;
};

export default function BlogContent({
  content,
  format = "markdown",
  className,
}: BlogContentProps) {
  return (
    <div
      className={clsx(
        "space-y-5 text-[15px] leading-8 text-gray-300",
        "[&_a]:transition-colors [&_a:hover]:text-white",
        "[&_blockquote]:rounded-3xl [&_blockquote]:border [&_blockquote]:border-accent-cyan/15 [&_blockquote]:bg-accent-cyan/[0.05] [&_blockquote]:px-5 [&_blockquote]:py-4",
        "[&_code]:break-words",
        "[&_h1]:font-display [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:text-white",
        "[&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-white",
        "[&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-white",
        "[&_hr]:my-8 [&_hr]:border-white/10",
        "[&_img]:w-full [&_img]:overflow-hidden [&_img]:rounded-3xl [&_img]:object-cover",
        "[&_ol]:list-decimal [&_ol]:pl-6",
        "[&_p]:text-gray-300",
        "[&_pre]:overflow-x-auto [&_pre]:rounded-3xl [&_pre]:border [&_pre]:border-white/10 [&_pre]:bg-dark-900/80 [&_pre]:p-5 [&_pre]:text-sm",
        "[&_strong]:font-semibold [&_strong]:text-white",
        "[&_ul]:list-disc [&_ul]:pl-6",
        className,
      )}
      dangerouslySetInnerHTML={{
        __html: renderRichContent(content, normalizeContentFormat(format)),
      }}
    />
  );
}
