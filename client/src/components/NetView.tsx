import { connect } from "react-redux";
import { AssetClass } from "../models/assetClass";
import { RootState } from "../store/store";
import { getMonths } from "../utils";
import Graph from "./Graph";

interface PropsNetView {
  assetClasses: AssetClass[];
}

function NetView(props: PropsNetView) {
  const data = {
    labels: props.assetClasses
      .filter((i) => i.name !== "Credit")
      .map((i) => i.name),
    values: props.assetClasses
      .filter((i) => i.name !== "Credit")
      .map((i) => i.totalValue),
    colors: props.assetClasses
      .filter((i) => i.name !== "Credit")
      .map((i) => i.color),
  };
  return (
    <div className="card">
      <div className="card-header">Total Value</div>
      <div className="card-content">
        <div className="card-item">
          <Graph
            chartId="netChart"
            type="line"
            labels={getMonths(12)}
            data={data.values}
            colors={[data.colors[0]]}
            fill={false}
            width={800}
            height={400}
          />
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state: RootState) {
  return { assetClasses: state.classReducer.assetClasses };
}

export default connect(mapStateToProps)(NetView);
