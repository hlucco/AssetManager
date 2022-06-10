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
const process_1 = require("./process");
const utils_1 = require("./utils");
const tracker_1 = require("./tracker");
const url = process.env.MONGO_URL;
const dbName = "PortfolioManagerDB";
const router = express_1.default.Router();
router.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let newAccount = {
        name: req.body.name,
        type: req.body.type,
        asset_class: req.body.asset_class,
        accountDetails: {},
        totalBalance: 0,
        id: req.body.id,
        balanceHistory: [],
    };
    yield (0, utils_1.saveAccessToken)(newAccount.id, req.body.access_token, req.body.refresh_token);
    newAccount = yield (0, process_1.processAccount)(newAccount);
    mongodb_1.default.connect(url, (error, client) => __awaiter(void 0, void 0, void 0, function* () {
        if (error === null) {
            const db = client.db(dbName);
            const collectionAssetClasses = db.collection("assetClasses");
            let existing = yield collectionAssetClasses.findOne({
                name: newAccount.asset_class,
            });
            if (existing === null) {
                //asset class does not exist already exists
                res.status(400).send("Class does not exist");
            }
            else {
                const newAccounts = existing.accounts;
                newAccounts.push(newAccount);
                yield collectionAssetClasses.updateOne({ name: newAccount.asset_class }, {
                    $set: {
                        accounts: newAccounts,
                        totalValue: existing.totalValue + newAccount.totalBalance,
                    },
                });
                yield collectionAssetClasses
                    .find({})
                    .toArray((err, data) => {
                    res.json(data);
                });
            }
        }
        else {
            console.log(error);
        }
        client.close();
    }));
}));
router.get("/update/:accountId/:assetId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    mongodb_1.default.connect(url, (error, client) => __awaiter(void 0, void 0, void 0, function* () {
        if (error === null) {
            const db = client.db(dbName);
            const collectionAssetClasses = db.collection("assetClasses");
            let existing = yield collectionAssetClasses.findOne({
                id: req.params.assetId,
            });
            if (existing === null) {
                //asset class does not exist already exists
                res.status(400).send("Class does not exist");
            }
            else {
                let newAccounts = existing.accounts;
                let updatedAccount = existing.accounts.find((account) => account.id === req.params.accountId);
                let index = newAccounts.indexOf(updatedAccount);
                let newTotalValue = existing.totalValue - updatedAccount.totalBalance;
                updatedAccount = yield (0, process_1.processAccount)(updatedAccount);
                newAccounts[index] = updatedAccount;
                yield collectionAssetClasses.updateOne({ id: req.params.assetId }, {
                    $set: {
                        accounts: newAccounts,
                        totalValue: newTotalValue + updatedAccount.totalBalance,
                    },
                });
                yield collectionAssetClasses
                    .find({})
                    .toArray((err, data) => {
                    res.json(data);
                });
            }
        }
        else {
            console.log(error);
        }
        client.close();
    }));
}));
router.get("/refresh", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    mongodb_1.default.connect(url, (error, client) => __awaiter(void 0, void 0, void 0, function* () {
        if (error === null) {
            const db = client.db(dbName);
            const collectionAssetClasses = db.collection("assetClasses");
            (0, tracker_1.refreshAllAccounts)();
            yield collectionAssetClasses
                .find({})
                .toArray((err, data) => {
                res.json(data);
            });
        }
        else {
            console.log(error);
        }
        client.close();
    }));
}));
router.delete("/:accountId/:assetId", (req, res) => {
    mongodb_1.default.connect(url, (error, client) => __awaiter(void 0, void 0, void 0, function* () {
        if (error === null) {
            const db = client.db(dbName);
            const collectionAssetClasses = db.collection("assetClasses");
            const assetId = req.params.assetId;
            let existing = yield collectionAssetClasses.findOne({
                id: assetId,
            });
            if (existing === null) {
                //already exists
                res.status(404).send("Class does not exist");
            }
            else {
                //delete
                let accountToDelete = existing.accounts.find((i) => i.id === req.params.accountId);
                let updatedAccounts = existing.accounts.filter((i) => i.id !== req.params.accountId);
                const newValue = existing.totalValue - accountToDelete.totalBalance;
                yield collectionAssetClasses.updateOne({ id: assetId }, { $set: { accounts: updatedAccounts, totalValue: newValue } });
                yield collectionAssetClasses
                    .find({})
                    .toArray((err, data) => {
                    res.json(data);
                });
            }
        }
        else {
            console.log(error);
            res.status(404).send("Account not found");
        }
        client.close();
    }));
});
exports.default = router;
//# sourceMappingURL=account.js.map