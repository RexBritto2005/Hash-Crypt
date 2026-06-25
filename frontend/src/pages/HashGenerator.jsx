import { useState, useRef } from 'react'
import axios from 'axios'

const ALGORITHMS = ['SHA-256', 'SHA-512', 'SHA-1', 'MD5']
const BIT_DEPTH_MAP = { 'SHA-256': '256-BIT', 'SHA-512': '512-BIT', 'SHA-1': '160-BIT', 'MD5': '128-BIT' }

export default function HashGenerator() {
  const [inputText, setInputText] = useState('')
  const [algorithm, setAlgorithm] = useState('SHA-256')
  const [saltEnabled, setSaltEnabled] = useState(false)
  const [salt, setSalt] = useState('0x8F22A1BC99')
  const [outputHash, setOutputHash] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const copyBtnRef = useRef(null)

  const handleGenerate = async () => {
    if (!inputText.trim()) return
    setLoading(true)
    setError('')
    try {
      const { data } = await axios.post('http://localhost:3001/api/hash/generate', {
        text: inputText,
        algorithm: algorithm.toLowerCase().replace('-', ''),
        salt: saltEnabled ? salt : '',
      })
      setOutputHash(data.hash)
    } catch (err) {
      setError('Failed to generate hash. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!outputHash) return
    navigator.clipboard.writeText(outputHash)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto py-stack-lg relative z-10">
      {/* Header */}
      <div className="mb-stack-lg">
        <h1 className="text-headline-lg font-headline-lg mb-2 text-primary">Hash Generator</h1>
        <p className="text-on-surface-variant text-body-main max-w-xl">
          Generate secure cryptographic hashes for strings using multiple algorithms. Fast, client-side encryption for developer security.
        </p>
      </div>

      {/* Bento Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {/* Input Section — col-span-2 */}
        <div className="md:col-span-2 space-y-gutter">
          {/* Input Terminal Card */}
          <div className="glass-panel p-stack-md rounded-lg">
            <div className="flex justify-between items-center mb-stack-sm">
              <label className="text-label-caps font-label-caps text-on-surface-variant uppercase">
                Input Terminal
              </label>
              <span className="text-label-caps font-label-caps text-secondary-fixed-dim">
                {inputText.length} chars
              </span>
            </div>
            <textarea
              className="w-full h-48 bg-transparent border-none focus:ring-0 text-code-block font-code-block text-primary terminal-border p-2 resize-none placeholder:text-surface-variant outline-none"
              placeholder="Enter plaintext to encrypt..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          {/* Output Area */}
          <div className="glass-panel p-stack-md rounded-lg relative overflow-hidden">
            <div className="hash-output-bg absolute inset-0 opacity-10 pointer-events-none" />
            <div className="relative z-10">
              <label className="text-label-caps font-label-caps text-on-surface-variant mb-4 block">
                Generated Hash Output
              </label>
              <div className="flex items-center gap-4">
                <div
                  className="flex-1 bg-surface-container-high p-4 rounded text-secondary-fixed-dim font-code-block text-code-block break-all min-h-[56px] flex items-center"
                >
                  {loading
                    ? 'Encrypting...'
                    : outputHash || '[Waiting for input...]'}
                </div>
                <button
                  onClick={handleCopy}
                  className="p-4 bg-surface-container-high border border-outline-variant hover:border-primary-container transition-all text-on-surface-variant hover:text-primary-container active:scale-95 group"
                >
                  <span className={`material-symbols-outlined ${copySuccess ? 'text-secondary-fixed-dim' : ''}`}>
                    {copySuccess ? 'check' : 'content_copy'}
                  </span>
                </button>
              </div>
              {error && (
                <p className="text-error text-label-caps font-label-caps mt-2">{error}</p>
              )}
            </div>
          </div>
        </div>

        {/* Controls Sidebar — col-span-1 */}
        <div className="md:col-span-1 space-y-gutter">
          {/* Configuration Card */}
          <div className="glass-panel p-stack-md rounded-lg">
            <h3 className="text-label-caps font-label-caps text-primary-container mb-stack-md">Configuration</h3>

            {/* Algorithm Select */}
            <div className="mb-6">
              <label className="block text-[10px] text-on-surface-variant font-label-caps mb-2">ALGORITHM</label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 text-code-block font-code-block focus:border-primary-container outline-none appearance-none"
              >
                {ALGORITHMS.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* Salt Toggle */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-on-surface-variant font-label-caps">ENABLE SALT</label>
                <button
                  onClick={() => setSaltEnabled(!saltEnabled)}
                  className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${
                    saltEnabled ? 'bg-secondary-container' : 'bg-surface-container-highest'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-3 h-3 rounded-full transition-transform duration-300 ${
                      saltEnabled ? 'bg-on-secondary-container translate-x-5' : 'bg-on-surface-variant translate-x-1'
                    }`}
                  />
                </button>
              </div>
              {saltEnabled && (
                <div className="mt-4 transition-all duration-300">
                  <label className="block text-[10px] text-on-surface-variant font-label-caps mb-2">SALT VALUE</label>
                  <input
                    type="text"
                    value={salt}
                    onChange={(e) => setSalt(e.target.value)}
                    className="w-full bg-surface-container-high border border-outline-variant text-secondary-fixed-dim p-2 text-code-block font-code-block focus:border-primary-container outline-none"
                  />
                </div>
              )}
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !inputText.trim()}
              className="w-full py-4 bg-primary-container text-on-primary font-bold text-label-caps font-label-caps glow-cyan hover:brightness-110 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'PROCESSING...' : 'GENERATE HASH'}
            </button>
          </div>

          {/* Session Status Card */}
          <div className="glass-panel p-stack-md rounded-lg border-l-2 border-secondary-fixed-dim">
            <h3 className="text-label-caps font-label-caps text-on-surface-variant mb-stack-md">Session Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-code-block font-code-block">
                <span className="text-on-surface-variant text-[11px]">MODE:</span>
                <span className="text-secondary-fixed-dim text-[11px] px-2 py-0.5 bg-secondary-container/10 rounded">ENCRYPT</span>
              </div>
              <div className="flex justify-between items-center text-code-block font-code-block">
                <span className="text-on-surface-variant text-[11px]">BIT DEPTH:</span>
                <span className="text-on-surface text-[11px]">{BIT_DEPTH_MAP[algorithm]}</span>
              </div>
              <div className="flex justify-between items-center text-code-block font-code-block">
                <span className="text-on-surface-variant text-[11px]">VERIFIED:</span>
                <span className="text-primary-container material-symbols-outlined scale-75">verified_user</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Badges Bar */}
      <div className="mt-gutter flex flex-wrap gap-4">
        <div className="flex items-center gap-2 px-3 py-1 bg-surface-container-high border border-outline-variant rounded text-label-caps font-label-caps text-on-surface-variant">
          <span className="w-2 h-2 rounded-full bg-primary-container" />
          ALGORITHM: <span className="text-primary ml-1">{algorithm}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-surface-container-high border border-outline-variant rounded text-label-caps font-label-caps text-on-surface-variant">
          <span className="w-2 h-2 rounded-full bg-secondary" />
          SALT:{' '}
          <span className={`ml-1 ${saltEnabled ? 'text-secondary-fixed-dim' : 'text-primary'}`}>
            {saltEnabled ? 'ENABLED' : 'DISABLED'}
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-surface-container-high border border-outline-variant rounded text-label-caps font-label-caps text-on-surface-variant">
          <span className="material-symbols-outlined scale-75">query_stats</span>
          ENTROPY: <span className="text-primary ml-1">HIGH</span>
        </div>
      </div>
    </div>
  )
}
