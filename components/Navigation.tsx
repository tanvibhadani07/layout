"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {LayoutDashboard,Users, FolderKanban,CalendarDays, FileText, BarChart3, type LucideIcon,} from "lucide-react";

type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Team", href: "/team", icon: Users },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Calendar", href: "/calendar", icon: CalendarDays },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Reports", href: "/reports", icon: BarChart3 },
];

export default function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation">
      <ul className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <li key={item.name}>
              <Link 
                href={item.href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 transition-colors duration-150 ${
                    isActive
                      ? "text-indigo-600"
                      : "text-gray-400 group-hover:text-gray-600"
                  }`}
                  strokeWidth={1.8}
                />
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
