"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_1 = __importDefault(require("mongodb"));
// import { processAssetClass } from "./process";
const router = express_1.default.Router();
const url = process.env.MONGO_URL;
const dbName = 'PortfolioManagerDB';
//Get all asset classes for a given account
router.get('/', (req, res) => {
    mongodb_1.default.connect(url, (error, client) => {
        if (error === null) {
            const db = client.db(dbName);
            const collectionAssetClasses = db.collection('assetClasses');
            collectionAssetClasses.find({}).toArray((err, data) => __awaiter(void 0, void 0, void 0, function* () {
                res.json(data);
            }));
        }
        else {
            console.log(error);
        }
        client.close();
    });
});
router.post('/', (req, res) => {
    mongodb_1.default.connect(url, (error, client) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("connected to mongo client");
        if (error === null) {
            const db = client.db(dbName);
            const collectionAssetClasses = db.collection('assetClasses');
            const newClass = req.body;
            let existing = yield collectionAssetClasses.findOne({ name: newClass.name });
            if (existing !== null) {
                //already exists
                res.status(400).send('Already exists');
            }
            else {
                //make a new one
                yield collectionAssetClasses.insertOne(newClass);
                yield collectionAssetClasses.find({}).toArray((err, data) => {
                    res.json(data);
                });
            }
        }
        else {
            console.log(error);
        }
        client.close();
    }));
});
router.delete('/:assetId', (req, res) => {
    mongodb_1.default.connect(url, (error, client) => __awaiter(void 0, void 0, void 0, function* () {
        if (error === null) {
            const db = client.db(dbName);
            const collectionAssetClasses = db.collection('assetClasses');
            const assetId = req.params.assetId;
            let existing = yield collectionAssetClasses.findOne({ id: assetId });
            if (existing === null) {
                //already exists
                res.status(404).send('Class does not exist');
            }
            else {
                //delete
                yield collectionAssetClasses.deleteOne({ id: assetId });
                yield collectionAssetClasses.find({}).toArray((err, data) => {
                    res.json(data);
                });
            }
        }
        else {
            console.log(error);
        }
        client.close();
    }));
});
exports.default = router;
//# sourceMappingURL=asset.js.map