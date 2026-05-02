import { ChevronDown, Trash2, UserPlus, Users } from "lucide-react";
import { RoleBadge, SectionCard, SectionContainer } from "../shared";
import { getAvatarUrl } from "../../utils/avatar";

const PREVIEW_COUNT = 5;

export default function MemberManagement({ members, showAll = false, onAddMember, onShowAll, onRemove }) {
  const visibleMembers = showAll ? members : members.slice(0, PREVIEW_COUNT);
  const hasMore = members.length > PREVIEW_COUNT;
  return (
    <SectionCard className="flex h-full flex-col pt-6">
      <div className="px-6">
        <SectionContainer
          title={
            <span className="inline-flex items-center gap-2">
              <Users size={20} className="text-primary" />
              Member Management
            </span>
          }
          subtitle="Manage access roles for each member of the household."
          action={
            <button
              onClick={onAddMember}
              className="flex items-center gap-2 rounded-sm bg-bg-badge px-4 py-2.5 text-sm font-semibold text-primary transition hover:opacity-80"
            >
              <UserPlus size={16} />
              Add Member
            </button>
          }
        />
      </div>

      <div className="w-full flex-1">
        <div className="grid grid-cols-12 gap-4 border-b border-t border-border-default bg-bg-subtle px-6 py-3 text-[10px] font-bold uppercase tracking-[1px] text-text-muted">
          <div className="col-span-6">Member</div>
          <div className="col-span-3">Role</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>

        <ul className="divide-y divide-border-default px-6">
          {visibleMembers.map((member) => (
            <li key={member.id || member.user_id} className="grid grid-cols-12 items-center gap-4 py-4">
              <div className="col-span-6 flex items-center gap-3">
                <img
                  src={member.avatar || getAvatarUrl(member.name, 40)}
                  alt={member.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-text-primary">
                    {member.name}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {member.email}
                  </p>
                </div>
              </div>
              <div className="col-span-3">
                <RoleBadge role={member.role} />
              </div>
              <div className="col-span-3 text-right">
                {member.role === "owner" ? (
                  <span className="text-sm text-text-secondary">Owner</span>
                ) : onRemove ? (
                  <button
                    onClick={() => {
                      if (window.confirm(`Remove ${member.name} from household?`)) {
                        onRemove(member.id || member.user_id);
                      }
                    }}
                    className="inline-flex items-center gap-1 rounded-xs px-2 py-1 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                ) : (
                  <div className="flex justify-end">—</div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {hasMore && (
        <div className="flex border-t border-border-default p-4">
          <button
            onClick={onShowAll}
            className="mx-auto flex items-center gap-1.5 text-xs font-semibold text-text-secondary transition hover:text-text-primary"
          >
            <ChevronDown size={14} className={showAll ? "rotate-180 transition-transform" : "transition-transform"} />
            {showAll ? "Show Less" : `Show All ${members.length} Members`}
          </button>
        </div>
      )}
    </SectionCard>
  );
}
