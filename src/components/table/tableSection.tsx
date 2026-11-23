import { TableHead, TableRowsComponent } from "components";
import { SortProvider, useFilter } from "contexts";
import { TABLE_HEADERS, getAllORingData } from "data";
import React from "react";
import { useTranslation } from "react-i18next";

type TableHeadField = "standard" | "code" | "id" | "od" | "cs";

export const TableSection: React.FC = () => {
  const { t } = useTranslation("global");
  const { filter } = useFilter();
  const oRingData = getAllORingData(filter.unit);
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
                  {filter.unit === "mm"
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
              filter={filter}
            />
          </tbody>
        </table>
      </div>
    </SortProvider>
  );
};
