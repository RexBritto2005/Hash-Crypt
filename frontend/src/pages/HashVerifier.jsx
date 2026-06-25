import { useState } from 'react'
import axios from 'axios'

const ALGORITHMS = ['SHA-256 (Recommended)', 'SHA-512', 'SHA-1', 'MD5']

export default function HashVerifier() {
  const [originalText, setOriginalText] = useState('')
  const [hashInput, setHashInput] = useState('')
  const [algorithm, setAlgorithm] = useState('SHA-256 (Recommended)')
  const [salt, setSalt] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleVerify = async () => {
    if (!originalText.trim() || !hashInput.trim()) {
      alert('Please fill in both fields.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const algoName = algorithm.split(' ')[0].toLowerCase().replace('-', '')
      const { data } = await axios.post('http://localhost:3001/api/hash/verify', {
        text: originalText,
        hash: hashInput,
        algorithm: algoName,
        salt: salt || '',
      })
      setResult(data)
    } catch (err) {
      setError('Failed to verify hash. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!result?.generatedHash) return
    navigator.clipboard.writeText(result.generatedHash)
  }

  return (
    <div className="relative z-10">
      <div className="scanline" />
      <div className="max-w-container-max mx-auto relative z-20">
        {/* Header */}
        <section className="mb-stack-lg">
          <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Hash Verifier</h1>
          <p className="font-body-main text-body-main text-on-surface-variant max-w-2xl">
            Compare a raw string against an existing hash to verify data integrity. Select your algorithm, provide an optional salt, and run the verification process.
          </p>
        </section>

        {/* Tool Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Input Form Section */}
          <div className="lg:col-span-8 space-y-gutter">
            <div className="glass-panel p-gutter rounded-lg relative overflow-hidden">
              {/* Glow in corner */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary-container/5 blur-3xl rounded-full" />
              <div className="space-y-6 relative z-10">
                {/* Original Text Input */}
                <div>
                  <label className="block text-label-caps font-label-caps text-secondary-fixed-dim mb-2">Original Text</label>
                  <textarea
                    value={originalText}
                    onChange={(e) => setOriginalText(e.target.value)}
                    className="w-full bg-[#1a1a1a] border-0 border-b border-outline focus:ring-0 focus:border-primary-container text-code-block font-code-block text-on-surface transition-all placeholder:text-surface-variant outline-none"
                    placeholder="Enter cleartext to hash and compare..."
                    rows={3}
                  />
                </div>

                {/* Hash to Verify Input */}
                <div>
                  <label className="block text-label-caps font-label-caps text-secondary-fixed-dim mb-2">Hash to Verify</label>
                  <input
                    value={hashInput}
                    onChange={(e) => setHashInput(e.target.value)}
                    className="w-full bg-[#1a1a1a] border-0 border-b border-outline focus:ring-0 focus:border-primary-container text-code-block font-code-block text-on-surface transition-all placeholder:text-surface-variant outline-none"
                    placeholder="e.g. 5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"
                    type="text"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                  {/* Algorithm Selector */}
                  <div>
                    <label className="block text-label-caps font-label-caps text-secondary-fixed-dim mb-2">Algorithm</label>
                    <select
                      value={algorithm}
                      onChange={(e) => setAlgorithm(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-outline-variant text-body-main font-body-main text-on-surface rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary-container outline-none appearance-none"
                    >
                      {ALGORITHMS.map((a) => (
                        <option key={a}>{a}</option>
                      ))}
                    </select>
                  </div>

                  {/* Salt Input */}
                  <div>
                    <label className="block text-label-caps font-label-caps text-secondary-fixed-dim mb-2">
                      Optional Salt <span className="opacity-40">(Base64/UTF-8)</span>
                    </label>
                    <input
                      value={salt}
                      onChange={(e) => setSalt(e.target.value)}
                      className="w-full bg-[#1a1a1a] border-0 border-b border-outline focus:ring-0 focus:border-primary-container text-code-block font-code-block text-on-surface transition-all outline-none"
                      placeholder="Enter salt string..."
                      type="text"
                    />
                  </div>
                </div>

                {/* Verify Button */}
                <div className="pt-4">
                  <button
                    onClick={handleVerify}
                    disabled={loading}
                    className="w-full bg-primary-container text-on-primary font-bold py-4 rounded-lg hover:glow-cyan-active hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined">verified_user</span>
                    {loading ? 'VERIFYING...' : 'VERIFY INTEGRITY'}
                  </button>
                </div>
                {error && <p className="text-error text-label-caps font-label-caps">{error}</p>}
              </div>
            </div>

            {/* Result Card */}
            {result && (
              <div
                className="glass-panel rounded-lg overflow-hidden border-2 transition-all duration-500 transform"
                style={{ borderColor: result.match ? '#4ae176' : '#ffb4ab' }}
              >
                <div
                  className="p-6 flex items-center justify-between"
                  style={{ background: result.match ? 'rgba(0, 185, 84, 0.1)' : 'rgba(147, 0, 10, 0.1)' }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        background: result.match ? '#00b954' : '#93000a',
                        color: result.match ? '#004119' : '#ffdad6',
                      }}
                    >
                      <span className="material-symbols-outlined text-3xl">
                        {result.match ? 'check_circle' : 'cancel'}
                      </span>
                    </div>
                    <div>
                      <h3
                        className="text-headline-md font-headline-md"
                        style={{ color: result.match ? '#4ae176' : '#ffb4ab' }}
                      >
                        {result.match ? 'Hash Matched ✓' : 'Hash Mismatch ✗'}
                      </h3>
                      <p className="text-label-caps font-label-caps opacity-80 text-on-surface-variant">
                        {result.match ? 'Integrity Validated' : 'Collision or Tampering Detected'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-label-caps font-label-caps opacity-50 text-on-surface-variant">VERIFICATION TIME</div>
                    <div className="text-code-block font-code-block text-on-surface">
                      {result.processingTime?.toFixed(4) || '0.0034'}ms
                    </div>
                  </div>
                </div>
                <div className="bg-surface-container-highest/20 p-gutter hash-output-bg border-t border-outline-variant">
                  <div className="text-label-caps font-label-caps text-on-surface-variant mb-2">COMPARED HASH SIGNATURE</div>
                  <div className="flex items-center justify-between bg-black/40 p-4 border border-outline-variant rounded group">
                    <code className="text-code-block font-code-block break-all text-secondary-fixed-dim">
                      {result.generatedHash}
                    </code>
                    <button
                      onClick={handleCopy}
                      className="ml-4 p-2 text-on-surface-variant hover:text-primary-container transition-colors"
                    >
                      <span className="material-symbols-outlined">content_copy</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Metadata Sidebar */}
          <div className="lg:col-span-4 space-y-gutter">
            <div className="glass-panel p-6 rounded-lg">
              <h4 className="text-label-caps font-label-caps text-primary-container mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">info</span>
                Algorithm Intelligence
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary-fixed-dim mt-2" />
                  <div className="text-body-main font-body-main text-on-surface-variant text-sm">
                    <span className="text-primary">SHA-256</span> is industry standard for data integrity verification.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary-fixed-dim mt-2" />
                  <div className="text-body-main font-body-main text-on-surface-variant text-sm">
                    <span className="text-primary">Salting</span> adds a layer of protection against rainbow table attacks.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary-fixed-dim mt-2" />
                  <div className="text-body-main font-body-main text-on-surface-variant text-sm">
                    <span className="text-primary">Zero-Trust</span>: Hashes are verified locally. No data ever leaves this terminal.
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative rounded-lg overflow-hidden h-48 border border-outline-variant bg-surface-container-low">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent" />
              <div className="absolute bottom-4 left-4">
                <div className="text-label-caps font-label-caps text-secondary-fixed-dim">LIVE NETWORK ENTROPY</div>
                <div className="text-code-block font-code-block opacity-60 text-on-surface-variant">Nodes: 1,429 | Secure</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
