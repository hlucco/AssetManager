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

interface PropsApp {
  userInfo: any;
}

function App(props: PropsApp) {
  const dispatch = useAppDispatch();

  axios.defaults.headers.common["Authorization"] = getToken();

  useEffect(() => {
    const asyncHandler = async () => {
      await dispatch(fetchClasses());
      await dispatch(getUserInfo());
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
        <AccountListView />
      </div>
    </div>
  );
}

function mapStateToProps(state: RootState) {
  return {
    userInfo: state.userReducer.userInfo,
  };
}

export default connect(mapStateToProps)(App);
