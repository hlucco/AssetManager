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
const router = express_1.default.Router();
const url = process.env.MONGO_URL;
const dbName = "PortfolioManagerDB";
router.get("/", (req, res) => {
    mongodb_1.default.connect(url, (error, client) => {
        if (error === null) {
            const db = client.db(dbName);
            const collectionTotalValue = db.collection("totalValue");
            collectionTotalValue.find({}).toArray((err, data) => __awaiter(void 0, void 0, void 0, function* () {
                res.json(data);
            }));
        }
        else {
            console.log(error);
        }
        client.close();
    });
});
exports.default = router;
//# sourceMappingURL=total.js.map