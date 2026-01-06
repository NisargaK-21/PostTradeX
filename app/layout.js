import "./globals.css";

export const metadata = {
  title: "PostTradeX",
  description: "Post-Trade Settlement, Audit & Analytics Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0b0f14] text-white overflow-x-hidden">
        {/* Navbar */}
        <header className="fixed top-0 left-0 w-full z-50 bg-[#0e131a] border-b border-gray-800">
          <nav className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="text-xl font-bold tracking-wide">
              PostTrade<span className="text-blue-500">X</span>
            </div>

            {/* Navigation Links */}
            <div className="flex gap-6 text-sm text-gray-300">
              <a
                href="/"
                className="hover:text-white transition-colors"
              >
                Dashboard
              </a>
              <a
                href="/settlements"
                className="hover:text-white transition-colors"
              >
                Settlements
              </a>
              <a
                href="/audit"
                className="hover:text-white transition-colors"
              >
                Audit
              </a>
              <a
                href="/analytics"
                className="hover:text-white transition-colors"
              >
                Analytics
              </a>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="pt-20 min-h-screen max-w-7xl mx-auto px-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="mt-20 border-t border-gray-800 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} PostTradeX — Secure Post-Trade Processing
        </footer>
      </body>
    </html>
  );
}
