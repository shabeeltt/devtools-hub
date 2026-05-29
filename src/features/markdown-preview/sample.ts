export const sampleMarkdown = `# 🚀 Markdown Preview

A **real-time** Markdown editor with **syntax highlighting** and a GitHub-style preview — all running entirely on your machine. No data ever leaves your browser.

---

## ✨ Features

| Capability            | Details                                |
|-----------------------|----------------------------------------|
| Live Preview          | Updates as you type, zero delay        |
| Syntax Highlighting   | 24+ programming languages supported    |
| GitHub-style Theme    | Clean typography, dark & light modes   |
| Export as .md         | Download your Markdown source anytime  |
| Word / Char / Line Count | Real-time statistics in the preview |
| XSS Protection        | DOMPurify sanitizes all rendered HTML  |

---

## 📝 Text Formatting

**Bold**, *Italic*, ~~Strikethrough~~, \`inline code\`, and [hyperlinks](https://example.com).

You can also use _italic with underscores_ and **bold with double asterisks**.

---

## 📐 Heading Levels

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

---

## 💬 Blockquotes

> Single line blockquote.

> Multi-line blockquote with **nested formatting** and \`inline code\`.
>
> > Nested blockquote (quote inside a quote).
>
> Back to the outer level — last line.

---

## 📋 Lists

### Unordered

- Item A
- Item B
  - Nested item
    - Deeply nested
- Item C

### Ordered

1. First step
2. Second step
   1. Sub-step A
   2. Sub-step B
3. Third step

### Mixed

1. Learn Markdown
   - Syntax basics
   - Practice daily
2. Build something
   - \`git init\`
   - \`npm start\`

---

## 🖥️ Code Blocks — Syntax Highlighting

### JavaScript

\`\`\`javascript
// Recursive Fibonacci with memoization
function fib(n, memo = {}) {
  if (n in memo) return memo[n]
  if (n <= 1) return n
  memo[n] = fib(n - 1, memo) + fib(n - 2, memo)
  return memo[n]
}
console.log('fib(10) =', fib(10))
// → fib(10) = 55
\`\`\`

### TypeScript

\`\`\`typescript
interface Todo {
  id: number
  title: string
  completed: boolean
}

async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch('/api/todos')
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}
\`\`\`

### Python

\`\`\`python
from dataclasses import dataclass

@dataclass
class Point:
    x: float
    y: float

    def distance_to(self, other: "Point") -> float:
        return ((self.x - other.x)**2 + (self.y - other.y)**2)**0.5

p1 = Point(0, 0)
p2 = Point(3, 4)
print(f"Distance: {p1.distance_to(p2)}")  # → 5.0
\`\`\`

### Go

\`\`\`go
package main

import (
  "fmt"
  "time"
)

func main() {
  now := time.Now()
  fmt.Printf("Hello, DevTools Hub! (%s)\\n", now.Format(time.RFC1123))
}
\`\`\`

### Rust

\`\`\`rust
fn is_even(n: u32) -> bool {
  n % 2 == 0
}

fn main() {
  let nums = 1..=10;
  let evens: Vec<u32> = nums.filter(|&n| is_even(n)).collect();
  println!("{:?}", evens); // [2, 4, 6, 8, 10]
}
\`\`\`

### SQL

\`\`\`sql
SELECT
  department,
  COUNT(*)   AS employee_count,
  ROUND(AVG(salary), 2) AS avg_salary
FROM employees
WHERE status = 'active'
GROUP BY department
HAVING COUNT(*) > 5
ORDER BY avg_salary DESC;
\`\`\`

### YAML

\`\`\`yaml
# Docker Compose configuration
version: "3.8"
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      REDIS_URL: redis://cache:6379
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  redis_data:
\`\`\`

### Java

\`\`\`java
public class Hello {
  public static void main(String[] args) {
    var names = java.util.List.of("Alice", "Bob", "Charlie");
    names.stream()
      .map(String::toUpperCase)
      .forEach(System.out::println);
  }
}
\`\`\`

### C++

\`\`\`cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
  std::vector<int> nums = {5, 2, 8, 1, 9};
  std::sort(nums.begin(), nums.end());
  for (int n : nums) std::cout << n << ' ';
  // Output: 1 2 5 8 9
}
\`\`\`

### Bash

\`\`\`bash
#!/bin/bash
# Directory tree with file count
for dir in src/*/; do
  count=$(find "$dir" -type f | wc -l)
  echo "$dir → $count files"
done
\`\`\`

### CSS

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}

.card {
  border-radius: 12px;
  background: var(--color-surface);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
}
\`\`\`

---

## 📊 Tables

### Feature Comparison

| Feature              | Basic Markdown | This Tool         |
|----------------------|---------------|-------------------|
| Live Preview         | ❌            | ✅ Real-time       |
| Syntax Highlighting  | ❌            | ✅ 24+ languages   |
| GitHub-style Theme   | ❌            | ✅ Dark / Light    |
| Export .md           | ❌            | ✅ One click       |
| XSS Protection       | ❌            | ✅ DOMPurify       |
| Word Count           | ❌            | ✅ Always visible  |

### Text Alignment (plain Markdown)

| Left         | Center       | Right       |
|:-------------|:-----------:|------------:|
| Left-aligned  | Centered     | Right-aligned|
| Apple        | Banana       | Cherry      |

---

## 🔗 Links & Images

- **Inline**: [DevTools Hub](https://example.com)
- **Reference-style**: [GitHub][1]

[1]: https://github.com

![Placeholder](https://placehold.co/600x80/151922/94a3b8?text=Markdown+Preview+-+Real-time+%26+Safe)

---

## 📏 Horizontal Rules

Above this paragraph is a horizontal rule. Below this paragraph is another one.

---

---

## 🧩 Escaped Characters

Use a backslash (\\) to prevent Markdown from interpreting special characters:

- \`\\*\` produces a literal \*
- \`\\_\` produces a literal \_
- \`\\\`\` produces a literal \`

## ℹ️ Summary

This sample demonstrates **all major Markdown features** supported by this tool. Start editing the text above to see how the preview updates in real time. Everything stays **client-side** — your content never leaves your browser.

> Built for [DevTools Hub](https://example.com) — free, fast, and privacy-first.`
