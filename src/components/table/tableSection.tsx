import { TableHead, TableRowsComponent } from "components";
import { FilterContext } from "components/context";
import { SortProvider } from "components/context/SortContext";
import { TABLE_HEADERS, getAllORingData } from "data";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

interface props {}

type TableHeadField = "standard" | "code" | "id" | "od" | "cs";

export const TableSection: React.FC<props> = () => {
  const { t } = useTranslation("global");
  const filterContext = useContext(FilterContext);
  const oRingData = getAllORingData(filterContext.filter.unit);
  const translatedTableHead = TABLE_HEADERS.map((header) =>
    t(`table.tableHead.${header.toLowerCase() as TableHeadField}`)
  );
  const tableStyle = `
    table
    table-hover
    table-striped
    table-sm
    table-responsive
    table caption-top
    shadow-sm
    `;

  return (
    <SortProvider>
      <div className="overflow-scroll">
        <table className={tableStyle}>
          <caption>
            <div className="container">
              <small>
                {t("table.infoDesc.desc")}
                <strong>
                  {filterContext.filter.unit === "mm"
                    ? t("table.infoDesc.unit.mm")
                    : t("table.infoDesc.unit.inch")}
                </strong>
              </small>
            </div>
          </caption>

          <TableHead headerData={translatedTableHead} />

          <tbody className="table-group-divider">
            <TableRowsComponent
              data={oRingData}
              filter={filterContext.filter}
            />
          </tbody>
        </table>
      </div>
    </SortProvider>
  );
};
