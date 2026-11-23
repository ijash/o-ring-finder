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

    expect(screen.getByText(/millimeters/i)).toBeInTheDocument();

    const unitSelect = screen.getByRole("combobox");
    fireEvent.change(unitSelect, { target: { value: MeasurementUnit.INCH } });

    act(() => {
      vi.advanceTimersByTime(900);
    });

    expect(screen.getByText(/inches/i)).toBeInTheDocument();
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
});
