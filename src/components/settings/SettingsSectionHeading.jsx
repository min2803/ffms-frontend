export default function SettingsSectionHeading({ icon: Icon, title }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      {Icon ? <Icon className="h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" /> : null}
      <h2 className="text-xl font-semibold leading-7 text-text-primary">{title}</h2>
    </div>
  );
}
