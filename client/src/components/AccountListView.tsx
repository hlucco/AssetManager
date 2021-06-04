import React from "react";
import { ReactNode } from "react";
import { connect } from "react-redux";
import { AssetClass } from "../models/assetClass";
import { PortfolioAccount } from "../models/portfolioAccount";
import { RootState } from "../store/store";
import IconTrendingDown from "./icons/IconTrendingDown";
import IconTrendingUp from "./icons/IconTrendingUp";

interface PropsAccountListView {
  assetClasses: AssetClass[];
}

function processHistory(account: PortfolioAccount): ReactNode {
  let currentValue = account.totalBalance;
  let previousValue =
    account.balanceHistory[account.balanceHistory.length - 2].total;
  let dif = currentValue - previousValue;
  let change = (Math.abs(dif) / previousValue).toFixed(3);

  return (
    <div
      className="account-list-item-change"
      style={dif >= 0 ? { color: "#3b943b" } : { color: "#9c2929" }}
    >
      {dif >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
      <span>{change}%</span>
    </div>
  );
}

function renderAccountsList(props: PropsAccountListView) {
  let list: ReactNode[] = [];
  props.assetClasses.forEach((i: AssetClass) => {
    i.accounts.forEach((j: PortfolioAccount) => {
      const current = (
        <div className="account-list-item-container">
          <div
            className="account-list-class-indicator"
            style={{ backgroundColor: i.color }}
          ></div>
          <div className="account-list-item">
            <span className="account-list-item-name">{j.name}</span>
            {processHistory(j)}
            <span className="account-list-item-total">
              {Math.round((j.totalBalance + Number.EPSILON) * 100) / 100}
            </span>
          </div>
        </div>
      );
      list.push(current);
    });
  });
  return list;
}

function AccountListView(props: PropsAccountListView) {
  return (
    <div className="card">
      <div className="card-header">Accounts</div>
      <div className="card-content">
        <div className="card-item">{renderAccountsList(props)}</div>
      </div>
    </div>
  );
}

function mapStateToProps(state: RootState) {
  return { assetClasses: state.classReducer.assetClasses };
}

export default connect(mapStateToProps)(AccountListView);
