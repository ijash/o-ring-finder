import { act, renderHook } from "@testing-library/react";
import { FilterContextProvider, useFilter } from "contexts";
import { MeasurementUnit } from "data";
import type React from "react";
import { describe, expect, test } from "vitest";

describe("FilterContext", () => {
  test("throws descriptive error when useFilter is called outside FilterContextProvider", () => {
    expect(() => renderHook(() => useFilter())).toThrow(
      "useFilter must be used within a FilterContextProvider"
    );
  });

  test("provides default filter and allows updating filter state", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FilterContextProvider>{children}</FilterContextProvider>
    );

    const { result } = renderHook(() => useFilter(), { wrapper });

    expect(result.current.filter.unit).toBe(MeasurementUnit.MM);

    act(() => {
      result.current.setFilter({
        unit: MeasurementUnit.INCH,
        code: "001",
      });
    });

    expect(result.current.filter.unit).toBe(MeasurementUnit.INCH);
    expect(result.current.filter.code).toBe("001");
  });

  test("initializes filter state from window.location.search query parameters", () => {
    window.history.replaceState(
      null,
      "",
      "/?code=010&unit=inch&minId=5&maxId=15"
    );

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FilterContextProvider>{children}</FilterContextProvider>
    );

    const { result } = renderHook(() => useFilter(), { wrapper });

    expect(result.current.filter.code).toBe("010");
    expect(result.current.filter.unit).toBe(MeasurementUnit.INCH);
    expect(result.current.filter.minId).toBe(5);
    expect(result.current.filter.maxId).toBe(15);

    window.history.replaceState(null, "", "/");
  });
});
