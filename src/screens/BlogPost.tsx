import Link from "next/link";
import type { BlogPostData } from "@/lib/blog";
import { StackedLogo } from "@/components/StackedLogo";
import { ArrowLeft, Clock, Calendar, Zap, Lightbulb, Info } from "lucide-react";

// ── Syntax highlight helpers ──────────────────────────────────────────────────

function highlightTemplateCode(code: string) {
  // Split into lines and annotate each token
  const lines = code.split("\n");
  return lines.map((line, i) => (
    <div key={i} className="leading-7">
      {tokenizeLine(line)}
    </div>
  ));
}

function tokenizeLine(line: string) {
  // Match {{ ... }}, [[ ... ]], or plain text
  const parts: React.ReactNode[] = [];
  const regex = /(\{\{[^}]*\}\}|\[\[.*?\]\])/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(line)) !== null) {
    if (match.index > last) {
      parts.push(<span key={last}>{line.slice(last, match.index)}</span>);
    }
    const token = match[0];
    if (token.startsWith("{{")) {
      parts.push(
        <span key={match.index} className="text-[hsl(48,95%,62%)] font-semibold">
          {token}
        </span>
      );
    } else {
      parts.push(
        <span key={match.index} className="text-[hsl(173,80%,60%)] font-semibold">
          {token}
        </span>
      );
    }
    last = regex.lastIndex;
  }
  if (last < line.length) {
    parts.push(<span key={last}>{line.slice(last)}</span>);
  }
  return parts;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SyntaxTable({
  rows,
}: {
  rows: { syntax: string; description: string; example: string }[];
}) {
  return (
    <div className="my-10 overflow-x-auto rounded-xl border border-[hsl(240,4%,22%)] shadow-sm">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="bg-[hsl(240,5%,11%)] border-b border-[hsl(240,4%,22%)]">
            <th className="px-4 py-3 text-left font-semibold text-[hsl(234,55%,70%)] tracking-wide uppercase text-[11px]">
              Syntax
            </th>
            <th className="px-4 py-3 text-left font-semibold text-[hsl(234,55%,70%)] tracking-wide uppercase text-[11px]">
              Description
            </th>
            <th className="px-4 py-3 text-left font-semibold text-[hsl(234,55%,70%)] tracking-wide uppercase text-[11px]">
              Example
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`border-b border-[hsl(240,4%,18%)] last:border-0 ${
                i % 2 === 0 ? "bg-[hsl(240,5%,8%)]" : "bg-[hsl(240,5%,9%)]"
              }`}
            >
              <td className="px-4 py-3 align-top">
                <code className="font-mono text-[12px] bg-[hsl(240,5%,14%)] text-[hsl(48,95%,62%)] px-2 py-1 rounded-md whitespace-nowrap">
                  {row.syntax}
                </code>
              </td>
              <td className="px-4 py-3 align-top text-[hsl(0,0%,65%)] leading-relaxed">
                {row.description}
              </td>
              <td className="px-4 py-3 align-top">
                <code className="font-mono text-[11px] text-[hsl(173,80%,60%)] opacity-90">
                  {row.example}
                </code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ExampleBlock({ raw, parsed }: { raw: string; parsed: string }) {
  return (
    <div className="my-12 grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Raw template */}
      <div className="rounded-xl border border-[hsl(240,4%,22%)] overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[hsl(240,5%,11%)] border-b border-[hsl(240,4%,22%)]">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[hsl(345,72%,55%)] opacity-80" />
            <span className="h-3 w-3 rounded-full bg-[hsl(38,92%,50%)] opacity-80" />
            <span className="h-3 w-3 rounded-full bg-[hsl(142,70%,45%)] opacity-80" />
          </div>
          <span className="text-[11px] font-medium text-[hsl(0,0%,40%)] ml-1 font-mono">
            template.txt — raw
          </span>
        </div>
        <pre className="p-4 text-[12.5px] font-mono leading-7 text-[hsl(0,0%,75%)] overflow-x-auto bg-[hsl(240,5%,7%)]">
          {highlightTemplateCode(raw)}
        </pre>
      </div>

      {/* Parsed output */}
      <div className="rounded-xl border border-[hsl(142,50%,30%)] overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[hsl(142,30%,9%)] border-b border-[hsl(142,50%,22%)]">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[hsl(142,70%,45%)] opacity-80" />
            <span className="h-3 w-3 rounded-full bg-[hsl(142,70%,45%)] opacity-50" />
            <span className="h-3 w-3 rounded-full bg-[hsl(142,70%,45%)] opacity-30" />
          </div>
          <span className="text-[11px] font-medium text-[hsl(142,60%,45%)] ml-1 font-mono">
            rendered email ✓
          </span>
        </div>
        <pre className="p-4 text-[12.5px] font-sans leading-7 text-[hsl(0,0%,80%)] whitespace-pre-wrap overflow-x-auto bg-[hsl(240,5%,7%)]">
          {parsed}
        </pre>
      </div>
    </div>
  );
}

function TipBlock({ content, type }: { content: string; type: "tip" | "note" }) {
  const isTip = type === "tip";
  return (
    <div
      className={`my-8 flex gap-3 rounded-xl px-5 py-4 border ${
        isTip
          ? "bg-[hsl(234,40%,12%)] border-[hsl(234,55%,35%)]"
          : "bg-[hsl(38,40%,10%)] border-[hsl(38,80%,35%)]"
      }`}
    >
      <div className="mt-0.5 shrink-0">
        {isTip ? (
          <Lightbulb className="h-4 w-4 text-[hsl(234,70%,65%)]" />
        ) : (
          <Info className="h-4 w-4 text-[hsl(38,90%,60%)]" />
        )}
      </div>
      <p className={`text-[13.5px] leading-relaxed ${isTip ? "text-[hsl(234,30%,75%)]" : "text-[hsl(38,60%,75%)]"}`}>
        {content}
      </p>
    </div>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function BlogPost({ post }: { post: BlogPostData }) {
  return (
    <div className="min-h-screen bg-[hsl(240,6%,5%)] text-[hsl(0,0%,88%)]">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-[hsl(240,4%,15%)] bg-[hsl(240,6%,5%)/90] backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-[hsl(0,0%,45%)] hover:text-[hsl(0,0%,85%)] transition-colors text-[13px]"
          >
            <StackedLogo size={14} color="currentColor" />
            <span className="font-bold uppercase tracking-[0.08em] text-[13px]">Dumpmail</span>
          </Link>

          <Link
            href="/templates"
            className="flex items-center gap-1.5 text-[12px] text-[hsl(234,55%,65%)] hover:text-[hsl(234,55%,80%)] transition-colors font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Templates
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, hsl(234,55%,40%), transparent)",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-6 pt-16 pb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[hsl(234,55%,20%)] border border-[hsl(234,55%,35%)] text-[11px] font-semibold text-[hsl(234,55%,70%)] uppercase tracking-wider">
              <Zap className="h-3 w-3" />
              Guide
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[hsl(0,0%,96%)] leading-[1.15] mb-5">
            {post.title}
          </h1>
          <p className="text-[16px] text-[hsl(0,0%,55%)] leading-relaxed max-w-2xl mb-8">
            {post.description}
          </p>
          <div className="flex items-center gap-5 text-[12px] text-[hsl(0,0%,40%)]">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {post.readingTime}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-[hsl(240,4%,22%)] to-transparent" />
      </div>

      {/* Article body */}
      <article className="max-w-4xl mx-auto px-6 py-14">
        {post.content.map((section, i) => {
          switch (section.type) {
            case "intro":
              return (
                <p
                  key={i}
                  className="text-[15.5px] text-[hsl(0,0%,65%)] leading-[1.85] mb-14 font-light border-l-2 border-[hsl(234,55%,45%)] pl-5 italic"
                >
                  {section.content}
                </p>
              );
            case "heading":
              return (
                <h2
                  key={i}
                  className="text-[22px] font-bold text-[hsl(0,0%,92%)] mt-16 mb-5 pb-3 border-b border-[hsl(240,4%,18%)] tracking-tight"
                >
                  {section.content}
                </h2>
              );
            case "paragraph":
              return (
                <p
                  key={i}
                  className="text-[14.5px] text-[hsl(0,0%,60%)] leading-[1.9] mb-8"
                >
                  {section.content}
                </p>
              );
            case "syntax-table":
              return <SyntaxTable key={i} rows={section.rows!} />;
            case "example-block":
              return (
                <ExampleBlock key={i} raw={section.raw!} parsed={section.parsed!} />
              );
            case "tip":
              return <TipBlock key={i} content={section.content!} type="tip" />;
            case "note":
              return <TipBlock key={i} content={section.content!} type="note" />;
            default:
              return null;
          }
        })}
      </article>

      {/* Footer CTA */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <div className="rounded-2xl border border-[hsl(234,40%,28%)] bg-gradient-to-br from-[hsl(234,40%,10%)] to-[hsl(240,6%,7%)] p-8 text-center">
          <h3 className="text-[20px] font-bold text-[hsl(0,0%,92%)] mb-2">
            Ready to write your first template?
          </h3>
          <p className="text-[13.5px] text-[hsl(0,0%,50%)] mb-6">
            Head back to the Templates page and start crafting personalized outreach.
          </p>
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[hsl(234,55%,55%)] hover:bg-[hsl(234,55%,62%)] text-white font-semibold text-[14px] transition-all duration-200 shadow-lg shadow-[hsl(234,55%,20%)/50] hover:shadow-[hsl(234,55%,20%)/70] hover:scale-[1.02] active:scale-[0.99]"
          >
            <Zap className="h-4 w-4" />
            Go to Templates
          </Link>
        </div>
      </div>
    </div>
  );
}
