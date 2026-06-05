import Link from "next/link";
import { NavLink } from "./nav-link";
import { DashboardIcon, FolderIcon, PlusIcon } from "./icons";

export function Sidebar() {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-slate-200 bg-white md:h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
          PM
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-slate-800">Project Hub</p>
          <p className="text-xs text-slate-400">Workspace</p>
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
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
        >
          <PlusIcon width={16} height={16} />
          New Project
        </Link>
      </div>
    </aside>
  );
}
