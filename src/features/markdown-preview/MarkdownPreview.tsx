import { useState, useMemo, useDeferredValue } from 'react'
import { marked } from './highlight'
import DOMPurify from 'dompurify'
import ToolTextarea from '../../components/tool/ToolTextarea'
import ToolActions from '../../components/tool/ToolActions'
import SampleButton from '../../ui/SampleButton'
import Button from '../../ui/Button'
import './markdown-styles.css'
import { sampleMarkdown } from './sample'

// ── Hooks ────────────────────────────────────────────────────

function useEditorStats(input: string) {
  return useMemo(() => {
    const text = input.trim()
    const words = text.match(/\S+/g)?.length ?? 0
    const chars = text.length
    const lines = text.split('\n').length
    return { words, chars, lines }
  }, [input])
}

function useMarkdownParser(input: string) {
  const deferred = useDeferredValue(input)
  const hasInput = deferred.trim().length > 0

  return useMemo(() => {
    if (!hasInput) return ''
    try {
      const raw = marked.parse(deferred)
      const html = typeof raw === 'string' ? raw : ''
      return DOMPurify.sanitize(html, { ADD_ATTR: ['data-language'], ADD_TAGS: ['mark'] })
    } catch {
      return '<p style="color: var(--color-danger)">Failed to parse Markdown</p>'
    }
  }, [deferred, hasInput])
}

// ── Empty State ──────────────────────────────────────────────

function CopyAsHtmlButton({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    if (!value) return
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      disabled={copied}
      className={`${className ?? ''} rounded bg-surface px-3 py-1 text-xs text-secondary hover:bg-elevated transition-colors`}
    >
      {copied ? 'Copied' : 'Copy as HTML'}
    </button>
  )
}

function EmptyState({ size = 40, hint = 'click' }: { size?: number; hint?: string }) {
  return (
    <div className="text-center text-muted">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mx-auto mb-3 opacity-40"
      >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line
          x1="16"
          y1="13"
          x2="8"
          y2="13"
        />
        <line
          x1="16"
          y1="17"
          x2="8"
          y2="17"
        />
      </svg>
      <p className="text-sm">
        Start typing or {hint} <strong>Sample</strong>
      </p>
    </div>
  )
}

// ── Component ────────────────────────────────────────────────

export default function MarkdownPreview() {
  const [input, setInput] = useState('')
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')

  const parsedHtml = useMarkdownParser(input)
  const stats = useEditorStats(input)
  const hasInput = input.trim().length > 0

  function loadSample() {
    setInput(sampleMarkdown)
  }

  function clear() {
    setInput('')
  }

  function downloadMarkdown() {
    if (!hasInput) return
    const blob = new Blob([input], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  // ── Desktop: side-by-side ──────────────────────────────────
  const desktopView = (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="[&_.relative]:mt-1">
        <ToolTextarea
          label="Markdown"
          value={input}
          onChange={setInput}
          placeholder="Paste or type Markdown here..."
          rows={20}
          rightLabel={<SampleButton onClick={loadSample} />}
        />
      </div>

      <div className="space-y-2 w-full">
        <div className="flex justify-between">
          <label className="text-sm text-secondary">Preview</label>
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              onClick={downloadMarkdown}
              isDisabled={!hasInput}
              className="rounded px-2.5 py-0.5 text-xs leading-none"
            >
              Download MD
            </Button>
            <CopyAsHtmlButton value={parsedHtml || ''} />
          </div>
        </div>

        <div
          className={`custom-scrollbar md-preview w-full h-108 rounded-xl border border-border overflow-auto ${
            parsedHtml ? 'bg-surface' : 'bg-elevated/30'
          }`}
        >
          <div className="sticky top-0 z-10 flex items-center gap-2.5 text-[11px] text-muted leading-none py-1.5 px-4 bg-surface border-b border-border/50">
            <span>{stats.words}w</span>
            <span className="text-border">·</span>
            <span>{stats.chars}c</span>
            <span className="text-border">·</span>
            <span>{stats.lines}l</span>
          </div>
          {parsedHtml ? (
            <div
              className="p-4"
              dangerouslySetInnerHTML={{ __html: parsedHtml }}
            />
          ) : (
            <div
              className="p-4 flex items-center justify-center"
              style={{ minHeight: 'calc(100% - 37px)' }}
            >
              <EmptyState
                size={40}
                hint="click"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )

  // ── Mobile: tabbed ─────────────────────────────────────────
  const mobileView = (
    <div>
      {/* Tab bar */}
      <div className="flex mb-4 border-b border-border">
        <button
          onClick={() => setActiveTab('edit')}
          className={`px-4 py-2 text-sm font-medium transition-colors relative ${
            activeTab === 'edit' ? 'text-accent' : 'text-secondary hover:text-primary'
          }`}
        >
          Edit
          {activeTab === 'edit' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />}
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 text-sm font-medium transition-colors relative ${
            activeTab === 'preview' ? 'text-accent' : 'text-secondary hover:text-primary'
          }`}
        >
          Preview
          {activeTab === 'preview' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />
          )}
        </button>

        {/* Right-aligned actions */}
        <div className="ml-auto flex items-center gap-2 px-1">
          {activeTab === 'edit' && <SampleButton onClick={loadSample} />}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'edit' ? (
        <ToolTextarea
          label=""
          value={input}
          onChange={setInput}
          placeholder="Paste or type Markdown here..."
          rows={12}
        />
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted">
              {stats.words}w · {stats.chars}c · {stats.lines}l
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                onClick={downloadMarkdown}
                isDisabled={!hasInput}
                className="rounded px-2.5 py-0.5 text-xs leading-none"
              >
                Download MD
              </Button>
              <CopyAsHtmlButton value={parsedHtml || ''} />
            </div>
          </div>

          <div
            className={`custom-scrollbar md-preview w-full h-87.5 rounded-xl border border-border overflow-auto transition-opacity duration-150 ${
              parsedHtml ? 'bg-surface p-4' : 'bg-elevated/30 flex items-center justify-center'
            }`}
          >
            {parsedHtml ? (
              <div dangerouslySetInnerHTML={{ __html: parsedHtml }} />
            ) : (
              <EmptyState
                size={36}
                hint="tap"
              />
            )}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Desktop */}
      <div className="hidden md:block">{desktopView}</div>

      {/* Mobile */}
      <div className="md:hidden">{mobileView}</div>

      {/* Actions — desktop */}
      <div className="hidden md:block">
        <ToolActions>
          <Button
            variant="secondary"
            onClick={clear}
            isDisabled={!hasInput}
          >
            Clear
          </Button>
        </ToolActions>
      </div>

      {/* Actions — mobile sticky */}
      <div className="md:hidden sticky bottom-4 z-10 bg-surface/95 backdrop-blur-sm border border-border rounded-xl p-3 shadow-lg">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={clear}
            isDisabled={!hasInput}
            className="flex-1"
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  )
}
