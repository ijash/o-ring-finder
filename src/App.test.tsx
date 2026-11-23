import { render, screen } from "@testing-library/react";
import i18nInit from "locales/i18n";
import { I18nextProvider } from "react-i18next";
import App from "./App";

describe("App smoke test", () => {
  test("renders without crashing and displays header title", () => {
    const i18n = i18nInit();
    render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    );
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
