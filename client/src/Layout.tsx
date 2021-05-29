import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import AssetsView from "./components/AssetsView";
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
        <AssetsView />
        <CreditView />
      </div>
    </div>
  );
}

function mapStateToProps(state: RootState) {
  return { assetClasses: state.classReducer.assetClasses };
}

export default connect(mapStateToProps)(Layout);
