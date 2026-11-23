import { IconLanguage } from "components/common";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default function LanguageDropdown() {
  const { t, i18n } = useTranslation("global");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useEffect(() => {
    if (!isOpen) return;

    function handleOutsideClick(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function changeLanguage(lang: string) {
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
    setIsOpen(false);
  }

  return (
    <div className="dropdown d-flex" ref={dropdownRef}>
      <button
        className="btn btn-primary btn-sm dropdown-toggle"
        type="button"
        aria-expanded={isOpen}
        aria-label={t("langSelect.display")}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <IconLanguage />
      </button>
      <ul
        className={`dropdown-menu dropdown-menu-end${isOpen ? " show" : ""}`}
      >
        <li>
          <button
            className={`dropdown-item ${
              i18n.language === "en" ? "disabled" : ""
            }`}
            onClick={() => changeLanguage("en")}
          >
            🇬🇧 English
          </button>
        </li>
        <li>
          <button
            className={`dropdown-item ${
              i18n.language === "id" ? "disabled" : ""
            }`}
            onClick={() => changeLanguage("id")}
          >
            🇮🇩 Indonesia
          </button>
        </li>
      </ul>
    </div>
  );
}
