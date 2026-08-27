export default function UserProfile() {
  return (
    <div className="border-t border-gray-200 px-4 py-4">
      <button type="button" className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors duration-150 hover:bg-gray-100">
         
         <span className="text-xs font-semibold text-gray-700">

                 <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" className="inline-block size-8 rounded-full ring-2 ring-gray-900 outline -outline-offset-1 outline-white/10" />

                </span>

        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-gray-900">
            Tom Cook
          </span>

          <span className="block truncate text-xs text-gray-500">
            View profile
          </span>
        </span>
        
      </button>
    </div>
  );
}
