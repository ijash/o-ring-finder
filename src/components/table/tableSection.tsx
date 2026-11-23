import { TableHead, TableRowsComponent } from "components";
import { SortProvider, useFilter } from "contexts";
import { TABLE_HEADER_KEYS, getAllORingData } from "data";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const TableSection: React.FC = () => {
  const { t } = useTranslation("global");
  const { filter } = useFilter();

  const oRingData = useMemo(
    () => getAllORingData(filter.unit),
    [filter.unit]
  );

  const headerItems = useMemo(
    () =>
      TABLE_HEADER_KEYS.map((key) => ({
        key,
        label: t(`table.tableHead.${key}`),
      })),
    [t]
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

          <TableHead headerItems={headerItems} />

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

