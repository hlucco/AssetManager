import { useState } from "react";
import { connect } from "react-redux";
import { RootState, useAppDispatch } from "../store/store";
import { login, register } from "../store/userSlice";
import IconAlertCircle from "./icons/IconAlertCircle";
import IconArrowRightCircle from "./icons/IconArrowRightCircle";
import IconCheckCircle from "./icons/IconCheckCircle";
import IconUserPlus from "./icons/IconUserPlus";
import TextInput from "./TextInput";

interface PropsLogin {
  userInfo: any;
  setToken: any;
  loginState: string;
}

function Login(props: PropsLogin) {
  const handleKeyPress = async (e: any) => {
    if (e.key === "Enter") {
      await dispatch(login({ username: username, password: password }));
    }
  };

  const updateText = (e: any, handler: Function) => {
    let value = e.target.value;
    handler(value);
  };

  if (props.userInfo.token !== undefined) {
    props.setToken(props.userInfo.token);
  }

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();

  return (
    <div className="login-container" onKeyPress={(e: any) => handleKeyPress(e)}>
      {props.loginState === "failed" ? (
        <div className="banner failure">
          <IconAlertCircle />
          Username or password is incorect
        </div>
      ) : null}
      {props.userInfo.status === "success" ? (
        <div className="banner success">
          <IconCheckCircle />
          Account succesfully created
        </div>
      ) : null}
      <div className="login-card">
        <div className="login-content">
          <h1>Login</h1>
          <TextInput
            type={"text"}
            inputOnChange={(e: Event) => updateText(e, setUsername)}
            textValue={username}
            placeholder="Username"
          />
          <TextInput
            type={"password"}
            inputOnChange={(e: Event) => updateText(e, setPassword)}
            textValue={password}
            placeholder="Password"
          />
          <div className="login-button-container">
            <span
              className="login-button"
              onClick={() => {
                dispatch(register({ username: username, password: password }));
              }}
            >
              <IconUserPlus />
            </span>
            <span
              className="login-button"
              onClick={async () => {
                await dispatch(
                  login({ username: username, password: password })
                );
              }}
            >
              <IconArrowRightCircle />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state: RootState) {
  return {
    userInfo: state.userReducer.userInfo,
    loginState: state.userReducer.status,
  };
}

export default connect(mapStateToProps)(Login);
