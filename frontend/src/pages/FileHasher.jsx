import { useState, useRef } from 'react'
import axios from 'axios'

const ALGORITHMS = ['SHA-256', 'SHA-512', 'MD5', 'SHA-1']

export default function FileHasher() {
  const [algorithm, setAlgorithm] = useState('SHA-256')
  const [dragOver, setDragOver] = useState(false)
  const [fileInfo, setFileInfo] = useState(null)
  const [hash, setHash] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [processingTime, setProcessingTime] = useState(0)
  const [copySuccess, setCopySuccess] = useState(false)
  const fileInputRef = useRef(null)

  const handleFile = async (file) => {
    setFileInfo({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      mime: file.type || 'application/octet-stream',
    })
    setHash('')
    setLoading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('algorithm', algorithm.toLowerCase().replace('-', ''))

    try {
      const { data } = await axios.post('http://localhost:3001/api/hash/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setHash(data.hash)
      setProcessingTime(data.processingTime)
      setFileInfo({
        name: data.filename,
        size: (data.fileSize / (1024 * 1024)).toFixed(2) + ' MB',
        mime: data.mimeType,
      })
    } catch (err) {
      setError('Failed to hash file. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleCopy = () => {
    if (!hash) return
    navigator.clipboard.writeText(hash)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const handleDownload = () => {
    if (!hash) return
    const blob = new Blob([hash], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${fileInfo?.name || 'hash'}-${algorithm}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-5xl mx-auto w-full">
      {/* Dashboard Header */}
      <div className="mb-stack-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-label-caps font-label-caps text-secondary-fixed-dim">Status: Ready</span>
          <div className="w-2 h-2 rounded-full bg-secondary-fixed-dim animate-pulse" />
        </div>
        <h1 className="text-headline-lg font-headline-lg text-primary">Secure File Hasher</h1>
        <p className="text-on-surface-variant max-w-2xl mt-2 font-body-main">
          Upload local files for instant cryptographic hashing. Data never leaves your terminal; all computation is performed client-side.
        </p>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-gutter">
          {/* Drop Zone */}
          <div className="glass-panel p-6 rounded-lg relative group transition-all duration-300">
            <div
              className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                dragOver
                  ? 'border-primary-container bg-primary-container/5'
                  : 'border-outline-variant hover:border-primary-container/50'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
              />
              <div className="w-16 h-16 rounded-full bg-primary-container/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-primary-container" style={{ fontSize: '40px' }}>upload</span>
              </div>
              <p className="text-headline-md font-headline-md text-primary mb-1">Drag &amp; Drop File</p>
              <p className="text-on-surface-variant text-sm font-body-main">or click to browse filesystem</p>
              <div className="mt-6 flex gap-2">
                <span className="px-3 py-1 bg-surface-container-high rounded border border-outline-variant text-xs font-code-block text-on-surface-variant">
                  MAX: 2GB
                </span>
                <span className="px-3 py-1 bg-surface-container-high rounded border border-outline-variant text-xs font-code-block text-on-surface-variant">
                  LOCAL ONLY
                </span>
              </div>
            </div>
          </div>

          {/* Algorithm Selector */}
          <div className="glass-panel p-6 rounded-lg">
            <h3 className="text-label-caps font-label-caps text-on-surface-variant mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">settings_input_component</span>
              Algorithm Configuration
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {ALGORITHMS.map((algo) => (
                <button
                  key={algo}
                  onClick={() => setAlgorithm(algo)}
                  className={`px-4 py-3 rounded text-center text-xs font-code-block transition-colors ${
                    algorithm === algo
                      ? 'bg-secondary-container/20 text-secondary-fixed-dim border border-secondary-fixed-dim'
                      : 'bg-surface-container-high text-on-surface-variant border border-outline-variant hover:border-primary-container/50'
                  }`}
                >
                  {algo}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 space-y-gutter">
          {/* File Metadata Card */}
          <div className="glass-panel rounded-lg overflow-hidden">
            <div className="bg-surface-container-highest px-6 py-3 border-b border-outline-variant">
              <h3 className="text-label-caps font-label-caps text-primary text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">description</span>
                File Metadata
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-outline-variant">
                <span className="text-on-surface-variant text-sm">Filename:</span>
                <span className="text-primary font-code-block text-sm truncate max-w-[160px]">
                  {fileInfo?.name || '—'}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-outline-variant">
                <span className="text-on-surface-variant text-sm">Size:</span>
                <span className="text-primary font-code-block text-sm">{fileInfo?.size || '—'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant text-sm">MIME Type:</span>
                <span className="text-primary font-code-block text-sm">{fileInfo?.mime || '—'}</span>
              </div>
            </div>
          </div>

          {/* Hash Output Card */}
          <div className="glass-panel rounded-lg overflow-hidden flex flex-col">
            <div className="bg-surface-container-highest px-6 py-3 border-b border-outline-variant flex justify-between items-center">
              <h3 className="text-label-caps font-label-caps text-primary text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">output</span>
                Hash Output
              </h3>
              <span className="text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-bold uppercase">
                Verified
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="hash-output-bg border border-outline-variant p-4 rounded bg-surface-container-lowest relative group min-h-[120px]">
                {loading ? (
                  <p className="text-primary-container font-code-block text-sm">
                    CALCULATING... <span className="terminal-cursor" />
                  </p>
                ) : (
                  <p className="text-primary-container font-code-block text-sm break-all leading-relaxed">
                    {hash || 'Awaiting file upload...'}
                  </p>
                )}
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 p-2 bg-surface-container-highest/80 text-on-surface-variant rounded opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary-container"
                  title="Copy to Clipboard"
                >
                  <span className="material-symbols-outlined text-sm">{copySuccess ? 'check' : 'content_copy'}</span>
                </button>
              </div>
              {error && <p className="text-error text-label-caps font-label-caps mt-2">{error}</p>}
              <div className="mt-stack-md flex flex-col gap-3">
                <button
                  onClick={() => {}}
                  className="w-full py-3 bg-primary-container text-on-primary font-bold text-sm tracking-wide rounded glow-cyan transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">verified_user</span>
                  SIGN HASH
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!hash}
                  className="w-full py-3 border border-primary-container text-primary-container font-label-caps text-xs tracking-widest rounded hover:bg-primary-container/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  DOWNLOAD AS .TXT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mt-stack-lg">
        <div className="glass-panel p-6 rounded-lg">
          <p className="text-label-caps font-label-caps text-on-surface-variant text-[10px] mb-2">Entropy Level</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-primary">
              {algorithm === 'SHA-512' ? '512' : algorithm === 'SHA-1' ? '160' : algorithm === 'MD5' ? '128' : '256'}
            </span>
            <span className="text-on-surface-variant text-xs mb-1">bits</span>
          </div>
          <div className="w-full bg-surface-container-high h-1 mt-4 rounded-full overflow-hidden">
            <div className="bg-primary-container h-full w-full" />
          </div>
        </div>
        <div className="glass-panel p-6 rounded-lg">
          <p className="text-label-caps font-label-caps text-on-surface-variant text-[10px] mb-2">Processing Time</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-primary">{processingTime ? processingTime.toFixed(1) : '0'}</span>
            <span className="text-on-surface-variant text-xs mb-1">ms</span>
          </div>
          <div className="w-full bg-surface-container-high h-1 mt-4 rounded-full overflow-hidden">
            <div className="bg-secondary-fixed-dim h-full" style={{ width: '15%' }} />
          </div>
        </div>
        <div className="glass-panel p-6 rounded-lg bg-primary-container/5 border-primary-container/20">
          <p className="text-label-caps font-label-caps text-primary-container text-[10px] mb-2">Encryption Standard</p>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container">encrypted</span>
            <span className="text-lg font-bold text-primary">FIPS 180-4</span>
          </div>
          <p className="text-on-surface-variant text-[10px] mt-2 italic">Standardized by NIST</p>
        </div>
      </div>
    </div>
  )
}
