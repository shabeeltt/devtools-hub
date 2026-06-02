# 🛠️ DevToolsHub

DevToolsHub is a collection of 20+ developer tools built with Astro, React, and Tailwind CSS.

It provides simple utilities for formatting, converting, generating, testing, and working with common developer data directly in the browser.

**Live Demo:** https://devtools-hub-beryl.vercel.app/

![DevToolsHub Homepage](./public/assets/images/homepage.png)

_DevToolsHub Home - A collection of developer tools with a clean and responsive interface._

---

## ✨ Included Tools

DevToolsHub currently includes tools such as:

- JSON Formatter
- Base64 Encoder & Decoder
- URL Encoder & Decoder
- Diff Checker
- UUID Generator
- JWT Decoder
- Unix Timestamp Converter
- Hash Generator
- Regex Sandbox
- API Tester
- JSON Model Generator
- Cron Expression Generator
- QR Code Generator
- Text Case Modifier
- Text ↔ Binary Converter
- Lorem Ipsum Generator
- Color Converter
- Gitignore Generator
- Markdown Preview
- Curl to Fetch

New tools are added regularly through community contributions.

---

## 📸 App Screenshots

Here is a look at some of the tools available in DevToolsHub.

### 📝 JSON Formatter

![JSON Formatter](./public/assets/images/json-formatter.png)

_Format, validate, and beautify raw JSON instantly._

### 🔍 Diff Checker

![Diff Checker](./public/assets/images/diff-checker.png)

_Compare text, code, JSON, or configuration files side by side._

### 🆔 UUID Generator

![UUID Generator](./public/assets/images/uuid-generator.png)

_Generate secure UUID v4 values with a single click._

---

## 🔒 Privacy

DevToolsHub is designed to run directly in the browser.

- Most tools work entirely client-side.
- No account is required.
- The project is open source.
- You can inspect the source code and see how every tool works.

---

## 🧰 Tech Stack

- Astro
- React
- TypeScript
- Tailwind CSS
- pnpm

---

## 📂 Project Structure

```text
src/
  ├── components/tool/  shared tool wrappers
  ├── features/         tool logic and UI
  ├── ui/               reusable UI components
  ├── layouts/          page layouts
  ├── pages/            routes and tool pages
  └── styles/           global styles
```

---

## 🚀 Getting Started

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

---

## ➕ Adding a New Tool

Want to contribute a new tool?

1. Create a new feature inside `src/features/`.
2. Reuse components from `src/ui/` and `src/components/tool/`.
3. Create a page inside `src/pages/tools/`.
4. Add the tool entry to `src/constants/tools.ts`.

Try to keep tools simple, fast, and browser-based whenever possible.

---

## 🤝 Contributing

Contributions of all sizes are welcome.

You can help by:

- Adding new tools
- Fixing bugs
- Improving UI and UX
- Improving documentation
- Updating screenshots
- Reviewing pull requests

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request.

---

## 📄 License

This project is open source and available under the [MIT License](./LICENSE).
