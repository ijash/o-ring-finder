import { describe, expect, it, vi } from "vitest";
import { MeasurementUnit } from "data";
import { parseUrlFilters, syncFilterToUrl } from "../urlParams";

describe("urlParams utility", () => {
  describe("parseUrlFilters", () => {
    it("returns empty object for empty or question-mark-only query", () => {
      expect(parseUrlFilters("")).toEqual({});
      expect(parseUrlFilters("?")).toEqual({});
    });

    it("parses valid code and unit parameters", () => {
      const parsed = parseUrlFilters("?code=010&unit=inch");
      expect(parsed).toEqual({
        code: "010",
        unit: MeasurementUnit.INCH,
      });
    });

    it("parses metric unit explicitly", () => {
      const parsed = parseUrlFilters("?unit=mm");
      expect(parsed).toEqual({
        unit: MeasurementUnit.MM,
      });
    });

    it("parses all numeric dimension filters correctly", () => {
      const parsed = parseUrlFilters(
        "?minId=5&maxId=10.5&minOd=15&maxOd=20.2&minCs=1.5&maxCs=3"
      );
      expect(parsed).toEqual({
        minId: 5,
        maxId: 10.5,
        minOd: 15,
        maxOd: 20.2,
        minCs: 1.5,
        maxCs: 3,
      });
    });

    it("ignores non-numeric or negative values", () => {
      const parsed = parseUrlFilters(
        "?minId=invalid&maxId=-5&minCs=0&code=test"
      );
      expect(parsed).toEqual({
        code: "test",
      });
    });

    it("trims whitespace from code and ignores empty code", () => {
      expect(parseUrlFilters("?code=%20%20")).toEqual({});
      expect(parseUrlFilters("?code=%20AS-010%20")).toEqual({
        code: "AS-010",
      });
    });
  });

  describe("syncFilterToUrl", () => {
    it("serializes filter to query string and calls replaceState", () => {
      const replaceStateSpy = vi.spyOn(window.history, "replaceState");
      const url = syncFilterToUrl(
        {
          code: "010",
          unit: MeasurementUnit.INCH,
          minId: 5,
        },
        "/o-ring-finder/",
        ""
      );

      expect(url).toContain("code=010");
      expect(url).toContain("unit=inch");
      expect(url).toContain("minId=5");
      expect(replaceStateSpy).toHaveBeenCalledWith(null, "", url);
      replaceStateSpy.mockRestore();
    });

    it("preserves existing lng parameter during sync", () => {
      const url = syncFilterToUrl(
        {
          code: "020",
        },
        "/o-ring-finder/",
        "?lng=id"
      );

      expect(url).toContain("lng=id");
      expect(url).toContain("code=020");
    });

    it("cleans trailing query string when filters are empty and unit is metric", () => {
      const url = syncFilterToUrl(
        {
          unit: MeasurementUnit.MM,
        },
        "/o-ring-finder/",
        ""
      );

      expect(url).toBe("/o-ring-finder/");
    });
  });
});
