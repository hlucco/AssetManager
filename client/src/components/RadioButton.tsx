import React from "react";
import { ReactNode } from "react";

interface PropsRadioButtons {
  options: string[];
  name: string;
  checked: string;
  inputOnChange: any;
}

function RadioButton(props: PropsRadioButtons) {
  let radioButtons: ReactNode[] = [];
  props.options.forEach((option) => {
    let currentButton = (
      <div className="radio-item-container">
        <input
          type="radio"
          name={props.name}
          checked={props.checked === option}
          onClick={() => {
            props.inputOnChange(option);
          }}
        />
        <div
          className={
            props.checked === option ? "check-box-active" : "check-box"
          }
        ></div>
        {option}
      </div>
    );
    radioButtons.push(currentButton);
  });
  return <React.Fragment>{radioButtons}</React.Fragment>;
}

export default RadioButton;
