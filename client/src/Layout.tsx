import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import CreditView from "./components/CreditView";
import Flyout from "./components/Flyout";
import Graph from "./components/Graph";
import IconMenu from "./components/icons/IconMenu";
import Legend from "./components/Legend";
import Menu from "./components/Menu";
import { AssetClass } from "./models/assetClass";
import { fetchClasses } from "./store/classSlice";
import { RootState, useAppDispatch } from "./store/store";
import "./styles/index.scss";

interface PropsLayout {
  assetClasses: AssetClass[];
}

function Layout(props: PropsLayout) {
  const dispatch = useAppDispatch();

  let total = 0;
  props.assetClasses.forEach((i) => {
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
  };

  useEffect(() => {
    const asyncHandler = async () => {
      await dispatch(fetchClasses());
    };
    asyncHandler();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    //handle coinbase connector redirect
    if (urlParams.has("name")) {
      toggleMenu(true);
    }
  }, []);

  const [menuVisible, toggleMenu] = useState(false);

  return (
    <div className="root">
      <Flyout visible={menuVisible} toggleFlyout={toggleMenu}>
        <Menu />
      </Flyout>
      <div
        onClick={() => toggleMenu(!menuVisible)}
        className="menu-button-container"
      >
        <IconMenu />
      </div>
      <div className="container">
        <div className="card">
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
                width={600}
                height={600}
              />
            </div>
          </div>
        </div>
        <div className="card">
          <CreditView />
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state: RootState) {
  return { assetClasses: state.classReducer.assetClasses };
}

export default connect(mapStateToProps)(Layout);
