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
// import { processAssetClass } from "./process";
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const keys_1 = __importDefault(require("../keys"));
const router = express_1.default.Router();
const url = process.env.MONGO_URL;
const dbName = "PortfolioManagerDB";
router.post("/register", (req, res) => {
    mongodb_1.default.connect(url, (error, client) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("connected to mongo client");
        if (error === null) {
            const db = client.db(dbName);
            const collectionUsers = db.collection("users");
            let existing = yield collectionUsers.findOne({
                username: req.body.username,
            });
            if (existing !== null) {
                res.status(400).send("User already exists");
            }
            const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 10);
            const newUser = {
                username: req.body.username,
                password: hashedPassword,
                id: uuid_1.v4(),
                assets: [],
                sync: false,
            };
            yield collectionUsers.insertOne(newUser);
            res.send({ status: "success" });
        }
        else {
            console.log(error);
            res.sendStatus(500);
        }
        client.close();
    }));
});
router.post("/login", (req, res) => {
    mongodb_1.default.connect(url, (error, client) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("connected to mongo client");
        if (error === null) {
            const db = client.db(dbName);
            const collectionUsers = db.collection("users");
            let existing = yield collectionUsers.findOne({
                username: req.body.username,
            });
            console.log(existing);
            console.log(req.body.password);
            console.log(yield collectionUsers.find({}).toArray());
            if (existing !== null) {
                const isPasswordMatching = yield bcrypt_1.default.compare(req.body.password, existing.password);
                if (isPasswordMatching) {
                    const jwttoken = jsonwebtoken_1.default.sign(existing, keys_1.default.jwt_secret_key);
                    res.status(200).send({ token: jwttoken });
                }
            }
            res.status(400).send("Incorrect username or password");
        }
        else {
            console.log(error);
            res.sendStatus(500);
        }
        client.close();
    }));
});
router.get("/", (req, res) => {
    const jwttoken = req.headers.authorization;
    if (jwttoken === "null") {
        res.sendStatus(401);
    }
    let token;
    try {
        token = jsonwebtoken_1.default.verify(jwttoken, keys_1.default.jwt_secret_key);
        mongodb_1.default.connect(url, (error, client) => __awaiter(void 0, void 0, void 0, function* () {
            if (error === null) {
                const db = client.db(dbName);
                const collectionUsers = db.collection("users");
                let userData = yield collectionUsers.findOne({ id: token.id });
                res.json(userData);
            }
            else {
                console.log(error);
                res.sendStatus(500);
            }
            client.close();
        }));
    }
    catch (_a) {
        res.sendStatus(401);
    }
});
router.put("/sync", (req, res) => {
    const jwttoken = req.headers.authorization;
    if (jwttoken === "null") {
        res.sendStatus(401);
    }
    let token;
    try {
        token = jsonwebtoken_1.default.verify(jwttoken, keys_1.default.jwt_secret_key);
        mongodb_1.default.connect(url, (error, client) => __awaiter(void 0, void 0, void 0, function* () {
            if (error === null) {
                const db = client.db(dbName);
                const collectionUsers = db.collection("users");
                let userData = yield collectionUsers.findOne({
                    id: token.id,
                });
                let updated = Object.assign(Object.assign({}, userData), { sync: !userData.sync });
                yield collectionUsers.updateOne({ id: updated.id }, {
                    $set: updated,
                });
                res.json(updated);
            }
            else {
                console.log(error);
                res.sendStatus(500);
            }
            client.close();
        }));
    }
    catch (_a) {
        res.sendStatus(401);
    }
});
exports.default = router;
//# sourceMappingURL=user.js.map