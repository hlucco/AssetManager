import React from "react";
import { connect } from "react-redux";
import { AssetClass } from "../models/assetClass";
import { RootState } from "../store/store";
import Graph from "./Graph";
import Legend from "./Legend";

interface PropsAssetsView {
  assetClasses: AssetClass[];
}

function CreditView(props: PropsAssetsView) {
  let total = 0;
  props.assetClasses
    .filter((i) => i.name !== "Credit")
    .forEach((i) => {
      total += i.totalValue;
    });
  let totalString = `$${Math.round(total).toString()}`;

  const data = {
    labels: props.assetClasses
      .filter((i) => i.name !== "Credit")
      .map((i) => i.name),
    values: props.assetClasses
      .filter((i) => i.name !== "Credit")
      .map((i) => i.totalValue),
    total: totalString,
    colors: props.assetClasses
      .filter((i) => i.name !== "Credit")
      .map((i) => i.color),
  };

  return (
    <div className="card">
      <div className="card-header">Assets</div>
      <div className="card-content">
        <div className="card-item">
          <Legend data={props.assetClasses} total={total} />
        </div>
        <div className="card-item">
          <Graph
            chartId="assetChart"
            type="doughnut"
            labels={data.labels}
            centerText={data.total}
            data={data.values}
            colors={data.colors}
            width={300}
            height={300}
          />
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state: RootState) {
  return { assetClasses: state.classReducer.assetClasses };
}

export default connect(mapStateToProps)(CreditView);
