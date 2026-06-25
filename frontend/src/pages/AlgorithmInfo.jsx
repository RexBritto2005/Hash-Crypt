import { useEffect, useRef } from 'react'

const algorithms = [
  {
    name: 'MD5',
    subtitle: 'Message Digest 5',
    badgeLabel: 'Broken',
    badgeStyle: 'bg-error-container/20 border-error text-error',
    outputSize: '128 bits',
    useCases: ['Legacy integrity checks', 'Fast checksum generation'],
    strength: 15,
    barColor: 'bg-error',
    strengthColor: 'text-error',
  },
  {
    name: 'SHA-1',
    subtitle: 'Secure Hash Algorithm 1',
    badgeLabel: 'Weak',
    badgeStyle: 'bg-error-container/20 border-error text-error',
    outputSize: '160 bits',
    useCases: ['Git version control', 'Non-security checksums'],
    strength: 35,
    barColor: 'bg-error',
    strengthColor: 'text-error',
    showVerified: false,
  },
  {
    name: 'SHA-256',
    subtitle: 'SHA-2 Family',
    badgeLabel: 'Secure',
    badgeStyle: 'bg-secondary-container/20 border-secondary text-secondary-fixed-dim',
    outputSize: '256 bits',
    useCases: ['Blockchain & Bitcoin', 'SSL/TLS Certificates', 'Data Fingerprinting'],
    strength: 90,
    barColor: 'bg-secondary',
    strengthColor: 'text-secondary-fixed-dim',
    showVerified: true,
  },
  {
    name: 'SHA-512',
    subtitle: 'SHA-2 High Precision',
    badgeLabel: 'Very Secure',
    badgeStyle: 'bg-primary-container/20 border-primary-container text-primary-fixed-dim',
    outputSize: '512 bits',
    useCases: ['High-security Archiving', 'Digital Sovereignty Systems', 'Scientific Simulation Data'],
    strength: 100,
    barColor: 'bg-primary-container',
    strengthColor: 'text-primary-fixed-dim',
  },
]

const tableData = [
  { name: 'MD5', blockSize: '512 bits', wordSize: '32 bits', rounds: '64', status: 'Deprioritized', statusColor: 'text-error' },
  { name: 'SHA-1', blockSize: '512 bits', wordSize: '32 bits', rounds: '80', status: 'Vulnerable', statusColor: 'text-error' },
  { name: 'SHA-256', blockSize: '512 bits', wordSize: '32 bits', rounds: '64', status: 'Production Ready', statusColor: 'text-secondary-fixed-dim' },
  { name: 'SHA-512', blockSize: '1024 bits', wordSize: '64 bits', rounds: '80', status: 'Critical Guard', statusColor: 'text-primary-container' },
]

export default function AlgorithmInfo() {
  const barRefs = useRef([])

  useEffect(() => {
    const targets = algorithms.map((a) => a.strength)
    barRefs.current.forEach((el, i) => {
      if (el) {
        el.style.width = '0%'
        setTimeout(() => {
          el.style.width = `${targets[i]}%`
        }, 200 + i * 100)
      }
    })
  }, [])

  return (
    <div className="max-w-container-max mx-auto relative z-20">
      <div className="scanline-effect pointer-events-none" />

      {/* Header */}
      <section className="mb-stack-lg">
        <div className="inline-block px-3 py-1 bg-primary-container/10 border border-primary-container/30 text-primary-container text-label-caps font-label-caps mb-4">
          ALGORITHM_DOCUMENTATION_V4.0
        </div>
        <h1 className="text-headline-lg font-headline-lg text-primary mb-2 tracking-tight">Cryptographic Standards</h1>
        <p className="text-body-main font-body-main text-on-surface-variant max-w-2xl">
          Detailed overview of supported hashing algorithms. Select the appropriate standard based on your security requirements and computational constraints.
        </p>
      </section>

      {/* Algorithm Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {algorithms.map((algo, idx) => (
          <div
            key={algo.name}
            className="glass-panel p-6 terminal-glow transition-all duration-300 flex flex-col group"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-headline-md font-headline-md text-primary group-hover:text-primary-container transition-colors">
                    {algo.name}
                  </h2>
                  {algo.showVerified && (
                    <span className="material-symbols-outlined text-primary-container text-sm">verified</span>
                  )}
                </div>
                <p className="text-code-block font-code-block text-on-surface-variant opacity-70">{algo.subtitle}</p>
              </div>
              <div className={`px-3 py-1 border text-label-caps font-label-caps rounded-full ${algo.badgeStyle}`}>
                {algo.badgeLabel}
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center border-b border-outline-variant/30 pb-2">
                <span className="text-label-caps font-label-caps text-on-surface-variant">Output Size</span>
                <span className="text-code-block font-code-block text-primary">{algo.outputSize}</span>
              </div>
              <div className="space-y-2">
                <span className="text-label-caps font-label-caps text-on-surface-variant block">Typical Use Cases</span>
                <ul className="space-y-1">
                  {algo.useCases.map((uc) => (
                    <li key={uc} className="flex items-center gap-2 text-code-block font-code-block text-on-surface">
                      <span className="w-1 h-1 bg-primary-container rounded-full flex-shrink-0" />
                      {uc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-auto">
              <div className="flex justify-between items-center mb-2">
                <span className="text-label-caps font-label-caps text-on-surface-variant">Security Strength</span>
                <span className={`text-code-block font-code-block ${algo.strengthColor}`}>{algo.strength}%</span>
              </div>
              <div className="h-1 bg-surface-container-highest w-full overflow-hidden">
                <div
                  ref={(el) => (barRefs.current[idx] = el)}
                  className={`h-full strength-bar-fill ${algo.barColor}`}
                  style={{ width: '0%' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <section className="mt-stack-lg glass-panel p-6">
        <h3 className="text-headline-md font-headline-md text-primary mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined">analytics</span>
          Performance vs Security
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-code-block text-code-block">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="py-4 px-2 text-on-surface-variant">Algorithm</th>
                <th className="py-4 px-2 text-on-surface-variant">Block Size</th>
                <th className="py-4 px-2 text-on-surface-variant">Word Size</th>
                <th className="py-4 px-2 text-on-surface-variant">Rounds</th>
                <th className="py-4 px-2 text-on-surface-variant">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {tableData.map((row) => (
                <tr key={row.name} className="hover:bg-surface-variant/20 transition-colors">
                  <td className="py-4 px-2 text-primary">{row.name}</td>
                  <td className="py-4 px-2 text-on-surface">{row.blockSize}</td>
                  <td className="py-4 px-2 text-on-surface">{row.wordSize}</td>
                  <td className="py-4 px-2 text-on-surface">{row.rounds}</td>
                  <td className={`py-4 px-2 ${row.statusColor}`}>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
