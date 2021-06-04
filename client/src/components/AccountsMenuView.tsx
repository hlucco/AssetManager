import React, {
  SetStateAction,
  Dispatch,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { connect } from "react-redux";
import { AssetClass } from "../models/assetClass";
import { createLinkToken, setAccessLink } from "../store/plaidSlice";
import { AppDispatch, RootState, useAppDispatch } from "../store/store";
import { usePlaidLink } from "react-plaid-link";
import IconArrowLeft from "./icons/IconArrowLeft";
import IconPlus from "./icons/iconPlus";
import RadioButton from "./RadioButton";
import TextInput from "./TextInput";
import IconCheckCircle from "./icons/IconCheckCircle";
import IconX from "./icons/IconX";
import { v4 as uuidv4 } from "uuid";
import { PortfolioAccount } from "../models/portfolioAccount";
import { exchangeToken, requestLink } from "../store/coinbaseSlice";
import IconSync from "./icons/iconSync";
import {
  addAccount,
  deleteAccount,
  refreshAll,
  updateAccount,
} from "../store/classSlice";

interface PropsAccountMenuView {
  setView: Dispatch<SetStateAction<string>>;
  assetClasses: AssetClass[];
  plaidInfo: any;
  coinbaseInfo: any;
}

function renderAccountList(
  data: AssetClass[],
  dispatch: AppDispatch
): ReactNode[] {
  let items: ReactNode[] = [];
  data.forEach((i: AssetClass) => {
    i.accounts.forEach((j: PortfolioAccount) => {
      const current = (
        <div className="asset-class-item">
          <span>{j.name}</span>
          <div className="asset-buttons-container">
            <span
              className={"sync-icon" + (j.id !== j.id ? "__active" : "")}
              onClick={async () => {
                await dispatch(
                  updateAccount({ accountId: j.id, assetId: i.id })
                );
              }}
            >
              <IconSync />
            </span>
            <span
              onClick={async () => {
                await dispatch(
                  deleteAccount({ accountId: j.id, assetId: i.id })
                );
              }}
            >
              <IconX />
            </span>
          </div>
        </div>
      );
      items.push(current);
    });
  });
  return items;
}

function AccountsMenuView(props: PropsAccountMenuView) {
  const classNames = props.assetClasses.map((assetClass) => {
    return assetClass.name;
  });

  const [adding, toggleAdding] = useState(false);
  const [newAccountName, setNewAccountName] = useState("");
  const [linkedSuccess, setLinkSuccess] = useState(false);
  const [currentSelectedClass, setCurrentClass] = useState(classNames[0]);
  const [accountType, setAccountType] = useState("");

  const dispatch = useAppDispatch();

  const onSuccess = async (public_token: string) => {
    let token = public_token;
    await dispatch(setAccessLink(token));
    setLinkSuccess(true);
  };

  const config: Parameters<typeof usePlaidLink>[0] = {
    token: props.plaidInfo.link_token || "",
    onSuccess,
  };

  const { open } = usePlaidLink(config);

  const updateText = (e: any) => {
    let value = e.target.value;
    setNewAccountName(value);
  };

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const asyncHandler = async () => {
      const coinbaseBody = {
        code: urlParams.get("code"),
        name: urlParams.get("name"),
        class: urlParams.get("asset_class"),
      };

      await dispatch(exchangeToken(coinbaseBody));
    };

    //handle coinbase connector redirect
    if (urlParams.has("name")) {
      asyncHandler();
      setAccountType("coinbase");
      toggleAdding(true);
      setNewAccountName(urlParams.get("name")!);
      setCurrentClass(urlParams.get("asset_class")!);
      setLinkSuccess(true);
    }
  }, []);

  return (
    <div className="menu-container">
      <div className="menu-header-container">
        <span onClick={() => props.setView("menu")}>
          <IconArrowLeft />
        </span>
        <h1>Accounts</h1>
        {/* <span
          onClick={() => {
            dispatch(refreshAll());
          }}
        >
          <IconSync />
        </span> */}
      </div>
      {renderAccountList(props.assetClasses, dispatch)}
      {adding ? (
        <div className="add-account-container">
          <span>Account name:</span>
          <TextInput
            type={"text"}
            inputOnChange={updateText}
            textValue={newAccountName}
          />
          <span>Asset class:</span>
          <RadioButton
            name="assetClasses"
            options={classNames}
            checked={currentSelectedClass}
            inputOnChange={setCurrentClass}
          />
          <span>Link account:</span>

          {linkedSuccess ? (
            <div className="connector-success-container">
              <span>Succesfully Linked</span>
              <IconCheckCircle />
            </div>
          ) : (
            <div className="plaid-container">
              <button
                onClick={() => {
                  setAccountType("plaid");
                  open();
                }}
              >
                Plaid
              </button>
              <button
                onClick={async () => {
                  let body = {
                    name: newAccountName,
                    class: currentSelectedClass,
                  };
                  let link = await dispatch(requestLink(body));
                  window.location.href = link.payload;
                }}
                className="coinbase-button"
              >
                Coinbase
              </button>
            </div>
          )}

          <div className="option-button-container">
            <button
              onClick={async () => {
                let body = {
                  name: newAccountName,
                  type: accountType,
                  access_token:
                    accountType === "plaid"
                      ? props.plaidInfo.access_token
                      : props.coinbaseInfo.access_token,
                  asset_class: currentSelectedClass,
                  totalBalance: 0,
                  accountDetails: {},
                  refresh_token:
                    accountType !== "plaid"
                      ? props.coinbaseInfo.refresh_token
                      : "",
                  id: uuidv4(),
                  balanceHistory: [],
                };

                await dispatch(addAccount(body));
                toggleAdding(false);
                setLinkSuccess(false);
                setNewAccountName("");
                setCurrentClass(classNames[0]);
              }}
              disabled={!linkedSuccess}
              className="button-primary"
            >
              Submit
            </button>
            <button
              className="button-primary"
              onClick={() => {
                toggleAdding(false);
                setLinkSuccess(false);
                setNewAccountName("");
                setCurrentClass(classNames[0]);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={async () => {
            await dispatch(createLinkToken());
            toggleAdding(true);
          }}
          className="add-class-button"
        >
          <IconPlus />
          <span>Add account</span>
        </div>
      )}
    </div>
  );
}

function mapStateToProps(state: RootState) {
  return {
    assetClasses: state.classReducer.assetClasses,
    plaidInfo: state.plaidReducer.plaidInfo,
    coinbaseInfo: state.coinbaseReducer.coinbaseInfo,
  };
}

export default connect(mapStateToProps)(AccountsMenuView);
