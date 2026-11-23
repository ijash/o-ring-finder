export enum Standard {
  AS = "AS568",
  JIS = "JIS",
  METRIC = "Common Metric",
}

export enum MeasurementUnit {
  MM = "mm",
  INCH = "″",
}

export interface IDataObject {
  readonly standard: Standard;
  readonly code: string;
  readonly cs: number;
  readonly id: number;
  readonly od: number;
}

export interface DataRepresentation extends IDataObject {
  readonly unit: MeasurementUnit;
}

export interface IDataFilter {
  unit?: MeasurementUnit;
  minId?: number;
  maxId?: number;
  minOd?: number;
  maxOd?: number;
  minCs?: number;
  maxCs?: number;
  code?: string;
  standard?: Standard[];
}

