import { act, renderHook } from "@testing-library/react";
import { ThemeProvider, useTheme } from "contexts";
import type React from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-bs-theme");
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      const newMeta = document.createElement("meta");
      newMeta.name = "theme-color";
      newMeta.content = "#2fa4e7";
      document.head.appendChild(newMeta);
    } else {
      meta.setAttribute("content", "#2fa4e7");
    }
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-bs-theme");
  });

  test("throws descriptive error when useTheme is called outside ThemeProvider", () => {
    expect(() => renderHook(() => useTheme())).toThrow(
      "useTheme must be used within a ThemeProvider"
    );
  });

  test("initializes with light theme by default when no stored preference or matchMedia", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe("light");
    expect(result.current.isDark).toBe(false);
    expect(document.documentElement.getAttribute("data-bs-theme")).toBe("light");
    const meta = document.querySelector('meta[name="theme-color"]');
    expect(meta?.getAttribute("content")).toBe("#2fa4e7");
  });

  test("initializes with stored theme from localStorage", () => {
    localStorage.setItem("oring_theme", "dark");

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe("dark");
    expect(result.current.isDark).toBe(true);
    expect(document.documentElement.getAttribute("data-bs-theme")).toBe("dark");
    const meta = document.querySelector('meta[name="theme-color"]');
    expect(meta?.getAttribute("content")).toBe("#1a1d20");
  });

  test("initializes with prefers-color-scheme when localStorage is empty", () => {
    vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
      matches: query.includes("dark"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe("dark");
    expect(result.current.isDark).toBe(true);
    expect(document.documentElement.getAttribute("data-bs-theme")).toBe("dark");

    vi.restoreAllMocks();
  });

  test("toggles theme and persists to localStorage and DOM attributes", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe("light");

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("dark");
    expect(result.current.isDark).toBe(true);
    expect(localStorage.getItem("oring_theme")).toBe("dark");
    expect(document.documentElement.getAttribute("data-bs-theme")).toBe("dark");
    expect(
      document.querySelector('meta[name="theme-color"]')?.getAttribute("content")
    ).toBe("#1a1d20");

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("light");
    expect(result.current.isDark).toBe(false);
    expect(localStorage.getItem("oring_theme")).toBe("light");
    expect(document.documentElement.getAttribute("data-bs-theme")).toBe("light");
    expect(
      document.querySelector('meta[name="theme-color"]')?.getAttribute("content")
    ).toBe("#2fa4e7");
  });

  test("setTheme directly sets specific theme", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setTheme("dark");
    });

    expect(result.current.theme).toBe("dark");
    expect(localStorage.getItem("oring_theme")).toBe("dark");
  });

  test("handles localStorage errors gracefully", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(() => {
      act(() => {
        result.current.toggleTheme();
      });
    }).not.toThrow();

    expect(result.current.theme).toBe("dark");

    vi.restoreAllMocks();
  });
});
