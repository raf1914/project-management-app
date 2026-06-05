import Link from "next/link";
import { NavLink } from "./nav-link";
import { DashboardIcon, FolderIcon, PlusIcon } from "./icons";

export function Sidebar() {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-neon-purple/20 bg-[#0c0420]/80 backdrop-blur-md md:h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-neon-blue to-neon-cyan text-sm font-bold text-[#04070d] shadow-[0_0_18px_-2px_rgba(46,230,255,0.85)]">
          PM
        </span>
        <div className="leading-tight">
          <p className="font-display text-sm font-bold uppercase tracking-wider text-ink text-glow-sm">
            Project Hub
          </p>
          <p className="text-xs uppercase tracking-[0.2em] text-neon-cyan/70">
            Workspace
          </p>
        </div>
      </div>

      <nav className="flex flex-row gap-1 px-3 pb-3 md:flex-col md:pb-0">
        <NavLink href="/" exact>
          <DashboardIcon width={18} height={18} />
          Dashboard
        </NavLink>
        <NavLink href="/projects">
          <FolderIcon width={18} height={18} />
          Projects
        </NavLink>
      </nav>

      <div className="mt-auto hidden p-3 md:block">
        <Link
          href="/projects/new"
          className="btn-neon w-full justify-center"
        >
          <PlusIcon width={16} height={16} />
          New Project
        </Link>
      </div>
    </aside>
  );
}
