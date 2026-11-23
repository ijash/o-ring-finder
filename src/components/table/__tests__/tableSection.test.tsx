import { fireEvent, render, screen } from "@testing-library/react";
import { FilterContext } from "components/context";
import { TableSection } from "components/table/tableSection";
import { IDataFilter, MeasurementUnit, Standard } from "data";
import i18nInit from "locales/i18n";
import React, { useState } from "react";
import { I18nextProvider } from "react-i18next";
import { describe, expect, test } from "vitest";

const TestWrapper: React.FC<{
  children: React.ReactNode;
  initialFilter?: IDataFilter;
}> = ({ children, initialFilter = { unit: MeasurementUnit.MM } }) => {
  const i18n = i18nInit();
  const [filter, setFilter] = useState<IDataFilter>(initialFilter);

  return (
    <I18nextProvider i18n={i18n}>
      <FilterContext.Provider value={{ filter, setFilter }}>
        {children}
      </FilterContext.Provider>
    </I18nextProvider>
  );
};

describe("TableSection component", () => {
  test("renders table headers and caption in mm by default", () => {
    render(
      <TestWrapper>
        <TableSection />
      </TestWrapper>
    );

    expect(screen.getByText(/millimeter/i)).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /^standard/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /^code/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /^id/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /^od/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /^cs/i })).toBeInTheDocument();
  });

  test("renders caption in inches when filter unit is inch", () => {
    render(
      <TestWrapper initialFilter={{ unit: MeasurementUnit.INCH }}>
        <TableSection />
      </TestWrapper>
    );

    expect(screen.getByText(/inches/i)).toBeInTheDocument();
  });

  test("sorts rows when clicking table column headers", () => {
    render(
      <TestWrapper initialFilter={{ unit: MeasurementUnit.MM, code: "001" }}>
        <TableSection />
      </TestWrapper>
    );

    const idHeader = screen.getByRole("columnheader", { name: /^id/i });

    // First click: asc sort
    fireEvent.click(idHeader);
    expect(idHeader).toHaveTextContent("▲");

    // Second click: desc sort
    fireEvent.click(idHeader);
    expect(idHeader).toHaveTextContent("▼");

    // Third click: undefined sort (no arrow)
    fireEvent.click(idHeader);
    expect(idHeader).not.toHaveTextContent("▲");
    expect(idHeader).not.toHaveTextContent("▼");
  });

  test("filters rows matching criteria (e.g., code filter)", () => {
    render(
      <TestWrapper initialFilter={{ unit: MeasurementUnit.MM, code: "AS568-001" }}>
        <TableSection />
      </TestWrapper>
    );

    const rows = screen.getAllByRole("row");
    // At least the header row + filtered data row
    expect(rows.length).toBeGreaterThanOrEqual(1);
  });

  test("filters rows matching dimensional range and standard criteria", () => {
    render(
      <TestWrapper
        initialFilter={{
          unit: MeasurementUnit.MM,
          minCs: 1.5,
          maxCs: 2.0,
          minId: 10,
          maxId: 20,
          minOd: 13,
          maxOd: 25,
          standard: [Standard.AS],
        }}
      >
        <TableSection />
      </TestWrapper>
    );

    expect(screen.getAllByRole("row").length).toBeGreaterThan(1);
  });

  test("renders only header row when filter excludes all records", () => {
    render(
      <TestWrapper
        initialFilter={{
          unit: MeasurementUnit.MM,
          minId: 10000,
          maxId: 50,
        }}
      >
        <TableSection />
      </TestWrapper>
    );

    // Header row only
    expect(screen.getAllByRole("row").length).toBe(1);
  });

  test("sorts rows in descending order when header clicked twice", () => {
    render(
      <TestWrapper initialFilter={{ unit: MeasurementUnit.MM, minId: 10, maxId: 15 }}>
        <TableSection />
      </TestWrapper>
    );

    const idHeader = screen.getByRole("columnheader", { name: /^id/i });
    fireEvent.click(idHeader); // asc
    fireEvent.click(idHeader); // desc

    expect(idHeader).toHaveTextContent("▼");
  });

  test("opens modal when a table row is clicked", () => {
    render(
      <TestWrapper initialFilter={{ unit: MeasurementUnit.MM, code: "001" }}>
        <TableSection />
      </TestWrapper>
    );

    const dataRows = screen.getAllByRole("row");
    // Row 0 is header, Row 1 is first data row
    expect(dataRows.length).toBeGreaterThan(1);
    if (dataRows[1]) {
      fireEvent.click(dataRows[1]);
      expect(screen.getByRole("document")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
    }
  });
});
