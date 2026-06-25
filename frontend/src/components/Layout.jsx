import { Outlet, NavLink, useLocation } from 'react-router-dom'
import Footer from './Footer'

export default function Layout() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Generator' },
    { path: '/verifier', label: 'Verifier' },
    { path: '/file-hasher', label: 'File Hasher' },
    { path: '/info', label: 'Info' },
  ]

  const sideNavItems = [
    { path: '/history', icon: 'history', label: 'History' },
    { path: '#', icon: 'key', label: 'Saved Keys' },
    { path: '#', icon: 'terminal', label: 'Logs' },
    { path: '#', icon: 'security', label: 'Sessions' },
  ]

  return (
    <div className="bg-background text-on-background font-body-main selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col overflow-x-hidden">
      {/* TopNavBar */}
      <header className="bg-background dark:bg-background border-b border-outline-variant fixed top-0 w-full z-40">
        <div className="flex justify-between items-center w-full px-gutter h-16 max-w-container-max mx-auto">
          <div className="flex items-center gap-8">
            <span className="text-headline-md font-headline-md font-bold text-primary dark:text-primary tracking-tighter">
              Hash Encrypt
            </span>
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    isActive
                      ? 'text-primary border-b-2 border-primary-container pb-1 text-label-caps font-label-caps'
                      : 'text-on-surface-variant hover:text-primary transition-colors text-label-caps font-label-caps'
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <NavLink
              to="/history"
              className="p-2 hover:bg-surface-variant/50 transition-all duration-200 active:scale-95 text-on-surface-variant"
            >
              <span className="material-symbols-outlined">history</span>
            </NavLink>
            <button className="p-2 hover:bg-surface-variant/50 transition-all duration-200 active:scale-95 text-on-surface-variant">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* SideNavBar */}
      <aside className="fixed left-0 top-0 h-full z-50 flex flex-col bg-surface-container-low/95 dark:bg-surface-container-low/95 backdrop-blur-xl border-r border-outline-variant w-72 transform -translate-x-full lg:translate-x-0 transition-transform duration-300">
        <div className="p-stack-md mt-16 border-b border-outline-variant">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-surface-container-high border border-outline-variant flex items-center justify-center">
              <span className="material-symbols-outlined text-primary-container">terminal</span>
            </div>
            <div>
              <div className="text-label-caps font-label-caps text-primary-container">Terminal Session</div>
              <div className="text-code-block font-code-block text-[10px] text-on-surface-variant">ID: SHA-256-0X4F</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 py-4">
          {sideNavItems.map((item, idx) => {
            const isActive = location.pathname === item.path
            return (
              <NavLink
                key={idx}
                to={item.path}
                className={
                  isActive
                    ? 'flex items-center gap-3 bg-secondary-container/20 text-secondary-fixed-dim border-l-4 border-secondary-fixed-dim px-4 py-3 cursor-pointer group'
                    : 'flex items-center gap-3 text-on-surface-variant px-4 py-3 hover:bg-surface-variant cursor-pointer group transition-all'
                }
              >
                <span className={`material-symbols-outlined ${!isActive && 'group-hover:text-primary-container'}`}>
                  {item.icon}
                </span>
                <span className={`text-label-caps font-label-caps ${!isActive && 'group-hover:text-primary-container'}`}>
                  {item.label}
                </span>
              </NavLink>
            )
          })}
        </nav>
        <div className="p-gutter">
          <button className="w-full py-2 border border-secondary-fixed-dim text-secondary-fixed-dim text-label-caps font-label-caps hover:bg-secondary-fixed-dim/10 transition-all active:scale-95">
            Clear History
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 mt-16 lg:ml-72 p-gutter relative overflow-hidden">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
