import { Check, Loader2, Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "../shared";
import userService from "../../services/modules/userService";

/* ──────────────────────── Selected User Tag ──────────────────────── */
function SelectedTag({ user, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
      <span className="grid h-5 w-5 place-content-center rounded-full bg-primary text-[10px] font-bold text-white">
        {(user.name || user.email || "?").charAt(0).toUpperCase()}
      </span>
      <span className="max-w-[120px] truncate">{user.name || user.email}</span>
      <span className="text-[10px] text-text-muted">#{ user.display_id || user.id}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(user.id);
        }}
        className="ml-0.5 grid h-4 w-4 place-content-center rounded-full transition hover:bg-primary/20"
      >
        <X size={10} />
      </button>
    </span>
  );
}

/* ──────────────────────── Search Result Row ──────────────────────── */
function SelectRow({ member, selected, onToggle, isExistingMember }) {
  return (
    <button
      onClick={() => !isExistingMember && onToggle(member)}
      disabled={isExistingMember}
      className={`flex w-full items-center justify-between rounded-sm px-2 py-2.5 transition ${
        isExistingMember
          ? "cursor-not-allowed opacity-50"
          : selected
            ? "bg-bg-subtle"
            : "hover:bg-bg-subtle/60"
      }`}
    >
      <div className="flex items-center gap-3 text-left">
        <div className="grid h-9 w-9 place-content-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {(member.name || member.email || "?").charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text-primary">{member.name}</p>
          <p className="truncate text-xs text-text-secondary">
            <span className="font-mono text-text-muted">UID:{member.display_id || member.id}</span>
            <span className="mx-1">·</span>
            {member.email}
          </p>
        </div>
      </div>

      {isExistingMember ? (
        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
          Already member
        </span>
      ) : (
        <span
          className={`shrink-0 grid h-6 w-6 place-content-center rounded-[8px] border transition ${
            selected
              ? "border-primary bg-primary text-white"
              : "border-border-default bg-white text-transparent"
          }`}
        >
          <Check size={14} />
        </span>
      )}
    </button>
  );
}

/* ────────────────────── Main AddMemberModal ──────────────────────── */
export default function AddMemberModal({
  isOpen = false,
  onClose,
  onSubmit,
  existingMemberIds = [],
}) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]); // full user objects
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

  // ─── Reset state when modal opens/closes ───
  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setSearchResults([]);
      setSelectedUsers([]);
      setSubmitting(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // ─── Debounced search ───
  useEffect(() => {
    const trimmed = searchTerm.trim();
    // Allow 1-char search for numeric UID, require 2+ chars for name/email
    const isNumeric = /^\d+$/.test(trimmed);
    if (!trimmed || (!isNumeric && trimmed.length < 2)) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await userService.searchUsers(searchTerm.trim());
        const data = res?.data ?? res;
        setSearchResults(Array.isArray(data) ? data : []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ─── Lock body scroll ───
  useEffect(() => {
    if (!isOpen) return undefined;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // ─── Toggle user selection ───
  const handleToggle = useCallback((user) => {
    setSelectedUsers((prev) => {
      const exists = prev.some((u) => u.id === user.id);
      return exists ? prev.filter((u) => u.id !== user.id) : [...prev, user];
    });
  }, []);

  const handleRemoveSelected = useCallback((userId) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== userId));
  }, []);

  // ─── Submit ───
  const handleSubmit = async () => {
    if (selectedUsers.length === 0 || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit(selectedUsers.map((u) => u.id));
      // onSubmit handles toast + navigation
    } catch {
      // error handled by parent
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const selectedIds = selectedUsers.map((u) => u.id);
  const selectedCount = selectedUsers.length;

  // Status label for search area
  let statusLabel = t("household.searchUserPlaceholder");
  if (searching) statusLabel = t("common.loading");
  else if (searchTerm.length >= 2 && searchResults.length === 0) statusLabel = t("household.noUsersFound");
  else if (searchResults.length > 0) statusLabel = `${searchResults.length} ${t("common.search").toLowerCase()}`;

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <div
        className="w-full max-w-md rounded-md bg-bg-surface shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b border-border-default px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-text-primary">
              {t("household.inviteMember")}
            </h2>
            <p className="mt-0.5 text-xs text-text-secondary">
              {t("addMember.subtitle")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="grid h-8 w-8 place-content-center rounded-xs text-text-secondary hover:bg-bg-subtle disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 px-5 py-4">
          {/* ── Selected users as tags ── */}
          {selectedCount > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selectedUsers.map((user) => (
                <SelectedTag key={user.id} user={user} onRemove={handleRemoveSelected} />
              ))}
            </div>
          )}

          {/* ── Search input ── */}
          <div className="flex items-center gap-2 rounded-sm border border-border-default bg-bg-subtle px-3 py-2.5 transition-colors focus-within:border-primary">
            {searching ? (
              <Loader2 size={16} className="animate-spin text-primary" />
            ) : (
              <Search size={16} className="text-input-icon" />
            )}
            <input
              ref={inputRef}
              placeholder={t("household.searchUserPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-input-placeholder"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSearchResults([]);
                  inputRef.current?.focus();
                }}
                className="shrink-0 rounded p-0.5 text-text-secondary hover:text-text-primary"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* ── Search results dropdown ── */}
          <div>
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[1px] text-text-muted">
              {statusLabel}
            </p>
            <div className="max-h-52 space-y-0.5 overflow-y-auto rounded-sm">
              {searchResults.map((member) => (
                <SelectRow
                  key={member.id}
                  member={member}
                  selected={selectedIds.includes(member.id)}
                  onToggle={handleToggle}
                  isExistingMember={existingMemberIds.includes(member.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="space-y-2 border-t border-border-default px-5 py-4">
          <PrimaryButton onClick={handleSubmit} disabled={selectedCount === 0 || submitting} className="w-full">
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                {t("household.inviting")}
              </span>
            ) : (
              `${t("household.addMember")} (${selectedCount})`
            )}
          </PrimaryButton>
        </div>
      </div>
    </div>,
    document.body
  );
}
