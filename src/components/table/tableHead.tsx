import { TableHeadField, useSort } from "contexts";
import React from "react";

export interface TableHeadItem {
  key: TableHeadField;
  label: string;
}

interface Props {
  headerItems: TableHeadItem[];
}

const tHeadStyle = "bg-dark";
const thStyle = "bg-dark text-white ps-2 clickable";

export const TableHead: React.FC<Props> = ({ headerItems }) => {
  const { sortBy, sortDirection, setSortBy, setSortDirection } = useSort();

  const handleSort = (field: TableHeadField) => {
    if (sortBy === field) {
      setSortDirection(
        sortDirection === "asc"
          ? "desc"
          : sortDirection === "desc"
          ? null
          : "asc"
      );
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const renderSortIcon = (field: TableHeadField) => {
    if (sortBy === field) {
      const style = "bg-info";
      if (sortDirection === "asc") return { direction: `▲`, style };
      if (sortDirection === "desc") return { direction: `▼`, style };
    }
    return { direction: undefined, style: "" };
  };

  const getAriaSort = (field: TableHeadField): "ascending" | "descending" | "none" => {
    if (sortBy === field) {
      if (sortDirection === "asc") return "ascending";
      if (sortDirection === "desc") return "descending";
    }
    return "none";
  };

  return (
    <thead>
      <tr className={tHeadStyle}>
        {headerItems.map((item) => {
          const icon = renderSortIcon(item.key);
          return (
            <th
              key={item.key}
              className={`${icon.style} ${thStyle}`}
              onClick={() => handleSort(item.key)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSort(item.key);
                }
              }}
              tabIndex={0}
              aria-sort={getAriaSort(item.key)}
              role="columnheader"
            >
              {item.label}
              {icon.direction}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

