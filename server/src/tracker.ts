// Once a day:
// - refresh all asset classes which have a user for whome sync is turned on
// - for each asset class store { day: date, totalValue: total }

import { PortfolioUser } from "../models/portfolioUser";
import MongoClient from "mongodb";
import { processAccount } from "./process";

const url = process.env.MONGO_URL;
const dbName = "PortfolioManagerDB";

export function refreshAllAccounts() {
  MongoClient.connect(
    url,
    async (error: Error, client: MongoClient.MongoClient) => {
      if (error === null) {
        const db: MongoClient.Db = client.db(dbName);
        const collectionAssetClasses = db.collection("assetClasses");
        const collectionTotalValue = db.collection("totalValue");
        let assetClasses = await collectionAssetClasses.find({}).toArray();
        let currentTotalValue = 0;

        for (let i = 0; i < assetClasses.length; i++) {
          let total = 0;
          let newAccounts = assetClasses[i].accounts;
          let balanceHistory = assetClasses[i].balanceHistory;

          for (let j = 0; j < newAccounts.length; j++) {
            let updatedAccount = await processAccount(newAccounts[j]);
            total += updatedAccount.totalBalance;
            console.log("total updated");
            console.log(updatedAccount.totalBalance);
            newAccounts[j] = updatedAccount;
          }

          balanceHistory.push({ date: Date.now(), total: total });

          await collectionAssetClasses.updateOne(
            { id: assetClasses[i].id },
            {
              $set: {
                accounts: newAccounts,
                totalValue: total,
                balanceHistory: balanceHistory,
              },
            }
          );

          currentTotalValue += total;
        }

        await collectionTotalValue.insertOne({
          total: currentTotalValue,
          date: Date.now(),
        });

        console.log(currentTotalValue);

        await collectionTotalValue
          .find({})
          .toArray(async (err: Error, data: []) => {
            console.log(data);
          });
      } else {
        console.log(error);
      }
      client.close();
    }
  );
}

export function getSyncUsers() {
  MongoClient.connect(
    url,
    async (error: Error, client: MongoClient.MongoClient) => {
      if (error === null) {
        let idList: string[] = [];
        const db: MongoClient.Db = client.db(dbName);
        const collectionUsers = await db.collection("users").find({}).toArray();
        const syncUsers = collectionUsers.filter((user: PortfolioUser) => {
          user.sync === true;
        });
        syncUsers.map((user: PortfolioUser) => {
          idList.push(user.id);
        });
        return idList;
      } else {
        console.log(error);
      }
      client.close();
    }
  );
}

export function initTracker() {
  var now = new Date();
  var night = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1, // the next day, ...
    0,
    0,
    0 // ...at 00:00:00 hours
  );
  var msToMidnight = night.getTime() - now.getTime();

  setTimeout(function () {
    refreshAllAccounts(); //      <-- This is the function being called at midnight.
    initTracker(); //      Then, reset again next midnight.
  }, msToMidnight);
}
