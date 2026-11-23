import React from "react";
import { useTranslation } from "react-i18next";
import { names } from "utils";

const style = "text-center";
export const FooterText: React.FC = () => {
  const { t } = useTranslation("global");
  return (
    <footer>
      <div className={`${style} small text-muted`}>
        <p className="mb-1">
          {t("footer.issueDesc")}
          <a
            href="https://github.com/ijash/o-ring-finder/issues"
            target="_blank"
            rel="noreferrer"
          >
            {t("footer.issueLinkName")}
          </a>
        </p>
        <p className="mb-1">{t("footer.contribDesc")}</p>
        <p className="mb-0">
          {t("footer.version")} {names.version}
        </p>
      </div>
    </footer>
  );
};
