import { useState } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";

export default function UserListToolbar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-3">
        <div className="relative max-w-[320px] flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-input-icon"
            size={16}
          />
          <input
            type="text"
            placeholder="Filter by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full rounded-sm border border-border-default bg-bg-surface py-2 pl-9 pr-3 text-sm text-text-primary placeholder-input-placeholder shadow-soft transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="relative">
          <select className="appearance-none rounded-sm border border-border-default bg-bg-surface py-2 pl-4 pr-10 text-sm font-semibold text-text-primary shadow-soft transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
            <option>All Roles</option>
            <option>Admin</option>
            <option>User</option>
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-input-icon"
          />
        </div>

        <button
          type="button"
          className="grid h-9 w-9 shrink-0 place-content-center rounded-sm border border-border-default bg-bg-surface text-text-secondary shadow-soft transition hover:bg-bg-subtle hover:text-text-primary"
        >
          <SlidersHorizontal size={16} />
        </button>
      </div>
    </div>
  );
}
