export interface Tool {
  name: string;
  description: string;
  href: string;
  icon: string;
}

export const tools: Tool[] = [
  {
    name: "JSON Formatter",
    description: "Beautify and validate your JSON data with custom indentation.",
    href: "/tools/json-formatter",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 6c-2 0-2 3-2 6s0 6 2 6"/><path d="M16 6c2 0 2 3 2 6s0 6-2 6"/><path d="M12 8v8"/></svg>`,
  },
  {
    name: "Base64 Encoder & Decoder",
    description: "Encode and decode Base64 strings easily.",
    href: "/tools/base64-converter",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M4 12h10M4 17h6"/><path d="M18 12l3 3-3 3"/></svg>`,
  },
  {
    name: "URL Encoder & Decoder",
    description: "Encode and decode URL-safe text and query strings.",
    href: "/tools/url-converter",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l2-2a5 5 0 0 0-7.07-7.07l-1.14 1.14"/><path d="M14 11a5 5 0 0 0-7.54-.54l-2 2a5 5 0 0 0 7.07 7.07l1.14-1.14"/></svg>`,
  },
  {
    name: "Diff Checker",
    description: "Compare text side by side and highlight added, removed, and changed lines.",
    href: "/tools/diff-checker",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4v16"/><path d="M18 4v16"/><path d="M9 8h4"/><path d="M11 12h4"/><path d="M9 16h6"/></svg>`,
  },
  {
    name: "UUID Generator",
    description: "Generate UUID v4 values instantly",
    href: "/tools/uuid-generator",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>`,
  },
  {
    name: "JWT Decoder",
    description: "Decode and inspect JSON Web Tokens locally.",
    href: "/tools/jwt-decoder",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
  },
  {
    name: "Unix Timestamp Converter",
    description: "Convert timestamps to readable dates and back.",
    href: "/tools/timestamp-converter",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  },
  {
    name: "Hash Generator",
    description: "Generate SHA-1, SHA-256, and SHA-512 hashes securely.",
    href: "/tools/hash-generator",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
  },
  {
    name: "Regex Sandbox",
    description: "Test and debug regular expressions visually with real-time highlighting and capture groups.",
    href: "/tools/regex-sandbox",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4a10 10 0 0 0 0 16"/><path d="M16 4a10 10 0 0 1 0 16"/><path d="M9 15h.01"/><path d="M14.5 9v6"/><path d="m12 10.5 5 3"/><path d="m17 10.5-5 3"/></svg>`,
  },
  {
    name: "API Tester (Beta)",
    description: "A lightweight, no-fuss client to send REST API requests and instantly inspect JSON responses.",
    href: "/tools/api-tester",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>`,
  },
  {
    name: "JSON Model Generator",
    description: "Convert JSON into TypeScript interfaces and Dart classes.",
    href: "/tools/json-model-generator",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6c-2 0-2 3-2 6s0 6 2 6"/><path d="M16 6c2 0 2 3 2 6s0 6-2 6"/><path d="M12 8h.01"/><path d="M12 12h.01"/><path d="M12 16h.01"/></svg>`,
  },
  {
    name: "Cron Expression Generator",
    description: "Build, validate, and understand cron expressions with a visual editor and plain English explanations.",
    href: "/tools/cron-generator",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/><path d="M4 4l3 3"/><path d="M20 4l-3 3"/></svg>`,
  },
  {
    name: "QR Code Generator",
    description: "Generate QR codes from text or URLs instantly.",
    href: "/tools/qr-code-generator",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>`,
  },
  {
    name: "Text Case Modifier",
    description: "Convert text between UPPERCASE, lowercase, Title Case, camelCase, PascalCase, snake_case, and kebab-case.",
    href: "/tools/text-case-modifier",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18V6"/><path d="M4 12h8"/><path d="M12 6v12"/><path d="M17 10h4"/><path d="M19 8v4"/><path d="M17 18h4"/></svg>`,
  },
  {
    name: "Text ↔ Binary Converter",
    description: "Convert plain text to binary (0s and 1s) and binary back to readable text instantly.",
    href: "/tools/text-to-binary",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="4" height="4" x="2" y="2" rx="1"/><rect width="4" height="4" x="10" y="2" rx="1"/><rect width="4" height="4" x="18" y="2" rx="1"/><rect width="4" height="4" x="2" y="10" rx="1"/><rect width="4" height="4" x="18" y="10" rx="1"/><rect width="4" height="4" x="10" y="18" rx="1"/><rect width="4" height="4" x="18" y="18" rx="1"/></svg>`,
  },
  {
    name: "Lorem Ipsum Generator",
    description: "Generate customizable Lorem Ipsum placeholder text by words, sentences, or paragraphs.",
    href: "/tools/lorem-ipsum-generator",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M4 11h16"/><path d="M4 15h10"/></svg>`,
  },
  {
    name: "Color Converter",
    description: "Convert colors between HEX, RGB, HSL, and CSS named formats with a live preview.",
    href: "/tools/color-converter",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="3"/><circle cx="7.5" cy="13.5" r="3"/><circle cx="16.5" cy="16.5" r="3"/><path d="M10 11.2 12 13"/><path d="M10.4 15.6 12.6 14"/><path d="M15.2 14 16 15.4"/></svg>`,
  },
  {
    name: "Gitignore Generator",
    description: "Generate a customized, production-ready .gitignore file based on the technology you use.",
    href: "/tools/gitignore-generator",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>`,
  },
  {
    name: "Markdown Preview",
    description: "Live preview your Markdown as HTML with real-time rendering and sanitized output.",
    href: "/tools/markdown-preview",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  },
  {
    name: "Curl to Fetch",
    description: "Convert curl commands into JavaScript fetch requests.",
    href: "/tools/curl-to-fetch",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 9h8"/><path d="M8 15h8"/><path d="M11 4 7 20"/><path d="M17 4l-4 16"/></svg>`,
  },
  {
    name: "JSON ↔ CSV Converter",
    description: "Convert JSON arrays to CSV and CSV data back into JSON instantly.",
    href: "/tools/json-csv-converter",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v18"/><path d="M16 3v18"/><path d="M3 8h18"/><path d="M3 16h18"/><path d="m10 10 4 4"/><path d="m14 10-4 4"/></svg>`,
  },
  {
    name: "SQL Formatter",
    description: "Beautify your raw SQL queries with clean spacing and line breaks automatically.",
    href: "/tools/sql-formatter",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16"/><path d="M4 12h10"/><path d="M4 17h16"/></svg>`,
  },
  {
    name: "XML Formatter",
    description: "Format and validate XML with clean readable output.",
    href: "/tools/xml-formatter",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 9 4 12l4 3"/><path d="m16 9 4 3-4 3"/><path d="m14 4-4 16"/></svg>`,
  },
  {
    name: "CSS Unit Converter",
    description: "Convert between px, em, rem, %, vw and vh units.",
    href: "/tools/css-unit-converter",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 12h8"/><path d="M12 8v8"/><circle cx="12" cy="12" r="9"/></svg>`,
  },
  {
    name: "CSS Gradient Generator",
    description: "Generate CSS gradients visually with live preview and exportable CSS code.",
    href: "/tools/css-gradient-generator",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="M2 12h4"/><path d="M18 12h4"/></svg>`,
  },
  {
    name: "Password Generator",
    description: "Generate secure random passwords with customizable length and character options.",
    href: "/tools/password-generator",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v22"/><path d="M5 8h14"/><path d="M5 16h14"/><circle cx="12" cy="12" r="10"/></svg>`,
  },
  {
    name: "Password Strength Checker",
    description: "Evaluate password strength locally with instant feedback and clear improvement suggestions.",
    href: "/tools/password-strength-checker",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19h14"/><path d="M8 15h1"/><path d="M8 11h3"/><path d="M8 7h5"/><path d="M18 5v14"/></svg>`,
  },
  {
  name: "HTML Live Preview",
  description: "Preview HTML instantly with safe browser-side rendering.",
  href: "/tools/html-live-preview",
  icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 9 4 12l4 3"/><path d="m16 9 4 3-4 3"/><path d="M14 4h6"/><path d="M14 20h6"/></svg>`,
},
{
  name: "SQL Formatter",
  description:
    "Beautify your raw SQL queries with clean spacing and line breaks automatically.",
  href: "/tools/sql-formatter",
  icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16"/><path d="M4 12h10"/><path d="M4 17h16"/></svg>`,
},
{
  name: "XML Formatter",
  description: "Format and validate XML with clean readable output.",
  href: "/tools/xml-formatter",
  icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 9 4 12l4 3"/><path d="m16 9 4 3-4 3"/><path d="m14 4-4 16"/></svg>`,
},
{
  name: "CSS Unit Converter",
  description: "Convert between px, em, rem, %, vw and vh units.",
  href: "/tools/css-unit-converter",
  icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 12h8"/><path d="M12 8v8"/><circle cx="12" cy="12" r="9"/></svg>`,
},
{
  name: "CSS Gradient Generator",
  description:
    "Generate CSS gradients visually with live preview and exportable CSS code.",
  href: "/tools/css-gradient-generator",
  icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="M2 12h4"/><path d="M18 12h4"/></svg>`,
},
  {
    name: "Color Palette Generator",
    description:
      "Generate beautiful color schemes with different harmonies and export them, or create multi-stop CSS gradients.",
    href: "/tools/color-palette-generator",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.3442 19.4856 6.0964 19.3496 6.3683 18.7297C6.73286 17.8986 7.55998 17.3333 8.5 17.3333H9.83333C10.7558 17.3333 11.5 18.0775 11.5 19V20.8333C11.5 21.4777 11.7589 21.9841 12 22Z"/><circle cx="7.5" cy="10.5" r="1.5" fill="currentColor"/><circle cx="11.5" cy="7.5" r="1.5" fill="currentColor"/><circle cx="16.5" cy="9.5" r="1.5" fill="currentColor"/><circle cx="15.5" cy="14.5" r="1.5" fill="currentColor"/></svg>`,
  },
  {
    name: "CSS Grid Generator",
    description:
      "Visually configure CSS Grid layouts and generate copyable CSS with live preview.",
    href: "/tools/grid-generator",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="8"/><rect x="3" y="13" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/></svg>`,
  },
  {
    name: "CSS Gradient Generator",
    description:
      "Generate CSS gradients visually with live preview and exportable CSS code.",
    href: "/tools/css-gradient-generator",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="M2 12h4"/><path d="M18 12h4"/></svg>`,
  },
  {
    name: "CSS Animation Generator",
    description:
      "Visually design CSS animations with delay, duration, easing, and direction controls, and copy the generated CSS & keyframes.",
    href: "/tools/css-animation-generator",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/><polygon points="10 8 16 12 10 16 10 8"/></svg>`,
  },
];
