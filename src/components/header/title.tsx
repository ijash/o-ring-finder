import React from "react";
import { useTranslation } from "react-i18next";
import { names } from "utils";

export const Title: React.FC = () => {
  const { t } = useTranslation("global");
  const title = t("header.title");

  return (
    <div className="position-relative text-center px-2">
      <title>{t("meta.title")}</title>
      <meta
        name={t("meta.title")}
        content={t("meta.description", { author: names.author.name })}
      />

      <h1 className="h1 mt-3">{title}</h1>
      <p>
        <small>
          {t("header.description")}
          <a href={names.author.url} target="_blank" rel="noreferrer">
            {" "}
            {names.author.name}
          </a>
        </small>
      </p>
    </div>
  );
};
