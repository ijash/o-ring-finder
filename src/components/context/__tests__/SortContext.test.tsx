import { act, renderHook } from "@testing-library/react";
import { SortProvider, useSort } from "components/context/SortContext";
import type React from "react";
import { describe, expect, test } from "vitest";

describe("SortContext", () => {
  test("throws error when useSort is called outside SortProvider", () => {
    expect(() => renderHook(() => useSort())).toThrow(
      "useSort must be used within a SortProvider"
    );
  });

  test("provides sortBy, sortDirection, and handles setSortBy, setSortDirection, and resetSort", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SortProvider>{children}</SortProvider>
    );

    const { result } = renderHook(() => useSort(), { wrapper });

    expect(result.current.sortBy).toBe("");
    expect(result.current.sortDirection).toBe("undefined");

    act(() => {
      result.current.setSortBy("id");
      result.current.setSortDirection("asc");
    });

    expect(result.current.sortBy).toBe("id");
    expect(result.current.sortDirection).toBe("asc");

    act(() => {
      result.current.resetSort();
    });

    expect(result.current.sortBy).toBe("");
    expect(result.current.sortDirection).toBe("undefined");
  });
});
