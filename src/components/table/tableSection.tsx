import React from "react";
import { TableRowsComponent } from "components";
import { As568Data, JisData, MetricData, StandardData } from "data";
interface props {}

export const TableSection: React.FC<props> = () => {
  const as568 = As568Data;
  const jis = JisData;
  const metric = MetricData;
  return (
    <div className="row text-start">
      <table className="table table-hover table-striped table-sm table-responsive table caption-top shadow-sm">
        <caption>
          <div className="container">
            <small>
              {"O-ring size table represented in "}
              <strong>{"filterTerm.unit"}</strong>
            </small>
          </div>
        </caption>
        <thead className="table-dark bg-dark">
          {StandardData.getHeaders().map((h: string) => (
            <th>
              <strong>{h}</strong>
            </th>
          ))}
        </thead>
        <tbody className="table-group-divider">
          <TableRowsComponent data={[as568, jis, metric]} />
        </tbody>
      </table>
    </div>
  );
};