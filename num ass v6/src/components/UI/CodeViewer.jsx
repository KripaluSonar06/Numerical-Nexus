import { useState } from 'react'
import './CodeViewer.css'

export default function CodeViewer({ code = '', language = 'javascript', title = 'Code' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="code-viewer">
      <div className="code-viewer-header">
        <span className="code-viewer-title">{title}</span>
        <button
          className="code-viewer-copy-btn"
          onClick={handleCopy}
        >
          {copied ? '✓ Copied' : '📋 Copy'}
        </button>
      </div>
      <pre className="code-viewer-content">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  )
}
