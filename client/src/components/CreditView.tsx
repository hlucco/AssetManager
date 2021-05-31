import React from "react";
import { connect } from "react-redux";
import { AssetClass } from "../models/assetClass";
import { RootState } from "../store/store";
import Graph from "./Graph";

interface PropsCreditView {
  assetClasses: AssetClass[];
}

function CreditView(props: PropsCreditView) {
  let creditClass =
    props.assetClasses.filter((i) => i.name === "Credit")[0] || {};
  let totalBalance = Math.abs(creditClass.totalValue);

  console.log(creditClass);

  let limit;

  if (
    Object.keys(creditClass).length !== 0 &&
    creditClass.accounts.length !== 0
  ) {
    limit = (props.assetClasses.filter((i) => i.name === "Credit")[0] || {})
      .accounts[0].accountDetails.accounts[0].balances.limit;
  }
  return (
    <div className="card">
      <div className="card-header">Credit</div>
      <div className="card-content">
        <div className="card-item">
          <div className="credit-view-container">
            <Graph
              chartId="assetChart"
              type="doughnut"
              labels={["Balance", "Remaining"]}
              centerText={`$${totalBalance.toString()}`}
              data={[totalBalance, limit]}
              colors={[creditClass.color, "#191819"]}
              width={300}
              height={300}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state: RootState) {
  return { assetClasses: state.classReducer.assetClasses };
}

export default connect(mapStateToProps)(CreditView);
