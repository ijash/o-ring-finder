import { IDataFilter, MeasurementUnit } from "data";

/**
 * URL parameter mapping functions per data-model.md:
 * - UrlFilterParams.code: string
 * - UrlFilterParams.unit: MeasurementUnit ("mm" | "inch")
 * - UrlFilterParams.minId: number (> 0)
 * - UrlFilterParams.maxId: number (> 0)
 * - UrlFilterParams.minOd: number (> 0)
 * - UrlFilterParams.maxOd: number (> 0)
 * - UrlFilterParams.minCs: number (> 0)
 * - UrlFilterParams.maxCs: number (> 0)
 */

const parsePositiveNumber = (val: string | null): number | undefined => {
  if (!val) return undefined;
  const num = Number(val);
  return Number.isFinite(num) && num > 0 ? num : undefined;
};

export const parseUrlFilters = (search: string): Partial<IDataFilter> => {
  if (!search || search === "?") return {};
  const params = new URLSearchParams(search);
  const result: Partial<IDataFilter> = {};

  const rawCode = params.get("code");
  if (rawCode && rawCode.trim()) {
    result.code = rawCode.trim();
  }

  const rawUnit = params.get("unit");
  if (rawUnit === "inch" || rawUnit === MeasurementUnit.INCH) {
    result.unit = MeasurementUnit.INCH;
  } else if (rawUnit === "mm" || rawUnit === MeasurementUnit.MM) {
    result.unit = MeasurementUnit.MM;
  }

  const minId = parsePositiveNumber(params.get("minId"));
  if (minId !== undefined) result.minId = minId;

  const maxId = parsePositiveNumber(params.get("maxId"));
  if (maxId !== undefined) result.maxId = maxId;

  const minOd = parsePositiveNumber(params.get("minOd"));
  if (minOd !== undefined) result.minOd = minOd;

  const maxOd = parsePositiveNumber(params.get("maxOd"));
  if (maxOd !== undefined) result.maxOd = maxOd;

  const minCs = parsePositiveNumber(params.get("minCs"));
  if (minCs !== undefined) result.minCs = minCs;

  const maxCs = parsePositiveNumber(params.get("maxCs"));
  if (maxCs !== undefined) result.maxCs = maxCs;

  return result;
};

export const syncFilterToUrl = (
  filter: IDataFilter,
  currentPath = typeof window !== "undefined" ? window.location.pathname : "",
  currentSearch = typeof window !== "undefined" ? window.location.search : ""
): string => {
  const currentParams = new URLSearchParams(currentSearch);
  const nextParams = new URLSearchParams();

  // Preserve language parameter if present
  const currentLng = currentParams.get("lng");
  if (currentLng) {
    nextParams.set("lng", currentLng);
  }

  if (filter.code && filter.code.trim()) {
    nextParams.set("code", filter.code.trim());
  }

  if (filter.unit === MeasurementUnit.INCH) {
    nextParams.set("unit", "inch");
  }

  if (filter.minId !== undefined && filter.minId > 0) {
    nextParams.set("minId", String(filter.minId));
  }
  if (filter.maxId !== undefined && filter.maxId > 0) {
    nextParams.set("maxId", String(filter.maxId));
  }
  if (filter.minOd !== undefined && filter.minOd > 0) {
    nextParams.set("minOd", String(filter.minOd));
  }
  if (filter.maxOd !== undefined && filter.maxOd > 0) {
    nextParams.set("maxOd", String(filter.maxOd));
  }
  if (filter.minCs !== undefined && filter.minCs > 0) {
    nextParams.set("minCs", String(filter.minCs));
  }
  if (filter.maxCs !== undefined && filter.maxCs > 0) {
    nextParams.set("maxCs", String(filter.maxCs));
  }

  const query = nextParams.toString();
  const nextUrl = query ? `${currentPath}?${query}` : currentPath;

  if (
    typeof window !== "undefined" &&
    window.history &&
    typeof window.history.replaceState === "function"
  ) {
    window.history.replaceState(null, "", nextUrl);
  }

  return nextUrl;
};
