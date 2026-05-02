import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-subtle p-6">
      <div className="text-center">
        <p className="text-8xl font-bold text-primary">404</p>
        <h1 className="mt-4 text-2xl font-bold text-text-primary">{t("notFound.title")}</h1>
        <p className="mt-2 text-sm text-text-secondary">{t("notFound.message")}</p>
        <Link to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-sm bg-gradient-to-br from-primary to-primary-2 px-6 py-3 text-sm font-bold text-text-inverse shadow-button-sm">
          <ArrowLeft size={16} />{t("notFound.goHome")}
        </Link>
      </div>
    </div>
  );
}
