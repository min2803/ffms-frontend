import { useMemo, useState } from "react";
import UserLayout from "../components/layout/UserLayout";
import { Sidebar } from "../components/dashboard";
import {
  ConsumptionHistoryCard,
  MeterHistoryCard,
  UtilitiesHeaderBar,
  UtilityRecommendationCard,
  UtilityStatCard,
} from "../components/utilities";
import { getNavigationItems } from "../data/navigation";
import useUtilities from "../hooks/useUtilities";

export default function UtilitiesPage() {
  const [sidebarCollapsed] = useState(false);
  const { consumption, loading, error } = useUtilities();
  const navItems = getNavigationItems("utilities");

  return (
    <UserLayout
      sidebar={<Sidebar navItems={navItems} collapsed={sidebarCollapsed} />}
      showHeader={false}
      sidebarCollapsed={sidebarCollapsed}
      headerContainerClassName="max-w-[1320px]"
      contentContainerClassName="max-w-[1320px]"
    >
      <UtilitiesHeaderBar title="Household Resource Tracking" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {loading ? (
          <div className="lg:col-span-12 py-10 text-center font-medium text-[var(--color-text-secondary)]">
            Loading utilities data...
          </div>
        ) : error ? (
          <div className="lg:col-span-12 py-10 text-center font-medium text-red-500">
            Error: {error}
          </div>
        ) : (
          <>
            <div className="space-y-4 lg:col-span-9">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {(consumption?.topStats || []).map((metric) => (
                  <UtilityStatCard key={metric.id} {...metric} />
                ))}
                {consumption?.recommendation && (
                  <UtilityRecommendationCard {...consumption.recommendation} />
                )}
              </div>

              <ConsumptionHistoryCard
                labels={consumption?.chartLabels || []}
                upperValues={consumption?.chartUpperBars || []}
                lowerValues={consumption?.chartLowerBars || []}
              />
            </div>

            <div className="lg:col-span-3">
              <MeterHistoryCard items={consumption?.meterHistory || []} />
            </div>
          </>
        )}
      </div>
    </UserLayout>
  );
}
