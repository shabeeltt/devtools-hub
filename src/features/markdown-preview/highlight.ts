import { marked, Renderer } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import cpp from 'highlight.js/lib/languages/cpp'
import csharp from 'highlight.js/lib/languages/csharp'
import java from 'highlight.js/lib/languages/java'
import go from 'highlight.js/lib/languages/go'
import rust from 'highlight.js/lib/languages/rust'
import ruby from 'highlight.js/lib/languages/ruby'
import php from 'highlight.js/lib/languages/php'
import swift from 'highlight.js/lib/languages/swift'
import kotlin from 'highlight.js/lib/languages/kotlin'
import sql from 'highlight.js/lib/languages/sql'
import yaml from 'highlight.js/lib/languages/yaml'
import dockerfile from 'highlight.js/lib/languages/dockerfile'
import scss from 'highlight.js/lib/languages/scss'
import less from 'highlight.js/lib/languages/less'
import graphql from 'highlight.js/lib/languages/graphql'
import markdownLang from 'highlight.js/lib/languages/markdown'
import 'highlight.js/styles/github-dark-dimmed.css'

// ── Register languages with aliases ──────────────────────────
const languages: [Parameters<typeof hljs.registerLanguage>[1], string, string[]][] = [
  [javascript, 'javascript', ['js']],
  [typescript, 'typescript', ['ts']],
  [python, 'python', ['py']],
  [bash, 'bash', ['sh', 'shell', 'zsh']],
  [json, 'json', []],
  [css, 'css', []],
  [xml, 'xml', ['html', 'htm', 'svg']],
  [cpp, 'cpp', ['c', 'cc', 'cxx']],
  [csharp, 'csharp', ['cs']],
  [java, 'java', []],
  [go, 'go', []],
  [rust, 'rust', ['rs']],
  [ruby, 'ruby', ['rb']],
  [php, 'php', []],
  [swift, 'swift', []],
  [kotlin, 'kotlin', ['kt']],
  [sql, 'sql', []],
  [yaml, 'yaml', ['yml']],
  [dockerfile, 'dockerfile', ['docker']],
  [scss, 'scss', []],
  [less, 'less', []],
  [graphql, 'graphql', ['gql']],
  [markdownLang, 'markdown', ['md']],
]

for (const [mod, name, aliases] of languages) {
  hljs.registerLanguage(name, mod as any)
  for (const alias of aliases) {
    hljs.registerLanguage(alias, mod as any)
  }
}

// ── Configure marked with syntax highlighting ────────────────
marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value
      }
      return hljs.highlightAuto(code).value
    },
  }),
)

// Support ==highlight== syntax → <mark>text</mark>
marked.use({
  extensions: [
    {
      name: 'mark',
      level: 'inline',
      start(src: string) {
        return src.indexOf('==')
      },
      tokenizer(this: any, src: string) {
        const match = /^==(.+?)==/.exec(src)
        if (match) {
          return {
            type: 'mark',
            raw: match[0],
            tokens: this.lexer.lex(match[1].trim()),
          }
        }
      },
      renderer(this: any, token: any) {
        return `<mark>${this.parser.parseInline(token.tokens)}</mark>`
      },
    },
  ],
})

// Add data-language attribute to <pre> for the CSS language badge
const renderer = new Renderer()
const originalCode = renderer.code.bind(renderer)
renderer.code = ({ text, lang, escaped }) => {
  const result = originalCode({ text, lang, escaped } as any)
  if (lang) {
    return result.replace('<pre>', `<pre data-language="${lang}">`)
  }
  return result
}
marked.use({ renderer })

export { marked }
