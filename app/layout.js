import "./globals.css";
import WalletConnect from "./components/WalletConnect";
import Link from "next/link";

export const metadata = {
  title: "PostTradeX",
  description: "Post-Trade Settlement, Audit & Analytics Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0b0f14] text-white overflow-x-hidden">
        <header className="fixed top-0 left-0 w-full z-50 bg-[#0e131a] border-b border-gray-800">
          <nav className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
            <div className="text-lg sm:text-xl font-bold tracking-wide">
              PostTrade<span className="text-blue-500">X</span>
            </div>

            <div className="hidden md:flex gap-6 text-sm text-gray-300">
              <Link
                href="/"
                className="hover:text-white transition-colors"
              >
                Dashboard
              </Link>
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

            <div className="flex items-center gap-4">
              <WalletConnect />
            </div>
          </nav>
        </header>


        <main className="pt-20 min-h-screen max-w-7xl mx-auto px-4 sm:px-8">
          {children}
        </main>

 
        <footer className="mt-20 border-t border-gray-800 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} PostTradeX — Secure Post-Trade Processing
        </footer>

 
        <div id="global-loading" className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-center mt-4">Loading...</p>
          </div>
        </div>

        <div id="global-error" className="hidden fixed bottom-4 right-4 bg-red-600 text-white px-6 py-4 rounded-lg shadow-lg z-50">
          <p id="error-message"></p>
        </div>
      </body>
    </html>
  );
}
