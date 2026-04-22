export type ContentFormat = "markdown" | "html";

export function normalizeContentFormat(value: unknown): ContentFormat {
  return value === "html" ? "html" : "markdown";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeUrl(rawUrl: string) {
  const value = rawUrl.trim();

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return "#";
}

function formatInlineMarkdown(value: string) {
  let output = escapeHtml(value);

  output = output.replace(
    /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g,
    (_match, altText: string, url: string) =>
      `<img src="${sanitizeUrl(url)}" alt="${escapeHtml(altText)}" class="my-4 rounded-3xl border border-white/10" />`,
  );

  output = output.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    (_match, label: string, url: string) =>
      `<a href="${sanitizeUrl(url)}" target="_blank" rel="noreferrer" class="font-medium text-accent-cyan underline decoration-accent-cyan/40 underline-offset-4">${escapeHtml(label)}</a>`,
  );

  output = output.replace(
    /`([^`]+)`/g,
    (_match, code: string) =>
      `<code class="rounded-lg bg-white/[0.06] px-2 py-1 font-mono text-[0.95em] text-accent-cyan">${code}</code>`,
  );

  output = output.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  output = output.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  output = output.replace(/~~([^~]+)~~/g, "<del>$1</del>");

  return output;
}

function markdownToHtml(markdown: string) {
  const normalized = markdown.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  const output: string[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let quoteLines: string[] = [];
  let codeLines: string[] = [];
  let inCodeBlock = false;

  const flushParagraph = () => {
    if (paragraph.length === 0) {
      return;
    }

    output.push(
      `<p>${formatInlineMarkdown(paragraph.join(" ").trim())}</p>`,
    );
    paragraph = [];
  };

  const flushList = () => {
    if (!listType || listItems.length === 0) {
      return;
    }

    output.push(
      `<${listType} class="space-y-2">${listItems
        .map((item) => `<li>${formatInlineMarkdown(item)}</li>`)
        .join("")}</${listType}>`,
    );
    listItems = [];
    listType = null;
  };

  const flushQuote = () => {
    if (quoteLines.length === 0) {
      return;
    }

    output.push(
      `<blockquote>${quoteLines
        .map((line) => `<p>${formatInlineMarkdown(line)}</p>`)
        .join("")}</blockquote>`,
    );
    quoteLines = [];
  };

  const flushCodeBlock = () => {
    if (codeLines.length === 0) {
      return;
    }

    output.push(
      `<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`,
    );
    codeLines = [];
  };

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      flushParagraph();
      flushList();
      flushQuote();

      if (inCodeBlock) {
        flushCodeBlock();
      }

      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      flushQuote();
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      flushQuote();

      const level = Math.min(headingMatch[1].length, 6);
      output.push(
        `<h${level}>${formatInlineMarkdown(headingMatch[2])}</h${level}>`,
      );
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      flushParagraph();
      flushList();
      flushQuote();
      output.push("<hr />");
      continue;
    }

    const unorderedMatch = trimmed.match(/^[-*]\s+(.*)$/);
    if (unorderedMatch) {
      flushParagraph();
      flushQuote();

      if (listType !== "ul") {
        flushList();
        listType = "ul";
      }

      listItems.push(unorderedMatch[1]);
      continue;
    }

    const orderedMatch = trimmed.match(/^\d+\.\s+(.*)$/);
    if (orderedMatch) {
      flushParagraph();
      flushQuote();

      if (listType !== "ol") {
        flushList();
        listType = "ol";
      }

      listItems.push(orderedMatch[1]);
      continue;
    }

    const quoteMatch = trimmed.match(/^>\s?(.*)$/);
    if (quoteMatch) {
      flushParagraph();
      flushList();
      quoteLines.push(quoteMatch[1]);
      continue;
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();
  flushQuote();
  flushCodeBlock();

  return output.join("");
}

function sanitizeHtml(html: string) {
  let output = html;

  output = output.replace(
    /<(script|style|iframe|object|embed|form|link|meta|base)[^>]*>[\s\S]*?<\/\1>/gi,
    "",
  );
  output = output.replace(/<(script|style|iframe|object|embed|form|link|meta|base)[^>]*\/?>/gi, "");
  output = output.replace(/\son[a-z]+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, "");
  output = output.replace(/\sstyle\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, "");
  output = output.replace(
    /\s(href|src)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/gi,
    (_match, attribute: string, _fullValue: string, doubleQuoted: string, singleQuoted: string, unquoted: string) => {
      const rawValue = doubleQuoted || singleQuoted || unquoted || "";
      return ` ${attribute}="${sanitizeUrl(rawValue)}"`;
    },
  );

  return output;
}

export function renderRichContent(
  content: string,
  format: ContentFormat = "markdown",
) {
  return format === "html"
    ? sanitizeHtml(content)
    : markdownToHtml(content);
}

export function toPlainText(
  content: string,
  format: ContentFormat = "markdown",
) {
  const html = renderRichContent(content, format);

  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}
