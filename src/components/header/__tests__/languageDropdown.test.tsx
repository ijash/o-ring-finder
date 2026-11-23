import { fireEvent, render, screen } from "@testing-library/react";
import LanguageDropdown from "components/header/languageDropdown";
import i18next from "locales/i18n";
import { I18nextProvider } from "react-i18next";
import { describe, expect, test } from "vitest";

describe("LanguageDropdown component", () => {
  const renderDropdown = () => {
    return render(
      <I18nextProvider i18n={i18next}>
        <LanguageDropdown />
      </I18nextProvider>
    );
  };

  test("renders language dropdown button and options", () => {
    renderDropdown();

    expect(screen.getByRole("button", { expanded: false })).toBeInTheDocument();
    expect(screen.getByText(/english/i)).toBeInTheDocument();
    expect(screen.getByText(/indonesia/i)).toBeInTheDocument();
  });

  test("synchronizes document.documentElement.lang and switches to Indonesian", () => {
    renderDropdown();

    expect(document.documentElement.lang).toBe("en");

    const idButton = screen.getByText(/indonesia/i);
    fireEvent.click(idButton);

    expect(document.documentElement.lang).toBe("id");
  });

  test("switches back to English when English button is clicked", () => {
    renderDropdown();

    const idButton = screen.getByText(/indonesia/i);
    fireEvent.click(idButton);
    expect(document.documentElement.lang).toBe("id");

    const enButton = screen.getByText(/english/i);
    fireEvent.click(enButton);
    expect(document.documentElement.lang).toBe("en");
  });

  test("renders button with accessible aria-label", () => {
    renderDropdown();

    expect(
      screen.getByRole("button", { name: /language/i })
    ).toBeInTheDocument();
  });

  test("toggles dropdown menu open and closed on button click", () => {
    const { container } = renderDropdown();

    const button = screen.getByRole("button", { name: /language/i });
    const menu = container.querySelector(".dropdown-menu");

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(menu).not.toHaveClass("show");

    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(menu).toHaveClass("show");

    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(menu).not.toHaveClass("show");
  });

  test("closes dropdown on Escape key press", () => {
    const { container } = renderDropdown();

    const button = screen.getByRole("button", { name: /language/i });
    const menu = container.querySelector(".dropdown-menu");

    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(menu).toHaveClass("show");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(menu).not.toHaveClass("show");
  });

  test("closes dropdown on outside click", () => {
    const { container } = renderDropdown();

    const button = screen.getByRole("button", { name: /language/i });
    const menu = container.querySelector(".dropdown-menu");

    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(menu).toHaveClass("show");

    fireEvent.mouseDown(document.body);
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(menu).not.toHaveClass("show");
  });
});
