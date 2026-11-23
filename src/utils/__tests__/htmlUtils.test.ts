import { afterEach, describe, expect, test } from "vitest";
import { getElementWidth } from "../htmlUtils";

describe("htmlUtils", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("getElementWidth", () => {
    test("returns clientWidth when full is false (default)", () => {
      const div = document.createElement("div");
      div.id = "test-elem";
      Object.defineProperty(div, "clientWidth", { value: 320, configurable: true });
      Object.defineProperty(div, "offsetWidth", { value: 340, configurable: true });
      document.body.appendChild(div);

      expect(getElementWidth("test-elem")).toBe(320);
      expect(getElementWidth("test-elem", false)).toBe(320);
    });

    test("returns offsetWidth when full is true", () => {
      const div = document.createElement("div");
      div.id = "test-full-elem";
      Object.defineProperty(div, "clientWidth", { value: 200, configurable: true });
      Object.defineProperty(div, "offsetWidth", { value: 240, configurable: true });
      document.body.appendChild(div);

      expect(getElementWidth("test-full-elem", true)).toBe(240);
    });

    test("throws an error when element is not found in document", () => {
      expect(() => getElementWidth("non-existent-id")).toThrow(
        "Element '#non-existent-id' not found."
      );
    });
  });
});
