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
            let tokenObject = yield (0, utils_1.lookupAccessToken)(account.id);
            let i = yield plaid_1.client.getAccounts(tokenObject.accessToken);
            i.accounts.forEach((j) => {
                if (account.asset_class === "Credit") {
                    totalValue -= j.balances.current;
                }
                else {
                    totalValue += j.balances.current;
                }
            });
            let newBalanceHistory = account.balanceHistory;
            newBalanceHistory.push({ date: new Date(Date.now()), total: totalValue });
            account = Object.assign(Object.assign({}, account), { accountDetails: i, totalBalance: totalValue, balanceHistory: newBalanceHistory });
        }
        else {
            let oldTokenObject = yield (0, utils_1.lookupAccessToken)(account.id);
            let newTokenObject = yield (0, utils_1.refreshCoinbaseToken)(oldTokenObject);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${newTokenObject.accessToken}`,
                },
            };
            let response = yield axios_1.default.get(`https://api.coinbase.com/v2/accounts`, config);
            let accountDetails = response.data;
            let bitCoinValue = yield (0, coinbase_1.bitcoinToUSD)();
            let etherValue = yield (0, coinbase_1.etherToUSD)();
            accountDetails.data.forEach((j) => {
                if (j.currency.code === "BTC") {
                    totalValue += j.balance.amount * bitCoinValue;
                }
                else if (j.currency.code === "ETH") {
                    totalValue += j.balance.amount * etherValue;
                }
                else if (j.currency.code === "USDC") {
                    totalValue += j.balance.amount * 1;
                }
            });
            let newBalanceHistory = account.balanceHistory;
            newBalanceHistory.push({ date: new Date(Date.now()), total: totalValue });
            account = Object.assign(Object.assign({}, account), { accountDetails: accountDetails, totalBalance: totalValue, balanceHistory: newBalanceHistory });
        }
        return account;
    });
}
exports.processAccount = processAccount;
//# sourceMappingURL=process.js.map