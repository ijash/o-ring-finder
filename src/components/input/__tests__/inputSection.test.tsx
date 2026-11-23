import { fireEvent, render, screen } from "@testing-library/react";
import { InputSection } from "components/input/inputSection";
import { FilterContext } from "contexts";
import { IDataFilter, MeasurementUnit } from "data";
import i18next from "locales/i18n";
import React, { useState } from "react";
import { I18nextProvider } from "react-i18next";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const TestWrapper: React.FC<{
  children: React.ReactNode;
  initialFilter?: IDataFilter;
  onFilterChange?: (filter: IDataFilter) => void;
}> = ({ children, initialFilter = { unit: MeasurementUnit.MM }, onFilterChange }) => {
  const [filter, setFilterState] = useState<IDataFilter>(initialFilter);

  const setFilter: React.Dispatch<React.SetStateAction<IDataFilter>> = (action) => {
    setFilterState((prev) => {
      const next = typeof action === "function" ? action(prev) : action;
      if (onFilterChange) onFilterChange(next);
      return next;
    });
  };

  return (
    <I18nextProvider i18n={i18next}>
      <FilterContext.Provider value={{ filter, setFilter }}>
        {children}
      </FilterContext.Provider>
    </I18nextProvider>
  );
};

describe("InputSection component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("renders all form inputs and unit dropdown", () => {
    render(
      <TestWrapper>
        <InputSection />
      </TestWrapper>
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/ring code/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/min id/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/max id/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/min od/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/max od/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/min cs/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/max cs/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /clear filter/i })).toBeInTheDocument();
  });

  test("updates filter after debounce delay when typing in code input", () => {
    const onFilterChange = vi.fn();
    render(
      <TestWrapper onFilterChange={onFilterChange}>
        <InputSection />
      </TestWrapper>
    );

    const codeInput = screen.getByPlaceholderText(/ring code/i);
    fireEvent.change(codeInput, { target: { value: "001" } });

    // Debounce delay is 897ms
    vi.advanceTimersByTime(500);
    expect(onFilterChange).not.toHaveBeenCalled();

    vi.advanceTimersByTime(400);
    expect(onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({
        unit: MeasurementUnit.MM,
        code: "001",
      })
    );
  });

  test("updates filter unit synchronously when selecting imperial unit", () => {
    const onFilterChange = vi.fn();
    render(
      <TestWrapper onFilterChange={onFilterChange}>
        <InputSection />
      </TestWrapper>
    );

    const unitSelect = screen.getByRole("combobox");
    fireEvent.change(unitSelect, { target: { value: MeasurementUnit.INCH } });

    // Synchronous update: immediate without advancing timers
    expect(onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({
        unit: MeasurementUnit.INCH,
      })
    );
  });

  test("resets all inputs and scrolls to top on clear button click", () => {
    const onFilterChange = vi.fn();
    render(
      <TestWrapper onFilterChange={onFilterChange}>
        <InputSection />
      </TestWrapper>
    );

    const codeInput = screen.getByPlaceholderText(/ring code/i) as HTMLInputElement;
    const minIdInput = screen.getByPlaceholderText(/min id/i) as HTMLInputElement;
    fireEvent.change(codeInput, { target: { value: "AS" } });
    fireEvent.change(minIdInput, { target: { value: "10" } });

    const clearButton = screen.getByRole("button", { name: /clear filter/i });
    fireEvent.click(clearButton);

    expect(codeInput.value).toBe("");
    expect(minIdInput.value).toBe("");
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    expect(onFilterChange).toHaveBeenCalledWith({
      unit: MeasurementUnit.MM,
    });
  });

  test("clears dimension and code inputs while preserving imperial unit sync in state and select UI on clear", () => {
    const onFilterChange = vi.fn();
    render(
      <TestWrapper
        initialFilter={{ unit: MeasurementUnit.INCH }}
        onFilterChange={onFilterChange}
      >
        <InputSection />
      </TestWrapper>
    );

    const unitSelect = screen.getByRole("combobox") as HTMLSelectElement;
    const codeInput = screen.getByPlaceholderText(/ring code/i) as HTMLInputElement;
    const minIdInput = screen.getByPlaceholderText(/min id/i) as HTMLInputElement;

    expect(unitSelect.value).toBe(MeasurementUnit.INCH);

    fireEvent.change(codeInput, { target: { value: "AS" } });
    fireEvent.change(minIdInput, { target: { value: "10" } });

    const clearButton = screen.getByRole("button", { name: /clear filter/i });
    fireEvent.click(clearButton);

    expect(codeInput.value).toBe("");
    expect(minIdInput.value).toBe("");
    expect(unitSelect.value).toBe(MeasurementUnit.INCH);
    expect(onFilterChange).toHaveBeenCalledWith({
      unit: MeasurementUnit.INCH,
    });
  });

  test("parses numeric bounds and merges rapid multi-field updates without dropping fields", () => {
    const onFilterChange = vi.fn();
    render(
      <TestWrapper onFilterChange={onFilterChange}>
        <InputSection />
      </TestWrapper>
    );

    const minIdInput = screen.getByPlaceholderText(/min id/i);
    const maxIdInput = screen.getByPlaceholderText(/max id/i);

    fireEvent.change(minIdInput, { target: { value: "12.5" } });
    vi.advanceTimersByTime(200);
    fireEvent.change(maxIdInput, { target: { value: "25" } });

    vi.advanceTimersByTime(900); // 897ms debounce delay
    expect(onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({
        unit: MeasurementUnit.MM,
        minId: 12.5,
        maxId: 25,
      })
    );
  });

  test("cancels pending debounce upon unmount", () => {
    const onFilterChange = vi.fn();
    const { unmount } = render(
      <TestWrapper onFilterChange={onFilterChange}>
        <InputSection />
      </TestWrapper>
    );

    const codeInput = screen.getByPlaceholderText(/ring code/i);
    fireEvent.change(codeInput, { target: { value: "JIS-P" } });

    // Unmount before delay
    unmount();
    vi.advanceTimersByTime(1000);

    expect(onFilterChange).not.toHaveBeenCalled();
  });
});
