import { render } from "@testing-library/react";
import GoatCounter from "components/common/goatCounter";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

describe("GoatCounter component", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  test("does not inject script when VITE_GOAT_COUNTER_ID is unset", () => {
    vi.stubEnv("VITE_GOAT_COUNTER_ID", "");
    render(<GoatCounter />);

    window.dispatchEvent(new Event("load"));

    const script = document.querySelector("script[data-goatcounter]");
    expect(script).toBeNull();
  });

  test("injects script tag with correct attributes on window load when VITE_GOAT_COUNTER_ID is present", () => {
    vi.stubEnv("VITE_GOAT_COUNTER_ID", "test-tracker");
    render(<GoatCounter />);

    window.dispatchEvent(new Event("load"));

    const script = document.querySelector<HTMLScriptElement>(
      "script[data-goatcounter]"
    );
    expect(script).not.toBeNull();
    expect(script?.src).toContain("//gc.zgo.at/count.js");
    expect(script?.dataset.goatcounter).toBe(
      "https://test-tracker.goatcounter.com/count"
    );
  });

  test("cleans up script tag on unmount", () => {
    vi.stubEnv("VITE_GOAT_COUNTER_ID", "test-tracker");
    const { unmount } = render(<GoatCounter />);

    window.dispatchEvent(new Event("load"));
    expect(document.querySelector("script[data-goatcounter]")).not.toBeNull();

    unmount();
    expect(document.querySelector("script[data-goatcounter]")).toBeNull();
  });
});
