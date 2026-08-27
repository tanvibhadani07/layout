"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import {
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";

export default function MainContent({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  const [
    isProfileOpen,
    setIsProfileOpen,
  ] = useState(false);

  const profileRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target as Node
        )
      ) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex min-h-0 flex-1 flex-col bg-slate-50">

        {/* HEADER */}

        <header className="relative flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 sm:px-8">

          {/* SEARCH */}

          <div className="flex items-center gap-3">
            <Search
              size={20}
              strokeWidth={1.7}
              className="text-slate-400"
            />

            <input
              type="text"
              placeholder="Search"
              className="w-248 bg-transparent text-sm text-gray-700 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {/* RIGHT */}

          <div className="flex items-center">

            {/* BELL */}

            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-gray-50"
            >
              <Bell
                size={20}
                strokeWidth={1.7}
              />
            </button>

            <div className="mx-4 h-6 w-px bg-gray-200" />

            {/* PROFILE */}

            <div
              ref={profileRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() =>
                  setIsProfileOpen(
                    (previous) =>
                      !previous
                  )
                }
                className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-gray-50"
              >

                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Profile"
                  className="h-8 w-8 rounded-full"
                />

                <span className="hidden text-sm font-semibold text-gray-800 sm:block">
                  Tom Cook
                </span>

                <ChevronDown
                  size={16}
                  strokeWidth={1.7}
                  className={`text-slate-400 transition-transform ${
                    isProfileOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-full z-50 mt-1 w-32 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(
                        false
                      );

                      alert(
                        "Your profile"
                      );
                    }}
                    className="block w-full px-3 py-3 text-left text-sm text-gray-800 hover:bg-gray-50"
                  >
                    Your profile
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(
                        false
                      );

                      alert("Sign out");
                    }}
                    className="block w-full px-3 py-3 text-left text-sm text-gray-800 hover:bg-gray-50"
                  >
                    Sign out
                  </button>

                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT */}

        <div className="flex-1 p-4 sm:p-6">

          <div className="h-full min-h-0 rounded-xl border border-gray-200 bg-white">

            <h1 className="p-3 text-center text-xl font-semibold text-black">
              {title}
            </h1>

            {description && (
              <p className="p-4 text-sm text-gray-500">
                {description}
              </p>
            )}

            {children}

          </div>
        </div>

      </div>
    </div>
  );
}