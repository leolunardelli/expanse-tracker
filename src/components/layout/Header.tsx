import { useTheme } from '../../context/ThemeContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass-card border-0 border-b border-dark-200/50 dark:border-dark-700/50 rounded-none">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Brand */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent-500 rounded-full border-2 border-white dark:border-dark-800 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-dark-900 dark:text-white">
                  Expense<span className="text-gradient">Flow</span>
                </h1>
                <p className="text-xs text-dark-500 dark:text-dark-400">Smart Money Management</p>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Quick Stats Badge */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-accent-50 dark:bg-accent-900/20 rounded-xl">
                <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-accent-700 dark:text-accent-400">
                  Tracking Active
                </span>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="relative p-3 rounded-xl bg-dark-100 dark:bg-dark-700 hover:bg-dark-200 dark:hover:bg-dark-600 transition-all duration-300 group"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                <div className="relative w-5 h-5">
                  {/* Sun Icon */}
                  <svg
                    className={`absolute inset-0 w-5 h-5 text-amber-500 transition-all duration-300 ${
                      theme === 'dark' ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  {/* Moon Icon */}
                  <svg
                    className={`absolute inset-0 w-5 h-5 text-primary-400 transition-all duration-300 ${
                      theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                </div>
              </button>

              {/* User Avatar */}
              <button className="flex items-center gap-3 p-1.5 pr-4 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-700 transition-all duration-200">
                <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-primary-500/20">
                  U
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-dark-900 dark:text-white">User</p>
                  <p className="text-xs text-dark-500 dark:text-dark-400">Free Plan</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
