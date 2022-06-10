import { useEffect, useState } from "react";
import AccountsMenuView from "./AccountsMenuView";
import ClassesMenuview from "./ClassesMenuView";
import IconDollar from "./icons/IconDollar";
import IconLayers from "./icons/IconLayers";
import { RootState, useAppDispatch } from "../store/store";
import { connect } from "react-redux";
import IconLogout from "./icons/IconLogout";
import { logout } from "../store/userSlice";

interface PropsMenu {
  userInfo: any;
}

function Menu(props: PropsMenu) {
  const [view, setView] = useState("menu");
  const dispatch = useAppDispatch();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    //handle coinbase connector redirect
    if (urlParams.has("name")) {
      setView("accounts");
    }
  }, []);

  switch (view) {
    case "accounts":
      return <AccountsMenuView setView={setView} />;
    case "classes":
      return <ClassesMenuview setView={setView} />;
    default:
      return (
        <div className="menu-container">
          <h1>Henry's Portfolio</h1>
          <div onClick={() => setView("accounts")} className="menu-item">
            <IconDollar />
            <span>Accounts</span>
          </div>
          <div onClick={() => setView("classes")} className="menu-item">
            <IconLayers />
            <span>Classes</span>
          </div>
          {/* <div className="menu-item" onClick={() => dispatch(updateUserSync())}>
            <div className="sync-toggle">
              <div className="sync-container">
                <IconSync />
                <span>Sync</span>
              </div>
              <ToggleSwitch checked={props.userInfo.sync} onChange={() => {}} />
            </div>
          </div> */}
          <div onClick={() => dispatch(logout())} className="menu-item">
            <IconLogout />
            <span>Logout</span>
          </div>
        </div>
      );
  }
}

function mapStateToProps(state: RootState) {
  return {
    assetClasses: state.classReducer.assetClasses,
    userInfo: state.userReducer.userInfo,
  };
}

export default connect(mapStateToProps)(Menu);
