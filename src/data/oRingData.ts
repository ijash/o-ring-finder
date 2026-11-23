import {
  DataRepresentation,
  IDataObject,
  MeasurementUnit,
  Standard,
} from "./IData";
import as568Json from "./as568.json";
import jisJson from "./jis.json";
import metricJson from "./metric.json";

export const TABLE_HEADERS: readonly ["Standard", "Code", "ID", "OD", "CS"] = [
  "Standard",
  "Code",
  "ID",
  "OD",
  "CS",
] as const;

export const as568Data: readonly IDataObject[] = as568Json.map((d) => ({
  standard: Standard.AS,
  code: d.code,
  cs: d.cs,
  id: d.id,
  od: d.od,
}));

export const jisData: readonly IDataObject[] = jisJson.map((d) => ({
  standard: Standard.JIS,
  code: d.code,
  cs: d.cs,
  id: d.id,
  od: d.od,
}));

export const metricData: readonly IDataObject[] = metricJson.map((d) => ({
  standard: Standard.METRIC,
  code: d.code,
  cs: d.cs,
  id: d.id,
  od: d.od,
}));

const allData: readonly IDataObject[] = [
  ...as568Data,
  ...jisData,
  ...metricData,
];

export function convertToUnit(
  records: readonly IDataObject[],
  unit: MeasurementUnit = MeasurementUnit.MM
): DataRepresentation[] {
  if (unit === MeasurementUnit.INCH) {
    return records.map((record) => ({
      standard: record.standard,
      code: record.code,
      cs: Number((record.cs / 25.4).toFixed(3)),
      id: Number((record.id / 25.4).toFixed(3)),
      od: Number((record.od / 25.4).toFixed(3)),
      unit: MeasurementUnit.INCH,
    }));
  }

  return records.map((record) => ({
    standard: record.standard,
    code: record.code,
    cs: record.cs,
    id: record.id,
    od: record.od,
    unit: MeasurementUnit.MM,
  }));
}

export function getStandardData(
  standard: Standard,
  unit?: MeasurementUnit
): DataRepresentation[] {
  switch (standard) {
    case Standard.AS:
      return convertToUnit(as568Data, unit);
    case Standard.JIS:
      return convertToUnit(jisData, unit);
    case Standard.METRIC:
      return convertToUnit(metricData, unit);
  }
}

export function getAllORingData(
  unit?: MeasurementUnit
): DataRepresentation[] {
  return convertToUnit(allData, unit);
}
