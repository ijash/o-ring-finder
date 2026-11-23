import { IconMoon, IconSun } from "components/common";
import { useTheme } from "contexts";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

export function ThemeToggle(): JSX.Element {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useTranslation("global");

  const label = isDark ? t("theme.toggleToLight") : t("theme.toggleToDark");

  return (
    <button
      type="button"
      className="btn btn-primary btn-sm me-2 d-inline-flex align-items-center justify-content-center"
      aria-label={label}
      title={label}
      onClick={toggleTheme}
    >
      {isDark ? <IconSun /> : <IconMoon />}
    </button>
  );
}

export default ThemeToggle;
