import { act, fireEvent, render, screen } from "@testing-library/react";
import { MeasurementUnit } from "data";
import i18next from "locales/i18n";
import { I18nextProvider } from "react-i18next";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import App from "./App";

describe("App integration tests", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("renders full app with header, inputs, table, and footer", () => {
    render(
      <I18nextProvider i18n={i18next}>
        <App />
      </I18nextProvider>
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/oring finder/i);
    expect(screen.getByPlaceholderText(/ring code/i)).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText(/feel free to contribute/i)).toBeInTheDocument();
  });

  test("filters table data when entering search code", () => {
    render(
      <I18nextProvider i18n={i18next}>
        <App />
      </I18nextProvider>
    );

    const codeInput = screen.getByPlaceholderText(/ring code/i);
    fireEvent.change(codeInput, { target: { value: "001" } });

    act(() => {
      vi.advanceTimersByTime(900);
    });

    const rows = screen.getAllByRole("row");
    expect(rows.length).toBeGreaterThan(1);
    expect(screen.getByText("001")).toBeInTheDocument();
  });

  test("switches measurement units between mm and inches", () => {
    render(
      <I18nextProvider i18n={i18next}>
        <App />
      </I18nextProvider>
    );

    expect(screen.getAllByText(/millimeters/i).length).toBeGreaterThan(0);

    const unitSelect = screen.getByRole("combobox");
    fireEvent.change(unitSelect, { target: { value: MeasurementUnit.INCH } });

    act(() => {
      vi.advanceTimersByTime(900);
    });

    expect(screen.getAllByText(/inches/i).length).toBeGreaterThan(0);
  });

  test("resets filters on clear button click", () => {
    render(
      <I18nextProvider i18n={i18next}>
        <App />
      </I18nextProvider>
    );

    const codeInput = screen.getByPlaceholderText(/ring code/i) as HTMLInputElement;
    fireEvent.change(codeInput, { target: { value: "001" } });
    act(() => {
      vi.advanceTimersByTime(900);
    });

    const clearButton = screen.getByRole("button", { name: /clear filter/i });
    act(() => {
      fireEvent.click(clearButton);
    });

    expect(codeInput.value).toBe("");
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  test("renders valid meta description, semantic landmark siblings, and no invalid small p nesting", () => {
    const { container } = render(
      <I18nextProvider i18n={i18next}>
        <App />
      </I18nextProvider>
    );

    const metaDescription = document.querySelector('meta[name="description"]');
    expect(metaDescription).toBeInTheDocument();
    expect(metaDescription).toHaveAttribute(
      "content",
      expect.stringContaining("o-ring size & code finder")
    );

    const banner = screen.getByRole("banner");
    const main = screen.getByRole("main");
    const footer = screen.getByRole("contentinfo");

    expect(banner).toBeInTheDocument();
    expect(main).toBeInTheDocument();
    expect(footer).toBeInTheDocument();

    // Verify header, main, and footer are siblings under the root wrapper
    expect(banner.parentElement).toBe(main.parentElement);
    expect(main.parentElement).toBe(footer.parentElement);

    // Verify FAQ is rendered inside main
    expect(screen.getByRole("region", { name: /o-ring sizing guide & faq/i })).toBeInTheDocument();

    // Verify zero <p> nested in <small>
    const invalidNesting = container.querySelectorAll("small p");
    expect(invalidNesting).toHaveLength(0);
  });
});
