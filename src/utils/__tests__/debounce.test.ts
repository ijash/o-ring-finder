import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { debounce } from "../debounce";

describe("debounce utility", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("executes the callback after specified delay", () => {
    const callback = vi.fn();
    const debouncedFn = debounce(callback, 200);

    debouncedFn("alpha", 1);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(199);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("alpha", 1);
  });

  test("resets delay on consecutive calls and executes only with latest arguments", () => {
    const callback = vi.fn();
    const debouncedFn = debounce(callback, 300);

    debouncedFn("first");
    vi.advanceTimersByTime(150);
    debouncedFn("second");
    vi.advanceTimersByTime(150);
    debouncedFn("third");

    vi.advanceTimersByTime(299);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("third");
  });

  test("cancels pending execution when cancel() is called", () => {
    const callback = vi.fn();
    const debouncedFn = debounce(callback, 250);

    debouncedFn("should-not-run");
    vi.advanceTimersByTime(100);

    debouncedFn.cancel();
    vi.advanceTimersByTime(300);

    expect(callback).not.toHaveBeenCalled();
  });

  test("cancel() does nothing if no timer is pending", () => {
    const callback = vi.fn();
    const debouncedFn = debounce(callback, 100);

    expect(() => debouncedFn.cancel()).not.toThrow();
  });
});
