import express from "express";
import MongoClient from "mongodb";
import { AssetClass } from "../models/assetClass";
// import { processAssetClass } from "./process";

const router = express.Router();

const url = process.env.MONGO_URL;
const dbName = "PortfolioManagerDB";

export default router;
