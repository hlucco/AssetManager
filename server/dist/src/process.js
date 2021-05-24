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
exports.processAccount = void 0;
const plaid_1 = require("./connectors/plaid");
const utils_1 = require("./utils");
const axios_1 = __importDefault(require("axios"));
const coinbase_1 = require("./connectors/coinbase");
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
function processAccount(account) {
    return __awaiter(this, void 0, void 0, function* () {
        let totalValue = 0;
        if (account.type === "plaid") {
            let tokenObject = yield utils_1.lookupAccessToken(account.id);
            let i = yield plaid_1.client.getAccounts(tokenObject.accessToken);
            i.accounts.forEach((j) => {
                if (account.asset_class === "Credit") {
                    totalValue -= j.balances.current;
                }
                else {
                    totalValue += j.balances.current;
                }
            });
            account = Object.assign(Object.assign({}, account), { accountDetails: i, totalBalance: totalValue });
        }
        else {
            let oldTokenObject = yield utils_1.lookupAccessToken(account.id);
            let newTokenObject = yield utils_1.refreshCoinbaseToken(oldTokenObject);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${newTokenObject.accessToken}`,
                },
            };
            let response = yield axios_1.default.get(`https://api.coinbase.com/v2/accounts`, config);
            let accountDetails = response.data;
            let bitCoinValue = yield coinbase_1.bitcoinToUSD();
            let etherValue = yield coinbase_1.etherToUSD();
            accountDetails.data.forEach((j) => {
                if (j.currency.code === "BTC") {
                    totalValue += j.balance.amount * bitCoinValue;
                }
                else if (j.currency.code === "ETH") {
                    totalValue += j.balance.amount * etherValue;
                }
            });
            account = Object.assign(Object.assign({}, account), { accountDetails: accountDetails, totalBalance: totalValue });
        }
        return account;
    });
}
exports.processAccount = processAccount;
//NEXT STEPS:
//worker process which updates account data every hour calling the plaid apis
//this way when you log in it doesnt take ages to refresh. This worker process will
//update the json file which is holding the state
//figure out how to add special reducer cases in redux to get loading icon to spin
//total money amount formatter to add comas where they need to be
//get mongo to actually save
//line graph display which shows portfolio value every update so history can be seen
//# sourceMappingURL=process.js.map