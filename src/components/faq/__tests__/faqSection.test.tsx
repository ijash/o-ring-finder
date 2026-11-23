import { fireEvent, render, screen } from "@testing-library/react";
import { FaqSection } from "components/faq";
import i18next from "locales/i18n";
import { I18nextProvider } from "react-i18next";
import { describe, expect, it } from "vitest";

describe("FaqSection component", () => {
  it("renders all 4 FAQ questions and descriptions in English", () => {
    i18next.changeLanguage("en");
    render(
      <I18nextProvider i18n={i18next}>
        <FaqSection />
      </I18nextProvider>
    );

    expect(
      screen.getByRole("heading", { name: /o-ring sizing guide & faq/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/what is the difference between as568, jis b 2401, and metric/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/how do i accurately measure an o-ring/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/how do i calculate outer diameter/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/how do i convert between millimeters and inches/i)
    ).toBeInTheDocument();
  });

  it("toggles details element expansion on click", () => {
    render(
      <I18nextProvider i18n={i18next}>
        <FaqSection />
      </I18nextProvider>
    );

    const firstSummary = screen.getByText(
      /what is the difference between as568, jis b 2401, and metric/i
    );
    const details = firstSummary.closest("details");
    expect(details).not.toHaveAttribute("open");

    fireEvent.click(firstSummary);
    expect(details).toHaveAttribute("open");
  });

  it("renders Indonesian localized text when switching language to id", () => {
    i18next.changeLanguage("id");
    render(
      <I18nextProvider i18n={i18next}>
        <FaqSection />
      </I18nextProvider>
    );

    expect(
      screen.getByRole("heading", { name: /panduan ukuran & faq o-ring/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/apa perbedaan antara standar o-ring as568, jis b 2401, dan metrik/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/bagaimana cara mengukur o-ring dengan akurat/i)
    ).toBeInTheDocument();

    // Reset back to English
    i18next.changeLanguage("en");
  });
});
