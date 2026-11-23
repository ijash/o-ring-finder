import { useTranslation } from "react-i18next";
import LanguageDropdown from "./languageDropdown";

export function NavBar() {
  const { t } = useTranslation("global");
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Adds a smooth scrolling effect
    });
  };

  return (
    <header className="sticky-top">
      <nav className="navbar bg-primary shadow-sm">
        <div className="container">
          <h2
            className="ms-2"
            style={{
              color: "#1375AC",
              textShadow: "#54b2e9 1px 1px 0",
            }}
          >
            <button
              type="button"
              className="btn p-0 border-0 bg-transparent text-start"
              style={{
                color: "inherit",
                textShadow: "inherit",
                font: "inherit",
                lineHeight: "inherit",
                cursor: "pointer",
              }}
              onClick={handleScrollToTop}
            >
              {t("header.title")}
            </button>
          </h2>
          <LanguageDropdown />
        </div>
      </nav>
    </header>
  );
}
