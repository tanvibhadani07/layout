"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react"
import Navigation from "./Navigation";
import TeamList from "./TeamList";
import UserProfile from "./UserProfile";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:hidden">
        <h2 className="text-lg font-semibold text-gray-900">Logo</h2>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white transition-transform duration-300 ease-in-out md:static md:z-auto md:w-64 md:translate-x-0 md:border-r md:border-gray-200 lg:w-[280px] ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-5">
        <h2 className="text-lg font-semibold text-gray-900">Logo</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 md:hidden"
            aria-label="Close sidebar"
          >
            {/* <X className="h-5 w-5" /> */}
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-4 pb-4">
          <Navigation onNavigate={() => setOpen(false)} />
          <TeamList />
        </div>

        <UserProfile />
      </aside>
    </>
  );
}
