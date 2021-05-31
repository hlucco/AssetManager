import { useEffect } from "react";
import { connect } from "react-redux";
import App from "./App";
import Login from "./components/Login";
import { AssetClass } from "./models/assetClass";
import store, { RootState, useAppDispatch } from "./store/store";
import { loggedIn } from "./store/userSlice";
import "./styles/index.scss";
import { useToken } from "./utils";

interface PropsLayout {
  assetClasses: AssetClass[];
  loggedIn: boolean;
  logInStatus: string;
}

function Layout(props: PropsLayout) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const asyncHandler = async () => {
      dispatch(loggedIn());
    };

    asyncHandler();
  }, []);

  const { token, setToken } = useToken();

  if (props.logInStatus === "idle") {
    return <div></div>;
  }

  if (!token || !props.loggedIn) {
    return <Login setToken={setToken} />;
  } else {
    return <App />;
  }
}

function mapStateToProps(state: RootState) {
  return {
    assetClasses: state.classReducer.assetClasses,
    loggedIn: state.userReducer.loggedIn,
    logInStatus: state.userReducer.status,
  };
}

export default connect(mapStateToProps)(Layout);
