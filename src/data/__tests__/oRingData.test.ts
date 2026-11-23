import {
  TABLE_HEADERS,
  as568Data,
  jisData,
  metricData,
  convertToUnit,
  getAllORingData,
  getStandardData,
  MeasurementUnit,
  Standard,
} from "../index";

describe("oRingData module", () => {
  describe("TABLE_HEADERS", () => {
    test("exports standard table headers in correct order", () => {
      expect(TABLE_HEADERS).toEqual(["Standard", "Code", "ID", "OD", "CS"]);
    });
  });

  describe("Dataset Integrity", () => {
    test("as568Data has 394 records and valid fields", () => {
      expect(as568Data.length).toBe(394);
      as568Data.forEach((row) => {
        expect(row.standard).toBe(Standard.AS);
        expect(typeof row.code).toBe("string");
        expect(row.code.trim().length).toBeGreaterThan(0);
        expect(row.cs).toBeGreaterThan(0);
        expect(row.id).toBeGreaterThan(0);
        expect(row.od).toBeGreaterThan(0);
        expect(Number.isFinite(row.cs)).toBe(true);
        expect(Number.isFinite(row.id)).toBe(true);
        expect(Number.isFinite(row.od)).toBe(true);
      });
    });

    test("jisData has 545 records and valid fields", () => {
      expect(jisData.length).toBe(545);
      jisData.forEach((row) => {
        expect(row.standard).toBe(Standard.JIS);
        expect(typeof row.code).toBe("string");
        expect(row.code.trim().length).toBeGreaterThan(0);
        expect(row.cs).toBeGreaterThan(0);
        expect(row.id).toBeGreaterThan(0);
        expect(row.od).toBeGreaterThan(0);
        expect(Number.isFinite(row.cs)).toBe(true);
        expect(Number.isFinite(row.id)).toBe(true);
        expect(Number.isFinite(row.od)).toBe(true);
      });
    });

    test("metricData has 2883 records and valid fields", () => {
      expect(metricData.length).toBe(2883);
      metricData.forEach((row) => {
        expect(row.standard).toBe(Standard.METRIC);
        expect(typeof row.code).toBe("string");
        expect(row.code.trim().length).toBeGreaterThan(0);
        expect(row.cs).toBeGreaterThan(0);
        expect(row.id).toBeGreaterThan(0);
        expect(row.od).toBeGreaterThan(0);
        expect(Number.isFinite(row.cs)).toBe(true);
        expect(Number.isFinite(row.id)).toBe(true);
        expect(Number.isFinite(row.od)).toBe(true);
      });
    });
  });

  describe("convertToUnit and unit conversion", () => {
    test("defaults to mm when unit is undefined or MM", () => {
      const converted = convertToUnit(as568Data.slice(0, 5));
      expect(converted[0].unit).toBe(MeasurementUnit.MM);
      expect(converted[0].cs).toBe(as568Data[0].cs);
      expect(converted[0].id).toBe(as568Data[0].id);
      expect(converted[0].od).toBe(as568Data[0].od);
    });

    test("converts dimensions to inch with exact 3-decimal precision", () => {
      const sample = [
        { standard: Standard.AS, code: "001", cs: 1.02, id: 0.74, od: 2.78 },
        { standard: Standard.JIS, code: "P-3", cs: 1.9, id: 2.8, od: 6.6 },
        { standard: Standard.METRIC, code: "1.5x20", cs: 1.5, id: 20, od: 23 },
      ];

      const converted = convertToUnit(sample, MeasurementUnit.INCH);

      expect(converted[0]).toEqual({
        standard: Standard.AS,
        code: "001",
        cs: Number((1.02 / 25.4).toFixed(3)),
        id: Number((0.74 / 25.4).toFixed(3)),
        od: Number((2.78 / 25.4).toFixed(3)),
        unit: MeasurementUnit.INCH,
      });

      expect(converted[1]).toEqual({
        standard: Standard.JIS,
        code: "P-3",
        cs: Number((1.9 / 25.4).toFixed(3)),
        id: Number((2.8 / 25.4).toFixed(3)),
        od: Number((6.6 / 25.4).toFixed(3)),
        unit: MeasurementUnit.INCH,
      });

      expect(converted[2]).toEqual({
        standard: Standard.METRIC,
        code: "1.5x20",
        cs: Number((1.5 / 25.4).toFixed(3)),
        id: Number((20 / 25.4).toFixed(3)),
        od: Number((23 / 25.4).toFixed(3)),
        unit: MeasurementUnit.INCH,
      });
    });

    test("immutability: input records are not mutated", () => {
      const original = as568Data.slice(0, 3);
      const clonedOriginal = JSON.parse(JSON.stringify(original));

      const converted = convertToUnit(original, MeasurementUnit.INCH);

      expect(original).toEqual(clonedOriginal);
      expect(converted[0]).not.toBe(original[0]);
      expect("unit" in original[0]).toBe(false);
    });
  });

  describe("getStandardData & getAllORingData", () => {
    test("getStandardData returns all records for requested standard", () => {
      const asRecords = getStandardData(Standard.AS);
      expect(asRecords.length).toBe(394);
      expect(asRecords.every((r) => r.standard === Standard.AS)).toBe(true);

      const jisRecords = getStandardData(Standard.JIS, MeasurementUnit.INCH);
      expect(jisRecords.length).toBe(545);
      expect(jisRecords.every((r) => r.standard === Standard.JIS && r.unit === MeasurementUnit.INCH)).toBe(true);

      const metricRecords = getStandardData(Standard.METRIC);
      expect(metricRecords.length).toBe(2883);
      expect(metricRecords.every((r) => r.standard === Standard.METRIC)).toBe(true);
    });

    test("getAllORingData returns combined dataset across all standards", () => {
      const all = getAllORingData();
      expect(all.length).toBe(394 + 545 + 2883);

      const allInch = getAllORingData(MeasurementUnit.INCH);
      expect(allInch.length).toBe(394 + 545 + 2883);
      expect(allInch.every((r) => r.unit === MeasurementUnit.INCH)).toBe(true);
    });
  });
});
