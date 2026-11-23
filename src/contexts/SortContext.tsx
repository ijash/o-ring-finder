import React, { createContext, useContext, useMemo, useState } from "react";

export type SortDirection = "asc" | "desc" | null;

interface SortContextProps {
  sortBy: string;
  sortDirection: SortDirection;
  setSortBy: (sortBy: string) => void;
  setSortDirection: (sortDirection: SortDirection) => void;
  resetSort: () => void;
}

const SortContext = createContext<SortContextProps | undefined>(undefined);

interface SortProviderProps {
  children: React.ReactNode;
}

export const SortProvider: React.FC<SortProviderProps> = ({ children }) => {
  const [sortBy, setSortBy] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const resetSort = () => {
    setSortBy("");
    setSortDirection(null);
  };

  const value = useMemo(
    () => ({ sortBy, sortDirection, setSortBy, setSortDirection, resetSort }),
    [sortBy, sortDirection]
  );

  return <SortContext.Provider value={value}>{children}</SortContext.Provider>;
};

export const useSort = () => {
  const context = useContext(SortContext);
  if (!context) {
    throw new Error("useSort must be used within a SortProvider");
  }
  return context;
};
