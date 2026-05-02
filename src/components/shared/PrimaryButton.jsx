export default function PrimaryButton({
  children,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-sm bg-gradient-to-br from-primary to-primary-2 px-4 py-2.5 text-sm font-semibold text-text-inverse shadow-button-sm transition hover:opacity-95 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
