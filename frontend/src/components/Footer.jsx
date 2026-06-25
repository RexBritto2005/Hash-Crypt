export default function Footer() {
  return (
    <footer className="w-full py-stack-md px-gutter flex justify-between items-center mt-auto border-t border-outline-variant bg-background relative z-40">
      <span className="text-label-caps font-label-caps text-on-surface-variant tracking-widest">
        © 2024 HASH ENCRYPT | SECURE TERMINAL
      </span>
      <div className="flex items-center gap-6">
        <a className="text-label-caps font-label-caps text-on-surface-variant hover:text-secondary transition-colors" href="#">
          Privacy
        </a>
        <a className="text-label-caps font-label-caps text-on-surface-variant hover:text-secondary transition-colors" href="#">
          Documentation
        </a>
        <a className="text-label-caps font-label-caps text-on-surface-variant hover:text-secondary transition-colors" href="#">
          Source
        </a>
      </div>
    </footer>
  )
}
