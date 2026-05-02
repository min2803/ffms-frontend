import { ChevronLeft, ChevronRight, Eye, Pencil, Trash2 } from "lucide-react";
import { RoleBadge } from "../shared";
import UserStatusBadge from "./UserStatusBadge";

export default function UserListTable({ users = [], total = 0, page = 1, limit = 10, onView, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] border-collapse text-left text-sm text-text-primary">
        <thead>
          <tr className="border-b border-border-default bg-bg-page/50">
            <th className="py-4 pl-6 pr-4 font-bold uppercase tracking-wider text-text-secondary">
              USER ID
            </th>
            <th className="px-4 py-4 font-bold uppercase tracking-wider text-text-secondary">
              EMAIL ADDRESS
            </th>
            <th className="px-4 py-4 font-bold uppercase tracking-wider text-text-secondary">
              ROLE
            </th>
            <th className="px-4 py-4 font-bold uppercase tracking-wider text-text-secondary">
              STATUS
            </th>
            <th className="px-4 py-4 font-bold uppercase tracking-wider text-text-secondary">
              CREATED DATE
            </th>
            <th className="py-4 pl-4 pr-6 text-right font-bold uppercase tracking-wider text-text-secondary">
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-default bg-bg-surface">
          {users.map((user) => (
            <tr
              key={user.id}
              className="group transition-colors hover:bg-bg-subtle"
            >
              <td className="py-4 pl-6 pr-4 font-bold">{user.id}</td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <img
                    className="h-8 w-8 rounded-full object-cover shadow-soft"
                    src={user.avatar}
                    alt={user.name}
                  />
                  <div>
                    <p className="font-bold text-text-primary">
                      {user.email}
                    </p>
                    <p className="text-xs font-semibold text-text-muted">
                      {user.name}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <RoleBadge role={user.role} />
              </td>
              <td className="px-4 py-4">
                <UserStatusBadge status={user.status} />
              </td>
              <td className="px-4 py-4 text-[13px] font-medium text-text-muted">
                {user.createdDate}
              </td>
              <td className="py-4 pl-4 pr-6 text-right">
                <div className="flex items-center justify-end gap-3 text-text-soft">
                  <button onClick={() => onView?.(user)} className="transition-colors hover:text-text-primary">
                    <Eye size={16} />
                  </button>
                  <button onClick={() => onEdit?.(user)} className="transition-colors hover:text-text-primary">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => onDelete?.(user)} className="transition-colors hover:text-state-error">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between border-t border-border-default px-6 py-4">
        <p className="text-xs text-text-muted">
          Showing{" "}
          <span className="font-bold text-text-primary">
            {total === 0 ? 0 : (page - 1) * limit + 1}–{Math.min(page * limit, total)}
          </span>{" "}
          of {total} users
        </p>
        <div className="flex gap-2 text-text-muted">
          <button className="p-1 transition hover:text-text-primary">
            <ChevronLeft size={16} />
          </button>
          <button className="p-1 transition hover:text-text-primary">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
