import express from "express";
import { AssetClass } from "../models/assetClass";
import MongoClient from 'mongodb';
import { PortfolioAccount } from "../models/portfolioAccount";
import { processAccount } from "./process";
import { saveAccessToken } from "./utils";

const url = process.env.MONGO_URL;
const dbName = 'PortfolioManagerDB';

const router = express.Router();

router.post("/create", async (req, res) => {
    let newAccount: PortfolioAccount = {
        name: req.body.name,
        type: req.body.type,
        asset_class: req.body.asset_class,
        accountDetails: {},
        totalBalance: 0,
        id: req.body.id
    }

    await saveAccessToken(newAccount.id, req.body.access_token, req.body.refresh_token);
    newAccount = await processAccount(newAccount);

    MongoClient.connect(url, async (error: Error, client: MongoClient.MongoClient) => {
        if (error === null) {
            const db: MongoClient.Db  = client.db(dbName); 
            const collectionAssetClasses = db.collection('assetClasses');

            let existing: AssetClass = await collectionAssetClasses.findOne({name: newAccount.asset_class});

            if (existing === null) {
                //asset class does not exist already exists
                res.status(400).send('Class does not exist')
            } 
            else {
                const newAccounts = existing.accounts;
                newAccounts.push(newAccount);
                await collectionAssetClasses.updateOne({name: newAccount.asset_class}, {$set: {accounts: newAccounts, totalValue: existing.totalValue + newAccount.totalBalance}});

                await collectionAssetClasses.find({}).toArray((err: Error, data:[]) => {
                    res.json(data);
                });
            }
        }
        else {
            console.log(error);
        }
        client.close();
    })
});

router.get("/update/:accountId/:assetId", async (req, res) => {
    MongoClient.connect(url, async (error: Error, client: MongoClient.MongoClient) => {
        if (error === null) {
            const db: MongoClient.Db  = client.db(dbName); 
            const collectionAssetClasses = db.collection('assetClasses');

            let existing: AssetClass = await collectionAssetClasses.findOne({id: req.params.assetId });

            if (existing === null) {
                //asset class does not exist already exists
                res.status(400).send('Class does not exist')
            } 
            else {
                let newAccounts = existing.accounts;
                let updatedAccount = existing.accounts.find(account => account.id === req.params.accountId);
                let index = newAccounts.indexOf(updatedAccount);
                let newTotalValue = existing.totalValue - updatedAccount.totalBalance;
                updatedAccount = await processAccount(updatedAccount);
                newAccounts[index] = updatedAccount;
                await collectionAssetClasses.updateOne({id: req.params.assetId}, {$set: {accounts: newAccounts, totalValue: newTotalValue + updatedAccount.totalBalance}});

                await collectionAssetClasses.find({}).toArray((err: Error, data:[]) => {
                    res.json(data);
                });
            }
        }
        else {
            console.log(error);
        }
        client.close();
    })  
})

router.delete("/:accountId/:assetId", (req, res) => {
    MongoClient.connect(url, async (error: Error, client: MongoClient.MongoClient) => {
        if (error === null) {
            const db: MongoClient.Db  = client.db(dbName); 
            const collectionAssetClasses = db.collection('assetClasses');
            const assetId = req.params.assetId;

            let existing: AssetClass = await collectionAssetClasses.findOne({id: assetId});

            if (existing === null) {
                //already exists
                res.status(404).send('Class does not exist')
            } 
            else {
                //delete

                let accountToDelete: PortfolioAccount = existing.accounts.find(i => i.id === req.params.accountId);
                let updatedAccounts: PortfolioAccount[] = existing.accounts.filter(i => i.id !== req.params.accountId);
                const newValue = existing.totalValue - accountToDelete.totalBalance;

                await collectionAssetClasses.updateOne({id: assetId}, {$set: {accounts: updatedAccounts, totalValue: newValue}});

                await collectionAssetClasses.find({}).toArray((err: Error, data:[]) => {
                    res.json(data);
                });
            }
        }
        else {
            console.log(error);
            res.status(404).send('Account not found')
        }
        client.close();
    })
});

export default router;