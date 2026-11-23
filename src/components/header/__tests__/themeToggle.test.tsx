import { act, fireEvent, render, screen } from "@testing-library/react";
import ThemeToggle from "components/header/themeToggle";
import { ThemeProvider } from "contexts";
import i18next from "locales/i18n";
import { I18nextProvider } from "react-i18next";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

describe("ThemeToggle component", () => {
  beforeEach(async () => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-bs-theme");
    await i18next.changeLanguage("en");
  });

  afterEach(async () => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-bs-theme");
    await i18next.changeLanguage("en");
  });

  const renderToggle = () => {
    return render(
      <I18nextProvider i18n={i18next}>
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      </I18nextProvider>
    );
  };

  test("renders theme toggle button with accessible aria-label", () => {
    renderToggle();

    const button = screen.getByRole("button", { name: /switch to dark mode/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("btn", "btn-primary", "btn-sm");
  });

  test("renders moon icon when theme is light", () => {
    const { container } = renderToggle();

    const button = screen.getByRole("button", { name: /switch to dark mode/i });
    expect(button).toBeInTheDocument();
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  test("toggles theme on button click and switches icon and aria-label", () => {
    renderToggle();

    const button = screen.getByRole("button", { name: /switch to dark mode/i });
    fireEvent.click(button);

    expect(
      screen.getByRole("button", { name: /switch to light mode/i })
    ).toBeInTheDocument();
    expect(document.documentElement.getAttribute("data-bs-theme")).toBe("dark");

    fireEvent.click(screen.getByRole("button", { name: /switch to light mode/i }));
    expect(
      screen.getByRole("button", { name: /switch to dark mode/i })
    ).toBeInTheDocument();
    expect(document.documentElement.getAttribute("data-bs-theme")).toBe("light");
  });

  test("renders localized aria-label when language changes to Indonesian", async () => {
    renderToggle();

    await act(async () => {
      await i18next.changeLanguage("id");
    });

    expect(
      screen.getByRole("button", { name: /beralih ke mode gelap/i })
    ).toBeInTheDocument();
  });
});
