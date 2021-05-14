"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const port = 6023;
const app = express_1.default();
app.get('/assets', (req, res) => {
    //lookup db for all asset classes
    //return asset classes array
    const data = [{ name: "Equity", id: uuid_1.v4(), accounts: [] }, { name: "Cash", id: uuid_1.v4(), accounts: [] }];
    res.json(data);
});
app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});
//next:
// - connect db docker container
// - plaid configuration and setup
//# sourceMappingURL=index.js.map