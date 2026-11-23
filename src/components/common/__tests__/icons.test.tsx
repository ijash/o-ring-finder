import { render } from "@testing-library/react";
import { IconCircle, IconEraser, IconLanguage } from "components/common/icons";
import { describe, expect, test } from "vitest";

describe("Inline SVG Icons", () => {
  test("renders IconCircle with correct SVG viewBox and attributes", () => {
    const { container } = render(<IconCircle data-testid="icon-circle" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("viewBox", "0 0 512 512");
    expect(svg).toHaveAttribute("fill", "currentColor");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  test("renders IconLanguage with correct SVG viewBox and attributes", () => {
    const { container } = render(<IconLanguage data-testid="icon-language" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("viewBox", "0 0 576 512");
    expect(svg).toHaveAttribute("fill", "currentColor");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  test("renders IconEraser with correct SVG viewBox and attributes", () => {
    const { container } = render(<IconEraser data-testid="icon-eraser" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("viewBox", "0 0 576 512");
    expect(svg).toHaveAttribute("fill", "currentColor");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });
});
