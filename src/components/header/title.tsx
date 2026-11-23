import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { names } from "utils";

export const Title: React.FC = () => {
  const { t } = useTranslation("global");
  const title = t("header.title");
  const metaTitle = t("meta.title");
  const metaDescription = t("meta.description", { author: names.author.name });

  useEffect(() => {
    document.title = metaTitle;
    let metaTag = document.querySelector('meta[name="description"]');
    if (!metaTag) {
      metaTag = document.createElement("meta");
      metaTag.setAttribute("name", "description");
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute("content", metaDescription);
  }, [metaTitle, metaDescription]);

  return (
    <div className="position-relative text-center px-2">
      <title>{metaTitle}</title>
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
