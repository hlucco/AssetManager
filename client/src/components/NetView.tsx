import { connect } from "react-redux";
import { AssetClass } from "../models/assetClass";
import BalanceHistory from "../models/balanceHistory";
import { RootState } from "../store/store";
import Graph from "./Graph";

interface PropsNetView {
  assetClasses: AssetClass[];
  totalValueInfo: BalanceHistory[];
}

function NetView(props: PropsNetView) {
  let totals: number[] = [];
  let dates: string[] = [];
  props.totalValueInfo.map((i: BalanceHistory) => {
    totals.push(i.total);
    let date = new Date(i.date);
    dates.push(date.toUTCString().slice(5, 16));
  });

  return (
    <div className="card">
      <div className="card-header">Total Value</div>
      <div className="card-content">
        <div className="card-item">
          <Graph
            chartId="netChart"
            type="line"
            labels={dates}
            data={totals}
            colors={[(props.assetClasses[0] || {}).color]}
            fill={false}
            width={800}
            height={300}
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
