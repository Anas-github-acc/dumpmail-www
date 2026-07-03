export interface BlogPostData {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readingTime: string;
  content: BlogSection[];
}

export interface BlogSection {
  type: "intro" | "heading" | "paragraph" | "syntax-table" | "example-block" | "tip" | "note" | "parsed-example";
  content?: string;
  rows?: { syntax: string; description: string; example: string }[];
  raw?: string;
  parsed?: string;
  variables?: { key: string; value: string }[];
}

const templateSyntaxPost: BlogPostData = {
  slug: "template-syntax",
  title: "How to Write Email Templates Effectively",
  description:
    "Master Dumpmail's template syntax — dynamic expressions with {{ }} and rotating variants with [[ ]] — to craft personalized, spam-safe outreach emails at scale.",
  publishedAt: "2026-07-03",
  readingTime: "5 min read",
  content: [
    {
      type: "intro",
      content:
        "Dumpmail templates give you two powerful primitives: JavaScript expressions inside {{ }} and random-variant selectors inside [[ ]]. Together they let you write emails that feel genuinely personal to every recipient — while staying out of Gmail's spam folder.",
    },
    {
      type: "heading",
      content: "The Syntax at a Glance",
    },
    {
      type: "syntax-table",
      rows: [
        {
          syntax: "{{ expression }}",
          description:
            "Evaluate any JavaScript expression and insert its result. Variables like lead, name, company, role, topic are available.",
          example: "{{ lead.split(' ')[0] }} → first name only",
        },
        {
          syntax: '[[ "A", "B", "C" ]]',
          description:
            "Randomly pick one option each time the template is sent. Keeps every email unique so inbox providers don't flag you for bulk sending.",
          example: '[[ "Hi", "Hello", "Hey" ]] → picks one',
        },
      ],
    },
    {
      type: "heading",
      content: "Why [[ ]] Matters",
    },
    {
      type: "paragraph",
      content:
        "Gmail, Yahoo, and Outlook all fingerprint outgoing emails. If you send the exact same message 500 times, your domain reputation tanks and your emails land in spam. The [[ ]] selector rotates words, phrases, and full sentences — introducing natural variation in each send, so every email looks handcrafted.",
    },
    {
      type: "heading",
      content: "Available Variables",
    },
    {
      type: "paragraph",
      content:
        "The following variables are automatically injected when a template is rendered against a lead row. You reference them inside {{ }} expressions.",
    },
    {
      type: "syntax-table",
      rows: [
        { syntax: "{{ lead }}", description: "Full name of the lead (e.g. Alex Leigh)", example: "Alex Leigh" },
        { syntax: "{{ company }}", description: "Company name of the lead", example: "Acme Corp" },
        { syntax: "{{ role }}", description: "Role / job title of the lead", example: "CTO" },
        { syntax: "{{ name }}", description: "Your name (from Global Variables)", example: "Mohd Anas" },
        { syntax: "{{ signature }}", description: "Your email signature (from Global Variables)", example: "Mohd Anas\\nGithub…" },
        { syntax: "{{ topic }}", description: "Any custom variable you define on the template", example: "backend development" },
      ],
    },
    {
      type: "heading",
      content: "Full Example",
    },
    {
      type: "paragraph",
      content:
        "Here's a complete cold-outreach template using both {{ }} expressions and [[ ]] selectors. The variables block on the left shows what's defined; the rendered output on the right shows one possible email that could be generated.",
    },
    {
      type: "example-block",
      raw: `variables = {
  lead: "Alex Leigh"
  name: "Mohd Anas"
  topic: "backend development"
  signature: "Mohd Anas\\nGithub - https://github.com/Anas-github-acc\\nLinkedin - https://linkedin.com/in/anas-um"
}

Hi {{ lead.split(' ')[0] }},

[["Hope you're doing well,", "Hope you're having a great week.", "Hope all is well."]]

I am {{ name }} and [["I wanted to connect regarding {{topic}}", "Reaching out about {{topic}}.", "Quick note about {{topic}}."]]

[["Interested in a quick chat?", "Open to a brief conversation?", "Worth a quick discussion?"]]

Best,
{{signature}}`,
      parsed: `Hi Alex,

Hope all is well.

I am Mohd Anas and Quick note about backend development.

Worth a quick discussion?

Best,
Mohd Anas
Github - https://github.com/Anas-github-acc
Linkedin - https://linkedin.com/in/anas-um`,
    },
    {
      type: "heading",
      content: "Tips for Great Templates",
    },
    {
      type: "tip",
      content:
        "Use {{ lead.split(' ')[0] }} to greet by first name — it's more natural than the full name and increases reply rates.",
    },
    {
      type: "tip",
      content:
        "Add at least 3 options inside [[ ]] for opening lines, value propositions, and CTAs. More variants = more uniqueness = better deliverability.",
    },
    {
      type: "note",
      content:
        "The {{ }} block supports any valid JavaScript expression. You can call string methods (toUpperCase, trim, slice), use ternary operators, or even template literals — whatever makes your email smarter.",
    },
    {
      type: "tip",
      content:
        "Set your name and signature once in Global Variables (Settings → Global Variables on the Templates page) so every template automatically uses them without repeating yourself.",
    },
  ],
};

const posts: Record<string, BlogPostData> = {
  "template-syntax": templateSyntaxPost,
};

export const allBlogSlugs = Object.keys(posts);

export function getBlogPost(slug: string): BlogPostData | undefined {
  return posts[slug];
}
