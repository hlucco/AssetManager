import { PortfolioAccount } from "../models/portfolioAccount";
import { client } from "./connectors/plaid";
import { lookupAccessToken, refreshCoinbaseToken } from "./utils";
import axios, { AxiosRequestConfig } from "axios";
import { AccessToken } from "../models/accessToken";
import { etherToUSD, bitcoinToUSD } from "./connectors/coinbase";

// export async function processAssetClass(assetClass: AssetClass): Promise<AssetClass> {
//     let totalValue: number = 0;
//     for (let i = 0; i < assetClass.accounts.length; i++) {
//         const currentTotal = await processAccount(assetClass.accounts[i]);
//         totalValue += currentTotal;
//     }

//     const processedClass: AssetClass = {
//         ...assetClass,
//         totalValue: totalValue
//     }

//     return processedClass;
// }

export async function processAccount(
  account: PortfolioAccount
): Promise<PortfolioAccount> {
  let totalValue = 0;

  if (account.type === "plaid") {
    let tokenObject = await lookupAccessToken(account.id);
    let i = await client.getAccounts(tokenObject.accessToken);
    i.accounts.forEach((j: any) => {
      if (account.asset_class === "Credit") {
        totalValue -= j.balances.current;
      } else {
        totalValue += j.balances.current;
      }
    });
    account = {
      ...account,
      accountDetails: i,
      totalBalance: totalValue,
    };
  } else {
    let oldTokenObject: AccessToken = await lookupAccessToken(account.id);
    let newTokenObject: AccessToken = await refreshCoinbaseToken(
      oldTokenObject
    );
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${newTokenObject.accessToken}`,
      },
    };
    let response = await axios.get(
      `https://api.coinbase.com/v2/accounts`,
      config
    );
    let accountDetails = response.data;

    let bitCoinValue = await bitcoinToUSD();
    let etherValue = await etherToUSD();

    accountDetails.data.forEach((j: any) => {
      if (j.currency.code === "BTC") {
        totalValue += j.balance.amount * bitCoinValue;
      } else if (j.currency.code === "ETH") {
        totalValue += j.balance.amount * etherValue;
      }
    });
    account = {
      ...account,
      accountDetails: accountDetails,
      totalBalance: totalValue,
    };
  }

  return account;
}

//NEXT STEPS:

//worker process which updates account data every hour calling the plaid apis
//this way when you log in it doesnt take ages to refresh. This worker process will
//update the json file which is holding the state

//figure out how to add special reducer cases in redux to get loading icon to spin

//total money amount formatter to add comas where they need to be

//get mongo to actually save

//line graph display which shows portfolio value every update so history can be seen
