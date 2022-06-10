"use strict";
// Once a day:
// - refresh all asset classes which have a user for whome sync is turned on
// - for each asset class store { day: date, totalValue: total }
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
exports.initTracker = exports.getSyncUsers = exports.refreshAllAccounts = void 0;
const mongodb_1 = __importDefault(require("mongodb"));
const process_1 = require("./process");
const url = process.env.MONGO_URL;
const dbName = "PortfolioManagerDB";
function refreshAllAccounts() {
    mongodb_1.default.connect(url, (error, client) => __awaiter(this, void 0, void 0, function* () {
        if (error === null) {
            const db = client.db(dbName);
            const collectionAssetClasses = db.collection("assetClasses");
            const collectionTotalValue = db.collection("totalValue");
            let assetClasses = yield collectionAssetClasses.find({}).toArray();
            let currentTotalValue = 0;
            for (let i = 0; i < assetClasses.length; i++) {
                let total = 0;
                let newAccounts = assetClasses[i].accounts;
                let balanceHistory = assetClasses[i].balanceHistory;
                for (let j = 0; j < newAccounts.length; j++) {
                    let updatedAccount = yield (0, process_1.processAccount)(newAccounts[j]);
                    total += updatedAccount.totalBalance;
                    console.log("total updated");
                    console.log(updatedAccount.totalBalance);
                    newAccounts[j] = updatedAccount;
                }
                balanceHistory.push({ date: Date.now(), total: total });
                yield collectionAssetClasses.updateOne({ id: assetClasses[i].id }, {
                    $set: {
                        accounts: newAccounts,
                        totalValue: total,
                        balanceHistory: balanceHistory,
                    },
                });
                currentTotalValue += total;
            }
            yield collectionTotalValue.insertOne({
                total: currentTotalValue,
                date: Date.now(),
            });
            console.log(currentTotalValue);
            yield collectionTotalValue
                .find({})
                .toArray((err, data) => __awaiter(this, void 0, void 0, function* () {
                console.log(data);
            }));
        }
        else {
            console.log(error);
        }
        client.close();
    }));
}
exports.refreshAllAccounts = refreshAllAccounts;
function getSyncUsers() {
    mongodb_1.default.connect(url, (error, client) => __awaiter(this, void 0, void 0, function* () {
        if (error === null) {
            let idList = [];
            const db = client.db(dbName);
            const collectionUsers = yield db.collection("users").find({}).toArray();
            const syncUsers = collectionUsers.filter((user) => {
                user.sync === true;
            });
            syncUsers.map((user) => {
                idList.push(user.id);
            });
            return idList;
        }
        else {
            console.log(error);
        }
        client.close();
    }));
}
exports.getSyncUsers = getSyncUsers;
function initTracker() {
    var now = new Date();
    var night = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, // the next day, ...
    0, 0, 0 // ...at 00:00:00 hours
    );
    var msToMidnight = night.getTime() - now.getTime();
    setTimeout(function () {
        refreshAllAccounts(); //      <-- This is the function being called at midnight.
        initTracker(); //      Then, reset again next midnight.
    }, msToMidnight);
}
exports.initTracker = initTracker;
//# sourceMappingURL=tracker.js.map