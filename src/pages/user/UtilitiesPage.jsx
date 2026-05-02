import { useState } from "react";
import { useTranslation } from "react-i18next";
import UserLayout from "../../components/layout/UserLayout";
import { Sidebar, Header } from "../../components/dashboard";
import {
  ConsumptionHistoryCard,
  MeterHistoryCard,
  UtilityRecommendationCard,
  UtilityStatCard,
  AddUtilityModal,
} from "../../components/utilities";
import { Zap, Droplets, DollarSign, BarChart3, Plus } from "lucide-react";
import { getNavigationItems } from "../../data/navigation";
import useUtilities from "../../hooks/useUtilities";
import { useToast } from "../../contexts/ToastContext";
import { useAppContext } from "../../contexts/AppContext";

const statIconMap = {
  usage: Zap,
  cost: DollarSign,
  avg: BarChart3,
};

const MONTH_LABELS_VI = ["Thg 1","Thg 2","Thg 3","Thg 4","Thg 5","Thg 6","Thg 7","Thg 8","Thg 9","Thg 10","Thg 11","Thg 12"];
const MONTH_LABELS_EN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function UtilitiesPage() {
  const { t, i18n } = useTranslation();
  const { currency } = useAppContext();
  const toast = useToast();
  const lang = i18n.language;
  const [sidebarCollapsed] = useState(false);
  const [utilityType, setUtilityType] = useState("electricity");
  const [showAddModal, setShowAddModal] = useState(false);
  const { consumption, loading, error, addReading } = useUtilities({ type: utilityType });
  const navItems = getNavigationItems("utilities", undefined, t);

  const isElectricity = utilityType === "electricity";
  const unitLabel = isElectricity ? "kWh" : "m³";
  const currencySymbol = currency === "VND" ? "₫" : "$";
  const currencyCode = currency === "VND" ? "VND" : "USD";
  const locale = lang === "vi" ? "vi-VN" : "en-US";
  const monthLabels = lang === "vi" ? MONTH_LABELS_VI : MONTH_LABELS_EN;

  // Format a raw number as currency string
  const fmtCurrency = (val) => {
    if (val == null) return "0";
    return Number(val).toLocaleString(locale, { maximumFractionDigits: 0 });
  };

  // Transform backend raw stats into display-ready objects
  const formatStats = (rawStats) => {
    if (!rawStats?.length) return [];
    return rawStats.map((stat) => {
      let label, value;
      switch (stat.id) {
        case "usage":
          label = t("utilities.statUsage", "Tổng sử dụng");
          value = `${Number(stat.rawValue).toFixed(1)} ${unitLabel}`;
          break;
        case "cost":
          label = t("utilities.statCost", "Tổng chi phí");
          value = `${fmtCurrency(stat.rawValue)} ${currencyCode}`;
          break;
        case "avg":
          label = t("utilities.statAvg", "Chi phí TB/Lần");
          value = `${fmtCurrency(stat.rawValue)} ${currencyCode}`;
          break;
        default:
          label = stat.id;
          value = String(stat.rawValue);
      }
      return { ...stat, label, value };
    });
  };

  // Chart labels from month indexes
  const chartLabels = (consumption?.chartMonthIndexes || []).map((idx) => monthLabels[idx]);

  // Format meter history items
  const formatMeterHistory = (items) => {
    if (!items?.length) return [];
    return items.map((item) => {
      const dateLabel = item.date
        ? new Date(item.date).toLocaleDateString(locale, { day: "numeric", month: "numeric", year: "numeric" })
        : "";
      const typeLabel = item.type === "electricity" ? t("utilities.electricity") : t("utilities.water");
      const delta = `${typeLabel} ${fmtCurrency(item.cost)} ${currencySymbol}`;
      return { ...item, dateLabel, delta, type: typeLabel };
    });
  };

  const displayStats = formatStats(consumption?.topStats);
  const displayMeterHistory = formatMeterHistory(consumption?.meterHistory);

  const handleAddReading = async (payload) => {
    await addReading(payload);
    toast.success(t("utilityModal.saveSuccess", "Đã lưu chỉ số thành công!"));
  };

  const activeBtn = "inline-flex items-center gap-2 rounded-xs bg-bg-surface px-3 py-1.5 text-xs font-semibold text-primary shadow-sm";
  const inactiveBtn = "inline-flex items-center gap-2 rounded-xs px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition";

  return (
    <UserLayout
      sidebar={<Sidebar navItems={navItems} collapsed={sidebarCollapsed} />}
      header={
        <Header title={t("utilities.title")}>
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-sm bg-bg-subtle p-1">
              <button
                type="button"
                onClick={() => setUtilityType("electricity")}
                className={utilityType === "electricity" ? activeBtn : inactiveBtn}
              >
                <Zap size={14} />
                {t("utilities.electricity")}
              </button>
              <button
                type="button"
                onClick={() => setUtilityType("water")}
                className={utilityType === "water" ? activeBtn : inactiveBtn}
              >
                <Droplets size={14} />
                {t("utilities.water")}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xs bg-primary px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
            >
              <Plus size={14} />
              {t("utilityModal.addButton", "Thêm chỉ số")}
            </button>
          </div>
        </Header>
      }
      sidebarCollapsed={sidebarCollapsed}
      headerContainerClassName="max-w-[1320px]"
      contentContainerClassName="max-w-[1320px]"
    >
      <div className="grid grid-cols-1 gap-4 desktop:grid-cols-12 mt-4">
        {loading ? (
          <div className="desktop:col-span-12 py-10 text-center font-medium text-text-secondary">
            {t("utilities.loadingUtilities")}
          </div>
        ) : error ? (
          <div className="desktop:col-span-12 py-10 text-center font-medium text-red-500">
            {t("common.errorPrefix")} {error}
          </div>
        ) : (
          <>
            <div className="space-y-4 desktop:col-span-9">
              <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
                {displayStats.length > 0 ? (
                  displayStats.map((metric) => (
                    <UtilityStatCard
                      key={metric.id}
                      icon={statIconMap[metric.id] || Zap}
                      title={metric.label}
                      value={metric.value}
                      footerLabel={t("utilities.footerLabel")}
                      footerValue={metric.trend}
                    />
                  ))
                ) : (
                  <div className="tablet:col-span-2 desktop:col-span-3 p-6 bg-bg-surface rounded-md border border-dashed border-border text-center text-text-secondary">
                    {t("utilities.noConsumptionData")}
                  </div>
                )}
                {consumption?.recommendation && (
                  <UtilityRecommendationCard
                    title={t("utilities.recommendationTitle", "Mẹo tiết kiệm")}
                    message={isElectricity
                      ? t("utilities.recommendationElectricity", "Hãy sử dụng thiết bị điện vào giờ thấp điểm để giảm chi phí.")
                      : t("utilities.recommendationWater", "Kiểm tra đường ống thường xuyên để tránh rò rỉ nước.")}
                  />
                )}
              </div>

              <ConsumptionHistoryCard
                title={t("utilities.consumptionHistory", "Lịch sử tiêu thụ")}
                subtitle={isElectricity
                  ? t("utilities.consumptionSubElectricity", "Lượng điện tiêu thụ (kWh) theo tháng")
                  : t("utilities.consumptionSubWater", "Lượng nước tiêu thụ (m³) theo tháng")}
                labels={chartLabels}
                upperValues={consumption?.chartUpperBars || []}
                lowerValues={consumption?.chartLowerBars || []}
              />
            </div>

            <div className="desktop:col-span-3">
              <MeterHistoryCard
                title={t("utilities.meterHistory", "Lịch sử ghi nhận")}
                viewAllLabel={t("utilities.viewFullHistory", "Xem toàn bộ")}
                items={displayMeterHistory}
              />
            </div>
          </>
        )}
      </div>

      <AddUtilityModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddReading}
        utilityType={utilityType}
      />
    </UserLayout>
  );
}
