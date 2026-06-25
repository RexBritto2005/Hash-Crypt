import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

function timeAgo(isoString) {
  const diff = Math.floor((Date.now() - new Date(isoString)) / 1000)
  if (diff < 60) return `${diff} secs ago`
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`
  return `${Math.floor(diff / 86400)} days ago`
}

const ALGO_BADGE_STYLES = {
  'SHA-256': 'bg-secondary-container/10 text-secondary-fixed-dim border-secondary-container/30',
  'SHA-512': 'bg-primary-container/10 text-primary-container border-primary-container/30',
  'MD5': 'bg-tertiary-container/10 text-on-tertiary-container border-tertiary-container/30',
  'SHA-1': 'bg-error-container/10 text-error border-error-container/30',
}

export default function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [uptime, setUptime] = useState(0)
  const [copyStates, setCopyStates] = useState({})

  const fetchHistory = useCallback(async () => {
    try {
      const { data } = await axios.get('http://localhost:3001/api/history')
      setHistory(data.history || [])
    } catch {
      setHistory([])
    } finally {
      setLoading(false)
    }
  }, [])

  const clearHistory = async () => {
    try {
      await axios.delete('http://localhost:3001/api/history')
      setHistory([])
    } catch {}
  }

  useEffect(() => {
    fetchHistory()
    const interval = setInterval(fetchHistory, 5000)
    return () => clearInterval(interval)
  }, [fetchHistory])

  useEffect(() => {
    const start = Date.now()
    const interval = setInterval(() => setUptime(Math.floor((Date.now() - start) / 1000)), 1000)
    return () => clearInterval(interval)
  }, [])

  const formatUptime = (s) => {
    const h = String(Math.floor(s / 3600)).padStart(2, '0')
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
    const sec = String(s % 60).padStart(2, '0')
    return `${h}:${m}:${sec}`
  }

  const handleCopy = (hash, id) => {
    navigator.clipboard.writeText(hash)
    setCopyStates((prev) => ({ ...prev, [id]: true }))
    setTimeout(() => setCopyStates((prev) => ({ ...prev, [id]: false })), 2000)
  }

  const avgSpeed = history.length
    ? (history.reduce((acc, h) => acc + (h.processingTime || 0), 0) / history.length).toFixed(2)
    : '0.00'

  return (
    /* Full-height layout — overrides the Layout padding */
    <div
      className="bg-surface-dim relative overflow-hidden flex flex-col"
      style={{ minHeight: 'calc(100vh - 64px)', margin: '-24px' }}
    >
      {/* Page Header */}
      <header className="p-8 border-b border-outline-variant relative z-10 flex justify-between items-end flex-shrink-0">
        <div>
          <h1 className="text-headline-lg font-headline-lg mb-2 text-primary">Cryptographic History</h1>
          <p className="text-on-surface-variant text-body-main font-body-main max-w-xl">
            Reviewing the last {history.length} secure hashing operations performed on this terminal session.
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-label-caps font-label-caps text-secondary-fixed-dim block mb-1">Status: SECURE</span>
          <span className="text-code-block font-code-block text-on-surface-variant text-xs">
            Uptime: {formatUptime(uptime)}
          </span>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8 relative z-10 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-4">
          {loading && (
            <div className="text-center py-12">
              <p className="text-label-caps font-label-caps text-on-surface-variant animate-pulse">
                Loading history...
              </p>
            </div>
          )}

          {!loading && history.length === 0 && (
            <div className="border-2 border-dashed border-outline-variant rounded-lg p-12 flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4">history</span>
              <p className="text-label-caps font-label-caps text-on-surface-variant">No history yet.</p>
              <p className="text-on-surface-variant text-sm mt-2 font-body-main">
                Generate or verify a hash to see it appear here.
              </p>
            </div>
          )}

          {history.map((item) => {
            const badgeStyle = ALGO_BADGE_STYLES[item.algorithm] || 'bg-surface-container-high text-on-surface-variant border-outline-variant'
            return (
              <div
                key={item.id}
                className="group bg-surface-container-high border border-outline-variant p-6 hover:border-primary-container transition-all duration-300 relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] px-2 py-0.5 font-label-caps border ${badgeStyle}`}>
                        {item.algorithm}
                      </span>
                      <span className="text-on-surface-variant text-code-block font-code-block text-xs uppercase">
                        {timeAgo(item.timestamp)}
                      </span>
                      {item.type && (
                        <span className="text-[10px] text-on-surface-variant font-label-caps opacity-60 uppercase">
                          [{item.type}]
                        </span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-label-caps text-[10px] text-on-surface-variant/60">INPUT PREVIEW</p>
                      <p className="text-body-main font-code-block truncate max-w-md text-on-surface">
                        "{item.inputPreview}"
                      </p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-label-caps text-[10px] text-on-surface-variant/60 mb-1">HASH OUTPUT</p>
                    <div className="hash-display-bg bg-surface-container-low border border-outline-variant px-4 py-3 flex items-center justify-between group-hover:border-primary-container/50 transition-colors">
                      <code className="text-code-block font-code-block text-primary-container text-sm truncate max-w-[220px]">
                        {item.hash}
                      </code>
                      <button
                        onClick={() => handleCopy(item.hash, item.id)}
                        className="ml-4 text-on-surface-variant hover:text-primary-container transition-colors active:scale-90"
                      >
                        <span
                          className="material-symbols-outlined text-sm"
                          style={{ color: copyStates[item.id] ? '#4ae176' : undefined }}
                        >
                          {copyStates[item.id] ? 'check' : 'content_copy'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Scanning placeholder for more */}
          {history.length > 0 && (
            <div className="border border-dashed border-outline-variant p-8 flex items-center justify-center">
              <p className="text-label-caps text-on-surface-variant animate-pulse">
                Scanning Archive for Older Blocks...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Live Statistics Sidebar (xl only) */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4 w-64 z-20">
        <div className="bg-surface-container-high/80 backdrop-blur-md border border-outline-variant p-4">
          <h4 className="text-label-caps font-label-caps text-primary-container mb-4">Live Statistics</h4>
          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-on-surface-variant block uppercase">Total Hashes</span>
              <span className="text-headline-md font-headline-md text-primary">{history.length.toLocaleString()}</span>
            </div>
            <div className="w-full bg-surface-variant h-[2px]">
              <div
                className="bg-primary-container h-full"
                style={{
                  width: `${Math.min((history.length / 50) * 100, 100)}%`,
                  boxShadow: '0 0 8px #00ffcc',
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-on-surface-variant block uppercase">Avg Speed</span>
                <span className="text-code-block font-code-block text-secondary">{avgSpeed}ms</span>
              </div>
              <div>
                <span className="text-[10px] text-on-surface-variant block uppercase">Entropy</span>
                <span className="text-code-block font-code-block text-tertiary-fixed-dim">High</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-high/80 backdrop-blur-md border border-outline-variant p-4">
          <h4 className="text-label-caps font-label-caps text-on-surface-variant mb-4">Security Advisory</h4>
          <p className="text-[11px] text-on-surface-variant leading-relaxed">
            Session will automatically purge in{' '}
            <span className="text-error">12:59</span>. Ensure all keys are exported to the secure vault.
          </p>
        </div>
        <button
          onClick={clearHistory}
          className="w-full py-3 border border-secondary text-secondary hover:bg-secondary/10 transition-all font-label-caps text-label-caps tracking-widest active:scale-[0.98]"
        >
          Clear History
        </button>
      </div>

      {/* Mobile bottom clear button */}
      <div className="xl:hidden flex justify-center p-4 border-t border-outline-variant bg-background flex-shrink-0">
        <button
          onClick={clearHistory}
          className="py-2 px-8 border border-secondary text-secondary hover:bg-secondary/10 transition-all font-label-caps text-label-caps tracking-widest active:scale-[0.98]"
        >
          Clear History
        </button>
      </div>
    </div>
  )
}
