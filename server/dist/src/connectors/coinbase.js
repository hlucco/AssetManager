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
exports.bitcoinToUSD = exports.etherToUSD = void 0;
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const keys_1 = __importDefault(require("../../keys"));
const router = express_1.default.Router();
router.post("/request", (req, res) => {
    const clientId = "6211ec47d1b3f707173971fcc5a3616693f0293cbdcad76f78ddd68d64cfa11f";
    const name = req.body.name;
    const assetClass = req.body.class;
    const redirectUri = encodeURIComponent(`http://localhost:6020/?name=${name}&asset_class=${assetClass}`);
    let url = `https://www.coinbase.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=SECURE_RANDOM&scope=wallet:accounts:read`;
    res.send(url);
});
router.post("/exchange", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    const assetClass = req.body.class;
    const coinbaseBody = {
        grant_type: "authorization_code",
        code: req.body.code,
        client_id: keys_1.default.coinbase_client_id,
        client_secret: keys_1.default.coinbase_client_secret,
        redirect_uri: `http://localhost:6020/?name=${name}&asset_class=${assetClass}`,
    };
    const url = "https://api.coinbase.com/oauth/token";
    let response = yield axios_1.default.post(url, coinbaseBody).catch((error) => {
        console.log("ERROR");
        console.log(error);
    });
    response = response;
    res.send(response.data);
}));
function etherToUSD() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get("https://api.coinbase.com/v2/exchange-rates?currency=ETH");
        return response.data.data.rates.USD;
    });
}
exports.etherToUSD = etherToUSD;
function bitcoinToUSD() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get("https://api.coinbase.com/v2/exchange-rates?currency=BTC");
        return response.data.data.rates.USD;
    });
}
exports.bitcoinToUSD = bitcoinToUSD;
exports.default = router;
//# sourceMappingURL=coinbase.js.map