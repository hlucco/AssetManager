import AccountListView from "./components/AccountListView";
import AssetsView from "./components/AssetsView";
import CreditView from "./components/CreditView";
import Flyout from "./components/Flyout";
import Menu from "./components/Menu";
import IconMenu from "./components/icons/IconMenu";
import { useEffect, useState } from "react";
import { RootState, useAppDispatch } from "./store/store";
import { getUserInfo } from "./store/userSlice";
import { fetchClasses, refreshAll } from "./store/classSlice";
import { getToken } from "./utils";
import axios from "axios";
import { connect } from "react-redux";
import NetView from "./components/NetView";
import { userInfo } from "node:os";
import { getHistory } from "./store/totalValueSlice";
import { AssetClass } from "./models/assetClass";
import React from "react";

interface PropsApp {
  userInfo: any;
  assetClasses: AssetClass[];
}

function App(props: PropsApp) {
  const dispatch = useAppDispatch();

  axios.defaults.headers.common["Authorization"] = getToken();

  useEffect(() => {
    const asyncHandler = async () => {
      await dispatch(fetchClasses());
      await dispatch(getUserInfo());
      await dispatch(getHistory());
    };

    asyncHandler();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    //handle coinbase connector redirect
    if (urlParams.has("name")) {
      toggleMenu(true);
    }
  }, []);

  //   if (props.userInfo.sync) {
  //     console.log("sync on");
  //     setInterval(() => {
  //       dispatch(refreshAll());
  //     }, 300000);
  //   }

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
        {props.assetClasses.length === 0 ? (
          <span>No existing assets</span>
        ) : (
          <React.Fragment>
            <AssetsView />
            <CreditView />
            <AccountListView />
            <NetView />
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

function mapStateToProps(state: RootState) {
  return {
    userInfo: state.userReducer.userInfo,
    assetClasses: state.classReducer.assetClasses,
  };
}

export default connect(mapStateToProps)(App);
