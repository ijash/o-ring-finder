import { remapPercent } from "../mathUtils";

describe("mathUtils", () => {
  describe("remapPercent", () => {
    test("remaps 0% to the threshold ratio percentage", () => {
      // minThresh 10, maxThresh 100 -> minP = 0.1
      // percentage 0 -> (0.1 + 0 * 0.9) * 100 = 10
      expect(remapPercent(10, 100, 0)).toBe(10);
    });

    test("remaps 100% to 100%", () => {
      // minThresh 10, maxThresh 100 -> minP = 0.1
      // percentage 100 -> (0.1 + 1 * 0.9) * 100 = 100
      expect(remapPercent(10, 100, 100)).toBe(100);
    });

    test("remaps 50% to the midpoint between threshold ratio and 100", () => {
      // minThresh 20, maxThresh 100 -> minP = 0.2
      // percentage 50 -> (0.2 + 0.5 * 0.8) * 100 = 60
      expect(remapPercent(20, 100, 50)).toBeCloseTo(60);
    });

    test("handles identical min and max thresholds", () => {
      // minThresh 50, maxThresh 50 -> minP = 1
      // percentage 50 -> (1 + 0.5 * 0) * 100 = 100
      expect(remapPercent(50, 50, 50)).toBe(100);
    });
  });
});
