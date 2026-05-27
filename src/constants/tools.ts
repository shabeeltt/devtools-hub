export interface Tool {
  name: string;
  description: string;
  href: string;
  icon: string;
}

export const tools: Tool[] = [
  {
    name: "JSON Formatter",
    description:
      "Beautify and validate your JSON data with custom indentation.",
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
    description:
      "Compare text side by side and highlight added, removed, and changed lines.",
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
    description:
      "Test and debug regular expressions visually with real-time highlighting and capture groups.",
    href: "/tools/regex-sandbox",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4a10 10 0 0 0 0 16"/><path d="M16 4a10 10 0 0 1 0 16"/><path d="M9 15h.01"/><path d="M14.5 9v6"/><path d="m12 10.5 5 3"/><path d="m17 10.5-5 3"/></svg>`,
  },
  {
    name: "API Tester (Beta)",
    description:
      "A lightweight, no-fuss client to send REST API requests and instantly inspect JSON responses.",
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
    name: "QR Code Generator",
    description: "Generate QR codes from text or URLs instantly.",
    href: "/tools/qr-code-generator",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>`,
  },
  {
    name: "Text Case Modifier",
    description:
      "Convert text between UPPERCASE, lowercase, Title Case, camelCase, PascalCase, snake_case, and kebab-case.",
    href: "/tools/text-case-modifier",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18V6"/><path d="M4 12h8"/><path d="M12 6v12"/><path d="M17 10h4"/><path d="M19 8v4"/><path d="M17 18h4"/></svg>`,
  },
  {
    name: "Text ↔ Binary Converter",
    description:
      "Convert plain text to binary (0s and 1s) and binary back to readable text instantly.",
    href: "/tools/text-to-binary",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="4" height="4" x="2" y="2" rx="1"/><rect width="4" height="4" x="10" y="2" rx="1"/><rect width="4" height="4" x="18" y="2" rx="1"/><rect width="4" height="4" x="2" y="10" rx="1"/><rect width="4" height="4" x="18" y="10" rx="1"/><rect width="4" height="4" x="10" y="18" rx="1"/><rect width="4" height="4" x="18" y="18" rx="1"/></svg>`,
  },
  {
    name: "Lorem Ipsum Generator",
    description:
      "Generate customizable Lorem Ipsum placeholder text by words, sentences, or paragraphs.",
    href: "/tools/lorem-ipsum-generator",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M4 11h16"/><path d="M4 15h10"/></svg>`,
  },
  {
    name: "QR Code Scanner",
    description:
      "Scan QR codes using your device camera or by uploading a static image. Runs entirely in your browser.",
    href: "/tools/qr-code-scanner",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect width="7" height="7" x="7" y="7" rx="1"/></svg>`,
  },
  {
    name: "SQL Formatter",
    description:
      "Beautify and format raw SQL queries. Capitalizes keywords like SELECT, FROM, WHERE with proper indentation.",
    href: "/tools/sql-formatter",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>`,
  },
];


