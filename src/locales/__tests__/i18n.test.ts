import enGlobals from "../en/globals.json";
import idGlobals from "../id/globals.json";
import i18next, { i18nInit } from "../i18n";

function getLeafKeysAndValues(
  obj: Record<string, unknown>,
  prefix = ""
): Map<string, unknown> {
  const map = new Map<string, unknown>();

  for (const [key, value] of Object.entries(obj)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const nested = getLeafKeysAndValues(
        value as Record<string, unknown>,
        fullPath
      );
      nested.forEach((v, k) => map.set(k, v));
    } else {
      map.set(fullPath, value);
    }
  }

  return map;
}

describe("i18n module and translation dictionary parity", () => {
  test("initializes i18n instance cleanly with en language", () => {
    expect(i18nInit()).toBe(i18next);
    expect(i18next).toBeDefined();
    expect(i18next.language).toBe("en");
    expect(i18next.t("header.title", { ns: "global" })).toBe("Oring Finder");
  });

  test("en and id dictionaries have 100% identical leaf key sets", () => {
    const enMap = getLeafKeysAndValues(enGlobals);
    const idMap = getLeafKeysAndValues(idGlobals);

    const enKeys = Array.from(enMap.keys()).sort();
    const idKeys = Array.from(idMap.keys()).sort();

    const missingInId = enKeys.filter((k) => !idMap.has(k));
    const missingInEn = idKeys.filter((k) => !enMap.has(k));

    expect(missingInId).toEqual([]);
    expect(missingInEn).toEqual([]);
    expect(enKeys).toEqual(idKeys);
  });

  test("all leaf translation strings are non-empty in both en and id dictionaries", () => {
    const enMap = getLeafKeysAndValues(enGlobals);
    const idMap = getLeafKeysAndValues(idGlobals);

    enMap.forEach((value) => {
      expect(typeof value).toBe("string");
      expect((value as string).trim().length).toBeGreaterThan(0);
    });

    idMap.forEach((value) => {
      expect(typeof value).toBe("string");
      expect((value as string).trim().length).toBeGreaterThan(0);
    });
  });

  test("switches language between en and id and provides translated text", async () => {
    const i18n = i18next;

    expect(i18n.t("inputForms.clear", { ns: "global" })).toBe("Clear filter");

    await i18n.changeLanguage("id");
    expect(i18n.t("inputForms.clear", { ns: "global" })).toBe("Hapus filter");

    await i18n.changeLanguage("en");
    expect(i18n.t("inputForms.clear", { ns: "global" })).toBe("Clear filter");
  });
});
