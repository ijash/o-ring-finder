import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { IDataFilter, MeasurementUnit } from "data";
import { parseUrlFilters, syncFilterToUrl } from "utils";

interface Props {
  children: React.ReactNode;
}

export interface FilterContextStateType {
  filter: IDataFilter;
  setFilter: React.Dispatch<React.SetStateAction<IDataFilter>>;
}

export const FilterContext = createContext<FilterContextStateType | undefined>(
  undefined
);

export const FilterContextProvider: React.FC<Props> = ({ children }) => {
  const [filter, setFilter] = useState<IDataFilter>(() => {
    const initialUrlFilters =
      typeof window !== "undefined"
        ? parseUrlFilters(window.location.search)
        : {};
    return {
      unit: MeasurementUnit.MM,
      ...initialUrlFilters,
    };
  });

  useEffect(() => {
    syncFilterToUrl(filter);
  }, [filter]);

  const value = useMemo(() => ({ filter, setFilter }), [filter]);

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = (): FilterContextStateType => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterContextProvider");
  }
  return context;
};
