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
exports.refreshCoinbaseToken = exports.saveAccessToken = exports.lookupAccessToken = void 0;
const axios_1 = __importDefault(require("axios"));
const keys_1 = __importDefault(require("../keys"));
const mongodb_1 = __importDefault(require("mongodb"));
const dbName = "PortfolioManagerDB";
function lookupAccessToken(accountId) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield mongodb_1.default.connect(process.env.MONGO_URL);
        const db = client.db(dbName);
        const collectionAccessTokens = db.collection("accessTokens");
        let accessToken = yield collectionAccessTokens.findOne({
            id: accountId,
        });
        client.close();
        return accessToken;
    });
}
exports.lookupAccessToken = lookupAccessToken;
function saveAccessToken(accountId, token, refresh) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield mongodb_1.default.connect(process.env.MONGO_URL);
        const db = client.db(dbName);
        const collectionAccessTokens = db.collection("accessTokens");
        yield collectionAccessTokens.insertOne({
            id: accountId,
            accessToken: token,
            refreshToken: refresh,
        });
        client.close();
        return true;
    });
}
exports.saveAccessToken = saveAccessToken;
function refreshCoinbaseToken(tokenObject) {
    return __awaiter(this, void 0, void 0, function* () {
        let body = {
            grant_type: "refresh_token",
            client_id: keys_1.default.coinbase_client_id,
            client_secret: keys_1.default.coinbase_client_secret,
            refresh_token: tokenObject.refreshToken,
        };
        let response = yield axios_1.default
            .post("https://api.coinbase.com/oauth/token", body)
            .catch((error) => {
            console.log(error);
        });
        response = response;
        const result = {
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            id: tokenObject.id,
        };
        const client = yield mongodb_1.default.connect(process.env.MONGO_URL);
        const db = client.db(dbName);
        const collectionAccessTokens = db.collection("accessTokens");
        yield collectionAccessTokens.updateOne({ id: tokenObject.id }, {
            $set: {
                id: tokenObject.id,
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
            },
        });
        return result;
    });
}
exports.refreshCoinbaseToken = refreshCoinbaseToken;
//# sourceMappingURL=utils.js.map