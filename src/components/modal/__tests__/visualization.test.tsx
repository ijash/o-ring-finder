import { render } from "@testing-library/react";
import RingVisualization from "components/modal/visualization";
import { ThemeProvider } from "contexts";
import { DataRepresentation, MeasurementUnit, Standard } from "data";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

const mockRing: DataRepresentation = {
  standard: Standard.AS,
  code: "001",
  id: 0.74,
  od: 2.78,
  cs: 1.02,
  unit: MeasurementUnit.MM,
};

const mockDimensions = {
  width: 400,
  height: 200,
};

describe("RingVisualization component", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-bs-theme");
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-bs-theme");
  });

  test("renders SVG with provided container dimensions and accessible elements", () => {
    const { container } = render(
      <RingVisualization
        ringDimensions={mockRing}
        dimensions={mockDimensions}
      />
    );

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "400");
    expect(svg).toHaveAttribute("height", "200");
  });

  test("renders dimension labels for OD, ID, and CS with units", () => {
    const { getByText } = render(
      <RingVisualization
        ringDimensions={mockRing}
        dimensions={mockDimensions}
      />
    );

    expect(getByText("OD")).toBeInTheDocument();
    expect(getByText("ID")).toBeInTheDocument();
    expect(getByText("CS")).toBeInTheDocument();
    expect(getByText("2.78mm")).toBeInTheDocument();
    expect(getByText("0.74mm")).toBeInTheDocument();
    expect(getByText("1.02mm")).toBeInTheDocument();
  });

  test("renders 3D defs including gradients, dot-grid pattern, and drop shadow", () => {
    const { container } = render(
      <RingVisualization
        ringDimensions={mockRing}
        dimensions={mockDimensions}
      />
    );

    expect(container.querySelector("pattern#dotGrid")).toBeInTheDocument();
    expect(container.querySelector("radialGradient#ringGradient")).toBeInTheDocument();
    expect(container.querySelector("mask#ringMask")).toBeInTheDocument();
  });

  test("renders light mode palette by default", () => {
    const { container } = render(
      <ThemeProvider>
        <RingVisualization
          ringDimensions={mockRing}
          dimensions={mockDimensions}
        />
      </ThemeProvider>
    );

    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("style")).toContain(
      "linear-gradient(rgb(248, 250, 252), rgb(203, 213, 225))"
    );
  });

  test("renders high-contrast dark mode palette when theme is dark", () => {
    localStorage.setItem("oring_theme", "dark");

    const { container } = render(
      <ThemeProvider>
        <RingVisualization
          ringDimensions={mockRing}
          dimensions={mockDimensions}
        />
      </ThemeProvider>
    );

    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("style")).toContain(
      "linear-gradient(rgb(30, 41, 59), rgb(15, 23, 42))"
    );
  });
});
