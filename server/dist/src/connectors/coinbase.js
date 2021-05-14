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
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post("/request", (req, res) => {
    const clientId = process.env.coinbase_id;
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
        client_id: process.env.coinbase_id,
        client_secret: process.env.coinbase_secret,
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
exports.default = router;
//# sourceMappingURL=coinbase.js.map