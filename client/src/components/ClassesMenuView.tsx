import {
  SetStateAction,
  Dispatch,
  ReactNode,
  useState,
  useRef,
  Ref,
} from "react";
import IconArrowLeft from "./icons/IconArrowLeft";
import IconPlus from "./icons/iconPlus";
import { AssetClass } from "../models/assetClass";
import TextInput from "./TextInput";
import { v4 as uuidv4 } from "uuid";
import { addClass, deleteClass, updateClass } from "../store/classSlice";
import { connect } from "react-redux";
import { AppDispatch, RootState, useAppDispatch } from "../store/store";
import IconX from "./icons/IconX";
import colorList from "../resources/colorList.json";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { useOutsideAlerter } from "../utils";

interface PropsClassesMenuView {
  setView: Dispatch<SetStateAction<string>>;
  assetClasses: AssetClass[];
}

function renderClassList(
  data: AssetClass[],
  dispatch: AppDispatch,
  colorPickerActive: string,
  setColorPickerActive: Function,
  colorPickerRef: Ref<HTMLDivElement>
): ReactNode[] {
  let items: ReactNode[] = [];
  data.forEach((i: AssetClass) => {
    const current = (
      <div className="asset-class-item">
        <span>{i.name}</span>
        <div className="asset-buttons-container">
          <span
            ref={colorPickerRef}
            onClick={async (event) => {
              setColorPickerActive(i.id);
            }}
          >
            <div
              className="menu-item-circle"
              style={{ backgroundColor: i.color }}
            ></div>
            {colorPickerActive === i.id ? (
              <div
                ref={colorPickerRef}
                className="class-color-picker-container"
              >
                <HexColorPicker
                  color={i.color}
                  onChange={async (color) => {
                    let updated = {
                      ...i,
                      color: color,
                    };
                    await dispatch(updateClass(updated));
                  }}
                />
              </div>
            ) : null}
          </span>
          <span
            onClick={async () => {
              await dispatch(deleteClass(i.id));
            }}
          >
            <IconX />
          </span>
        </div>
      </div>
    );
    items.push(current);
  });
  return items;
}

function ClassesMenuview(props: PropsClassesMenuView) {
  const dispatch = useAppDispatch();
  const wrapperRef = useRef(null);

  const [adding, toggleAdding] = useState(false);
  const [newClass, setNewClass] = useState("");
  const [colorPickerActive, setColorPickerActive] = useState("");

  useOutsideAlerter(wrapperRef, setColorPickerActive);

  const updateText = (e: any) => {
    let value = e.target.value;
    setNewClass(value);
  };

  return (
    <div className="menu-container">
      <div className="menu-header-container">
        <span onClick={() => props.setView("menu")}>
          <IconArrowLeft />
        </span>
        <h1>Classes</h1>
      </div>
      {renderClassList(
        props.assetClasses,
        dispatch,
        colorPickerActive,
        setColorPickerActive,
        wrapperRef
      )}
      {adding ? (
        <div className="add-new-class-container">
          <span>Class name:</span>
          <TextInput
            type={"text"}
            inputOnChange={updateText}
            textValue={newClass}
          />
          <div className="options-container">
            <button
              className="button-primary"
              disabled={newClass === ""}
              onClick={async () => {
                const body = {
                  name: newClass,
                  accounts: [],
                  id: uuidv4(),
                  totalValue: 0,
                  color: colorList[0],
                  balanceHistory: [],
                };
                await dispatch(addClass(body));
                setNewClass("");
                toggleAdding(false);
              }}
            >
              Submit
            </button>
            <button
              className="button-primary"
              onClick={() => {
                toggleAdding(false);
                setNewClass("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div onClick={() => toggleAdding(true)} className="add-class-button">
          <IconPlus />
          <span>Add class</span>
        </div>
      )}
    </div>
  );
}

function mapStateToProps(state: RootState) {
  return { assetClasses: state.classReducer.assetClasses };
}

export default connect(mapStateToProps)(ClassesMenuview);
