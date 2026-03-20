export default function Navbar() {
  return (
    <header className="w-full border-b border-[#222] bg-[#0a0a0a] sticky top-0 z-50">
      <div className="w-full bg-[#FDA4AF] border-b border-[#1a1a1a]">
        <div className="flex h-8 items-center justify-center">
          <p className="text-xs text-black">
            Crypto Trend.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main nav */}
        <div className="flex h-12 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-[#e5e5e5] font-semibold text-sm tracking-wide">
              crypto<span className="text-[#666]">saas</span>
            </span>
          </div>

          {/* Links */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-xs text-[#888] hover:text-[#e5e5e5] transition-colors">Markets</a>
            <a href="#" className="text-xs text-[#888] hover:text-[#e5e5e5] transition-colors">Portfolio</a>
            <a href="#" className="text-xs text-[#888] hover:text-[#e5e5e5] transition-colors">News</a>
          </nav>

          {/* Action */}
          <button className="text-xs border border-[#333] text-black hover:border-[#555] hover:text-[#e5e5e5] bg-rose-200 transition-colors rounded px-3 py-1.5">
            Connect Wallet
          </button>
        </div>
      </div>
    </header>
  );
}