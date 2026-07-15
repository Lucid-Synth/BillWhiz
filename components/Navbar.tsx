import Image from "next/image";

function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/6 backdrop-blur-md bg-[#0A0B0F]/70">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center">
            <Image
              src="https://i.pinimg.com/736x/b2/5c/5e/b25c5eb015bb5cfa887b9cd5fd9d5818.jpg"
              alt="Logo"
              width={28}
              height={28}
              className="object-cover"
            />
          </div>
          <span className="font-semibold text-sm tracking-wide">BillWhiz</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/50">
          <a href="#how" className="hover:text-white transition-colors">
            How it works
          </a>
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#pricing" className="hover:text-white transition-colors">
            Pricing
          </a>
        </nav>
        <a
          href="/signup"
          className="text-sm px-4 py-1.5 rounded-lg bg-amber-400 text-[#0A0B0F] font-semibold hover:bg-amber-300 transition-colors"
        >
          Get started
        </a>
      </div>
    </header>
  );
}

export default Navbar;
