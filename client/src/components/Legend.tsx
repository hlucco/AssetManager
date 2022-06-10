import { ReactNode } from "react";
import { AssetClass } from "../models/assetClass";

interface PropsLegend {
  data: AssetClass[];
  total: number;
}

function renderLegend(data: AssetClass[], total: number): ReactNode[] {
  let items: ReactNode[] = [];
  data = data.filter((i) => i.name !== "Credit");
  data.forEach((i: AssetClass) => {
    const current = (
      <div className="legend-item-container">
        <div
          className="legend-item-circle"
          style={{ backgroundColor: i.color }}
        ></div>
        <div className="legend-item-text">
          <span>
            {i.name}{" "}
            {total !== 0 ? Math.round((i.totalValue / total) * 100) : 0}%
          </span>
        </div>
      </div>
    );
    items.push(current);
  });
  return items;
}

function Legend(props: PropsLegend) {
  return (
    <div className="legend-container">
      {renderLegend(props.data, props.total)}
    </div>
  );
}

export default Legend;
