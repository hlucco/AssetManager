import express from "express";
import MongoClient from "mongodb";

const router = express.Router();

const url = process.env.MONGO_URL;
const dbName = "PortfolioManagerDB";

router.get("/", (req, res) => {
  MongoClient.connect(url, (error: Error, client: MongoClient.MongoClient) => {
    if (error === null) {
      const db: MongoClient.Db = client.db(dbName);
      const collectionTotalValue = db.collection("totalValue");
      collectionTotalValue.find({}).toArray(async (err: Error, data: []) => {
        res.json(data);
      });
    } else {
      console.log(error);
    }
    client.close();
  });
});

export default router;
