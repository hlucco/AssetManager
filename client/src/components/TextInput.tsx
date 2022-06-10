interface PropsTextInput {
  textValue: string;
  type: string;
  inputOnChange: any;
  label?: string;
  placeholder?: string;
}

function TextInput(props: PropsTextInput) {
  return (
    <div className="text-input-container">
      <div
        className={
          props.textValue
            ? "text-input-field text-input-active"
            : "text-input-field"
        }
      >
        <input
          type={props.type}
          name=""
          value={props.textValue}
          onChange={props.inputOnChange}
          placeholder={props.placeholder}
        />
        {props.label ? <label>{props.label}</label> : null}
        <span></span>
      </div>
    </div>
  );
}

export default TextInput;
