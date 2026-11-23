import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { TableRowsComponent } from "components/table/tableRow";
import { SortProvider, useSort } from "contexts";
import { DataRepresentation, MeasurementUnit, Standard } from "data";
import i18next from "locales/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { describe, expect, test } from "vitest";

const mockData: DataRepresentation[] = [
  {
    standard: Standard.AS,
    code: "001",
    id: 0.74,
    od: 2.78,
    cs: 1.02,
    unit: MeasurementUnit.MM,
  },
  {
    standard: Standard.JIS,
    code: "P3",
    id: 2.8,
    od: 6.6,
    cs: 1.9,
    unit: MeasurementUnit.MM,
  },
  {
    standard: Standard.METRIC,
    code: "1X1",
    id: 1,
    od: 3,
    cs: 1,
    unit: MeasurementUnit.MM,
  },
];

const SortControls: React.FC = () => {
  const { setSortBy, setSortDirection } = useSort();
  return (
    <div>
      <button onClick={() => { setSortBy("id"); setSortDirection("asc"); }}>
        Sort ID Asc
      </button>
      <button onClick={() => { setSortBy("id"); setSortDirection("desc"); }}>
        Sort ID Desc
      </button>
    </div>
  );
};

const TestSortWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <I18nextProvider i18n={i18next}>
      <SortProvider>
        <SortControls />
        <table>
          <tbody>{children}</tbody>
        </table>
      </SortProvider>
    </I18nextProvider>
  );
};

describe("TableRowsComponent", () => {
  test("renders all provided rows without invalid RDFa attributes", () => {
    render(
      <TestSortWrapper>
        <TableRowsComponent data={mockData} />
      </TestSortWrapper>
    );

    expect(screen.getByText("AS568")).toBeInTheDocument();
    expect(screen.getByText("001")).toBeInTheDocument();
    expect(screen.getByText("JIS")).toBeInTheDocument();
    expect(screen.getByText("P3")).toBeInTheDocument();
    expect(screen.getByText("Common Metric")).toBeInTheDocument();
    expect(screen.getByText("1X1")).toBeInTheDocument();

    const rows = screen.getAllByRole("row");
    for (const row of rows) {
      expect(row).not.toHaveAttribute("vocab");
      expect(row).not.toHaveAttribute("typeof");
    }
  });

  test("filters rows by standard and code", () => {
    render(
      <TestSortWrapper>
        <TableRowsComponent
          data={mockData}
          filter={{ standard: [Standard.AS], code: "001" }}
        />
      </TestSortWrapper>
    );

    expect(screen.getByText("001")).toBeInTheDocument();
    expect(screen.queryByText("P3")).not.toBeInTheDocument();
    expect(screen.queryByText("1X1")).not.toBeInTheDocument();
  });

  test("sorts rows ascending and descending", () => {
    render(
      <TestSortWrapper>
        <TableRowsComponent data={mockData} />
      </TestSortWrapper>
    );

    fireEvent.click(screen.getByText("Sort ID Asc"));
    const rowsAsc = screen.getAllByRole("row");
    expect(rowsAsc[0]).toHaveTextContent("001"); // 0.74
    expect(rowsAsc[1]).toHaveTextContent("1X1"); // 1
    expect(rowsAsc[2]).toHaveTextContent("P3"); // 2.8

    fireEvent.click(screen.getByText("Sort ID Desc"));
    const rowsDesc = screen.getAllByRole("row");
    expect(rowsDesc[0]).toHaveTextContent("P3"); // 2.8
    expect(rowsDesc[1]).toHaveTextContent("1X1"); // 1
    expect(rowsDesc[2]).toHaveTextContent("001"); // 0.74
  });

  test("opens lazy-loaded CustomModal on row click and closes on button click", async () => {
    render(
      <TestSortWrapper>
        <TableRowsComponent data={mockData} />
      </TestSortWrapper>
    );

    fireEvent.click(screen.getByText("001"));

    // Await lazy chunk load
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(await screen.findByRole("document")).toBeInTheDocument();

    const closeButton = await screen.findByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
