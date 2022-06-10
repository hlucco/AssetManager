"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const plaid_1 = __importDefault(require("./connectors/plaid"));
const asset_1 = __importDefault(require("./asset"));
const account_1 = __importDefault(require("./account"));
const coinbase_1 = __importDefault(require("./connectors/coinbase"));
const user_1 = __importDefault(require("./user"));
const tracker_1 = require("./tracker");
const total_1 = __importDefault(require("./total"));
const port = 6023;
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
(0, tracker_1.initTracker)();
//Controllers
app.use("/plaid", plaid_1.default);
app.use("/assets", asset_1.default);
app.use("/account", account_1.default);
app.use("/coinbase", coinbase_1.default);
app.use("/user", user_1.default);
app.use("/total", total_1.default);
app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});
//# sourceMappingURL=index.js.map