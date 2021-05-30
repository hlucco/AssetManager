import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import AccountListView from "./components/AccountListView";
import AssetsView from "./components/AssetsView";
import CreditView from "./components/CreditView";
import Flyout from "./components/Flyout";
import Graph from "./components/Graph";
import IconMenu from "./components/icons/IconMenu";
import Login from "./components/Login";
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
  const token = false;

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

  if (!token) {
    return <Login />;
  }

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
        <AccountListView />
      </div>
    </div>
  );
}

function mapStateToProps(state: RootState) {
  return { assetClasses: state.classReducer.assetClasses };
}

export default connect(mapStateToProps)(Layout);
