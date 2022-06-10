import express from "express";
import MongoClient from "mongodb";
import { PortfolioUser } from "../models/portfolioUser";
// import { processAssetClass } from "./process";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import keys from "../keys";

const router = express.Router();

const url = process.env.MONGO_URL;
const dbName = "PortfolioManagerDB";

router.post("/register", (req, res) => {
  MongoClient.connect(
    url,
    async (error: Error, client: MongoClient.MongoClient) => {
      console.log("connected to mongo client");
      if (error === null) {
        const db: MongoClient.Db = client.db(dbName);
        const collectionUsers = db.collection("users");

        let existing = await collectionUsers.findOne({
          username: req.body.username,
        });

        if (existing !== null) {
          res.status(400).send("User already exists");
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser: PortfolioUser = {
          username: req.body.username,
          password: hashedPassword,
          id: uuidv4(),
          assets: [],
          sync: false,
        };

        await collectionUsers.insertOne(newUser);

        res.send({ status: "success" });
      } else {
        console.log(error);
        res.sendStatus(500);
      }
      client.close();
    }
  );
});

router.post("/login", (req, res) => {
  MongoClient.connect(
    url,
    async (error: Error, client: MongoClient.MongoClient) => {
      console.log("connected to mongo client");
      if (error === null) {
        const db: MongoClient.Db = client.db(dbName);
        const collectionUsers = db.collection("users");

        let existing = await collectionUsers.findOne({
          username: req.body.username,
        });

        console.log(existing);
        console.log(req.body.password);
        console.log(await collectionUsers.find({}).toArray());

        if (existing !== null) {
          const isPasswordMatching = await bcrypt.compare(
            req.body.password,
            existing.password
          );

          if (isPasswordMatching) {
            const jwttoken = jwt.sign(existing, keys.jwt_secret_key);
            res.status(200).send({ token: jwttoken });
          }
        }
        res.status(400).send("Incorrect username or password");
      } else {
        console.log(error);
        res.sendStatus(500);
      }
      client.close();
    }
  );
});

router.get("/", (req, res) => {
  const jwttoken = req.headers.authorization;
  if (jwttoken === "null") {
    res.sendStatus(401);
  }
  let token: any;
  try {
    token = jwt.verify(jwttoken, keys.jwt_secret_key);
    MongoClient.connect(
      url,
      async (error: Error, client: MongoClient.MongoClient) => {
        if (error === null) {
          const db: MongoClient.Db = client.db(dbName);
          const collectionUsers = db.collection("users");

          let userData = await collectionUsers.findOne({ id: token.id });
          res.json(userData);
        } else {
          console.log(error);
          res.sendStatus(500);
        }
        client.close();
      }
    );
  } catch {
    res.sendStatus(401);
  }
});

router.put("/sync", (req, res) => {
  const jwttoken = req.headers.authorization;
  if (jwttoken === "null") {
    res.sendStatus(401);
  }
  let token: any;
  try {
    token = jwt.verify(jwttoken, keys.jwt_secret_key);
    MongoClient.connect(
      url,
      async (error: Error, client: MongoClient.MongoClient) => {
        if (error === null) {
          const db: MongoClient.Db = client.db(dbName);
          const collectionUsers = db.collection("users");

          let userData: PortfolioUser = await collectionUsers.findOne({
            id: token.id,
          });

          let updated = {
            ...userData,
            sync: !userData.sync,
          };

          await collectionUsers.updateOne(
            { id: updated.id },
            {
              $set: updated,
            }
          );

          res.json(updated);
        } else {
          console.log(error);
          res.sendStatus(500);
        }
        client.close();
      }
    );
  } catch {
    res.sendStatus(401);
  }
});

export default router;
