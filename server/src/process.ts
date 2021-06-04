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
    let newBalanceHistory = account.balanceHistory;
    newBalanceHistory.push({ date: new Date(Date.now()), total: totalValue });
    account = {
      ...account,
      accountDetails: i,
      totalBalance: totalValue,
      balanceHistory: newBalanceHistory,
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
    let newBalanceHistory = account.balanceHistory;
    newBalanceHistory.push({ date: new Date(Date.now()), total: totalValue });
    account = {
      ...account,
      accountDetails: accountDetails,
      totalBalance: totalValue,
      balanceHistory: newBalanceHistory,
    };
  }

  return account;
}
