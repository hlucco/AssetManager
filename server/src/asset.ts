import express from "express";
import MongoClient from 'mongodb';
import { AssetClass } from '../models/assetClass';
// import { processAssetClass } from "./process";

const router = express.Router();

const url = process.env.MONGO_URL;
const dbName = 'PortfolioManagerDB';

//Get all asset classes for a given account
router.get('/', (req, res) => {
    MongoClient.connect(url, (error: Error, client: MongoClient.MongoClient) => {
        if (error === null) {
            const db: MongoClient.Db  = client.db(dbName); 
            const collectionAssetClasses = db.collection('assetClasses');
            collectionAssetClasses.find({}).toArray(async (err: Error, data:[]) => {
                res.json(data);
            }); 
        }
        else {
            console.log(error);
        }
        client.close();
    })
})

router.post('/', (req, res) => {
    MongoClient.connect(url, async (error: Error, client: MongoClient.MongoClient) => {
        console.log("connected to mongo client");
        if (error === null) {
            const db: MongoClient.Db  = client.db(dbName); 
            const collectionAssetClasses = db.collection('assetClasses');
            const newClass: AssetClass = req.body;

            let existing = await collectionAssetClasses.findOne({name: newClass.name});

            if (existing !== null) {
                //already exists
                res.status(400).send('Already exists')
            } 
            else {
                //make a new one
                await collectionAssetClasses.insertOne(newClass);

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

router.delete('/:assetId', (req, res) => {
    MongoClient.connect(url, async (error: Error, client: MongoClient.MongoClient) => {
        if (error === null) {
            const db: MongoClient.Db  = client.db(dbName); 
            const collectionAssetClasses = db.collection('assetClasses');
            const assetId = req.params.assetId;

            let existing = await collectionAssetClasses.findOne({id: assetId});

            if (existing === null) {
                //already exists
                res.status(404).send('Class does not exist')
            } 
            else {
                //delete
                await collectionAssetClasses.deleteOne({id: assetId});

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


export default router