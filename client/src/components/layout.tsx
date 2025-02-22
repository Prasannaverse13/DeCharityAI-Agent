import { Link, useLocation } from "wouter";
import { WalletConnect } from "./wallet-connect";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="border-b border-cyan-500/20 bg-black/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/">
                <a className="text-2xl font-bold text-cyan-400">DeCharity AI</a>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <a className={`text-sm ${location === "/dashboard" ? "text-cyan-400" : "text-gray-400"}`}>
                  Dashboard
                </a>
              </Link>
              <Link href="/history">
                <a className={`text-sm ${location === "/history" ? "text-cyan-400" : "text-gray-400"}`}>
                  History
                </a>
              </Link>
              <WalletConnect />
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
