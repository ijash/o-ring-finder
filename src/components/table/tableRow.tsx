import { useSort } from "contexts";
import { DataRepresentation, IDataFilter, Standard } from "data";
import React, { Suspense, useCallback, useDeferredValue, useMemo, useState } from "react";
import { createPortal } from "react-dom";

const CustomModal = React.lazy(() => import("components/modal/modal"));

interface props {
  data: readonly DataRepresentation[];
  filter?: IDataFilter;
}
const rowStyle = "ps-2";
const specialStyle = {
  standard: (color: Standard): string => {
    let standardColor;
    switch (color) {
      case Standard.AS:
        standardColor = "primary";
        break;
      case Standard.JIS:
        standardColor = "info";
        break;
      case Standard.METRIC:
        standardColor = "success";
        break;
      default:
        standardColor = "dark";
        break;
    }
    return `text-${standardColor}`;
  },
  code: "fw-bold ",
};

export const TableRowsComponent: React.FC<props> = React.memo(({ data, filter }) => {
  const { sortBy, sortDirection } = useSort();
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<DataRepresentation | null>(null);

  const handleShowModal = useCallback((rowData: DataRepresentation) => {
    setModalData(rowData);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setModalData(null);
  }, []);

  const filteredData = useMemo(() => {
    if (!filter) return [...data];
    return data.filter((row) => {
      if (filter.minCs !== undefined && row.cs < filter.minCs) return false;
      if (filter.maxCs !== undefined && row.cs > filter.maxCs) return false;
      if (filter.minId !== undefined && row.id < filter.minId) return false;
      if (filter.maxId !== undefined && row.id > filter.maxId) return false;
      if (filter.minOd !== undefined && row.od < filter.minOd) return false;
      if (filter.maxOd !== undefined && row.od > filter.maxOd) return false;
      if (
        filter.code &&
        !row.code.toLowerCase().includes(filter.code.toLowerCase())
      )
        return false;
      if (
        filter.standard &&
        !filter.standard.includes(row.standard)
      )
        return false;
      return true;
    });
  }, [data, filter]);

  const rows = useMemo(() => {
    if (!sortBy || sortDirection === null) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortBy, sortDirection]);

  const deferredRows = useDeferredValue(rows);

  return (
    <>
      {deferredRows.map((row) => (
        <tr
          vocab="https://schema.org/"
          typeof="Product"
          key={`${row.standard}-${row.code}`}
          onClick={() => handleShowModal(row)}
          style={{ cursor: "pointer" }}
        >
          <td
            className={`${rowStyle} ${specialStyle.standard(row.standard)}`}
            property="brand"
          >
            {row.standard}
          </td>
          <td className={`${rowStyle} ${specialStyle.code}`} property="size">
            {row.code}
          </td>
          <td className={`${rowStyle}`}>{row.id}</td>
          <td className={`${rowStyle}`}>{row.od}</td>
          <td className={`${rowStyle}`}>{row.cs}</td>
        </tr>
      ))}
      {showModal &&
        createPortal(
          <Suspense fallback={null}>
            <CustomModal
              show={showModal}
              handleClose={handleCloseModal}
              rowData={modalData}
            />
          </Suspense>,
          document.body
        )}
    </>
  );
});

