export default function SectionCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-md border border-border-default bg-bg-surface shadow-soft ${className}`}
    >
      {children}
    </div>
  );
}
