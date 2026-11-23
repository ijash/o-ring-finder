import { fireEvent, render, screen } from "@testing-library/react";
import CustomModal from "components/modal/modal";
import { DataRepresentation, MeasurementUnit, Standard } from "data";
import i18next from "locales/i18n";
import { I18nextProvider } from "react-i18next";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const sampleRowData: DataRepresentation = {
  standard: Standard.AS,
  code: "001",
  id: 0.74,
  od: 2.78,
  cs: 1.02,
  unit: MeasurementUnit.MM,
};

describe("CustomModal component", () => {
  let originalClientWidth: PropertyDescriptor | undefined;

  beforeEach(() => {
    originalClientWidth = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "clientWidth"
    );
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      value: 600,
    });
  });

  afterEach(() => {
    if (originalClientWidth) {
      Object.defineProperty(
        HTMLElement.prototype,
        "clientWidth",
        originalClientWidth
      );
    }
    vi.restoreAllMocks();
  });

  const renderModal = (props: {
    show: boolean;
    handleClose: () => void;
    rowData: DataRepresentation | null;
  }) => {
    return render(
      <I18nextProvider i18n={i18next}>
        <CustomModal {...props} />
      </I18nextProvider>
    );
  };

  test("renders nothing when show is false", () => {
    const handleClose = vi.fn();
    renderModal({ show: false, handleClose, rowData: sampleRowData });

    expect(screen.queryByRole("document")).not.toBeInTheDocument();
  });

  test("renders nothing when rowData is null", () => {
    const handleClose = vi.fn();
    renderModal({ show: true, handleClose, rowData: null });

    expect(screen.queryByRole("document")).not.toBeInTheDocument();
  });

  test("renders modal content and title with standard and code", () => {
    const handleClose = vi.fn();
    renderModal({ show: true, handleClose, rowData: sampleRowData });

    expect(screen.getByRole("document")).toBeInTheDocument();
    expect(screen.getByText("AS568 001")).toBeInTheDocument();
    expect(screen.getAllByText("0.74mm").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("2.78mm").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("1.02mm").length).toBeGreaterThanOrEqual(1);
  });

  test("renders product search links for web search and ecommerce", () => {
    const handleClose = vi.fn();
    renderModal({ show: true, handleClose, rowData: sampleRowData });

    const googleLink = screen.getByRole("link", { name: /google/i });
    expect(googleLink).toHaveAttribute(
      "href",
      "https://www.google.com/search?q=oring+AS568+001"
    );

    const marcoRubberLink = screen.getByRole("link", { name: /marco rubber/i });
    expect(marcoRubberLink).toHaveAttribute(
      "href",
      "https://www.marcorubber.com/search-results?search=001"
    );
  });

  test("calls handleClose when close button is clicked", () => {
    const handleClose = vi.fn();
    renderModal({ show: true, handleClose, rowData: sampleRowData });

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test("calls handleClose when backdrop is clicked", () => {
    const handleClose = vi.fn();
    renderModal({ show: true, handleClose, rowData: sampleRowData });

    const modalBackdrop = document.getElementById("exampleModal");
    expect(modalBackdrop).toBeInTheDocument();
    if (modalBackdrop) {
      fireEvent.click(modalBackdrop);
      expect(handleClose).toHaveBeenCalledTimes(1);
    }
  });

  test("does not call handleClose when clicking inside modal dialog content", () => {
    const handleClose = vi.fn();
    renderModal({ show: true, handleClose, rowData: sampleRowData });

    const dialog = screen.getByRole("document");
    fireEvent.click(dialog);

    expect(handleClose).not.toHaveBeenCalled();
  });

  test("calls handleClose on browser back button (popstate event)", () => {
    const handleClose = vi.fn();
    renderModal({ show: true, handleClose, rowData: sampleRowData });

    window.dispatchEvent(new PopStateEvent("popstate"));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test("has proper ARIA accessibility attributes", () => {
    const handleClose = vi.fn();
    renderModal({ show: true, handleClose, rowData: sampleRowData });

    const modalDialog = screen.getByRole("dialog");
    expect(modalDialog).toHaveAttribute("aria-modal", "true");
    expect(modalDialog).toHaveAttribute("aria-labelledby", "itemDetails");
  });

  test("calls handleClose when Escape key is pressed", () => {
    const handleClose = vi.fn();
    renderModal({ show: true, handleClose, rowData: sampleRowData });

    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test("renders localized loading state when dimensions are unmeasured", () => {
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      value: 0,
    });

    const handleClose = vi.fn();
    renderModal({ show: true, handleClose, rowData: sampleRowData });

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
