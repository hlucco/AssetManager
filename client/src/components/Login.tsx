import { useState } from "react";
import IconArrowRightCircle from "./icons/IconArrowRightCircle";
import IconUserPlus from "./icons/IconUserPlus";
import TextInput from "./TextInput";

function Login() {
  const updateText = (e: any, handler: Function) => {
    let value = e.target.value;
    handler(value);
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="login-container">
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
            <span className="login-button">
              <IconUserPlus />
            </span>
            <span className="login-button">
              <IconArrowRightCircle />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
