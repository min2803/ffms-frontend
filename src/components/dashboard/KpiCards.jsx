import { ShieldCheck } from "lucide-react";

/**
 * KPI metric cards row.
 *
 * @param {Object}  props
 * @param {Array}   props.cards – array of card objects:
 *   {
 *     title:       string,       – label text (e.g. "Total Income")
 *     value:       string,       – formatted value (e.g. "42.850.000 ₫")
 *     icon:        LucideIcon,   – icon component
 *     iconBg:      string,       – Tailwind classes for icon wrapper (e.g. "bg-blue-50 text-blue-600")
 *     highlighted: boolean,      – if true, renders the blue gradient variant
 *     badge:       string|null,  – optional badge text (e.g. "Secured by Vault-Tech")
 *   }
 */
export default function KpiCards({ cards = [] }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {cards.map((card) => {
        const Icon = card.icon;

        if (card.highlighted) {
          return (
            <article
              key={card.title}
              className="rounded-md bg-gradient-to-br from-primary to-primary-dark p-5 text-text-inverse shadow-md"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-200">
                {card.title}
              </p>
              <p className="mt-2 text-3xl font-bold">{card.value}</p>
              {card.badge && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-blue-100">
                  <ShieldCheck size={13} />
                  <span>{card.badge}</span>
                </div>
              )}
            </article>
          );
        }

        return (
          <article
            key={card.title}
            className="rounded-md border border-border-default bg-bg-surface p-5 shadow-soft"
          >
            <div className={`mb-3 inline-grid h-9 w-9 place-content-center rounded-xs ${card.iconBg}`}>
              <Icon size={16} />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-soft">
              {card.title}
            </p>
            <p className="mt-1 text-3xl font-bold text-text-primary">{card.value}</p>
          </article>
        );
      })}
    </section>
  );
}
