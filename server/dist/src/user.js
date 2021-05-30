"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { processAssetClass } from "./process";
const router = express_1.default.Router();
const url = process.env.MONGO_URL;
const dbName = "PortfolioManagerDB";
exports.default = router;
//# sourceMappingURL=user.js.map