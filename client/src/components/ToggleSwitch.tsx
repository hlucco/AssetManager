interface PropsToggleSwitch {
  checked: boolean;
  onChange: any;
}

function ToggleSwitch(props: PropsToggleSwitch) {
  return (
    <input
      className="toggle"
      type="checkbox"
      checked={props.checked}
      onChange={props.onChange}
    />
  );
}

export default ToggleSwitch;
