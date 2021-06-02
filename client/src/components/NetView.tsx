import { connect } from "react-redux";
import { AssetClass } from "../models/assetClass";
import BalanceHistory from "../models/balanceHistory";
import { RootState } from "../store/store";
import { getMonths } from "../utils";
import Graph from "./Graph";

interface PropsNetView {
  assetClasses: AssetClass[];
  totalValueInfo: BalanceHistory[];
}

function NetView(props: PropsNetView) {
  let totals: number[] = [];
  props.totalValueInfo.map((i: BalanceHistory) => {
    totals.push(i.total);
  });

  return (
    <div className="card">
      <div className="card-header">Total Value</div>
      <div className="card-content">
        <div className="card-item">
          <Graph
            chartId="netChart"
            type="line"
            // labels={getMonths(12)}
            data={totals}
            colors={["#ff00ff"]}
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
  return {
    assetClasses: state.classReducer.assetClasses,
    totalValueInfo: state.totalValueReducer.totalValueInfo,
  };
}

export default connect(mapStateToProps)(NetView);
