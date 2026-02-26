export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-display text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          optimism.fun
        </div>
        <p className="text-slate-500 text-sm">
          Problems are infinite. Solutions are infinite.
        </p>
      </div>
    </footer>
  )
}
