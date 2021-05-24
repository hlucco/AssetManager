import axios, { AxiosResponse } from "axios";
import MongoClient from "mongodb";
import { AccessToken } from "../models/accessToken";

const dbName = "PortfolioManagerDB";

export async function lookupAccessToken(
  accountId: string
): Promise<AccessToken> {
  const client = await MongoClient.connect(process.env.MONGO_URL);
  const db: MongoClient.Db = client.db(dbName);
  const collectionAccessTokens = db.collection("accessTokens");

  let accessToken: AccessToken = await collectionAccessTokens.findOne({
    id: accountId,
  });

  client.close();
  return accessToken;
}

export async function saveAccessToken(
  accountId: string,
  token: string,
  refresh: string
): Promise<boolean> {
  const client = await MongoClient.connect(process.env.MONGO_URL);

  const db: MongoClient.Db = client.db(dbName);
  const collectionAccessTokens = db.collection("accessTokens");

  await collectionAccessTokens.insertOne({
    id: accountId,
    accessToken: token,
    refreshToken: refresh,
  });

  client.close();
  return true;
}

export async function refreshCoinbaseToken(
  tokenObject: AccessToken
): Promise<AccessToken> {
  let body = {
    grant_type: "refresh_token",
    client_id:
      "6211ec47d1b3f707173971fcc5a3616693f0293cbdcad76f78ddd68d64cfa11f",
    client_secret:
      "972fb3623283329fff01cfae1116bab1764870cc1609f7bea9c4ef08781633ea",
    refresh_token: tokenObject.refreshToken,
  };
  let response = await axios
    .post("https://api.coinbase.com/oauth/token", body)
    .catch((error: Error) => {
      console.log(error);
    });

  response = response as undefined as AxiosResponse;

  const result: AccessToken = {
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token,
    id: tokenObject.id,
  };

  const client = await MongoClient.connect(process.env.MONGO_URL);
  const db: MongoClient.Db = client.db(dbName);
  const collectionAccessTokens = db.collection("accessTokens");

  await collectionAccessTokens.updateOne(
    { id: tokenObject.id },
    {
      $set: {
        id: tokenObject.id,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    }
  );

  return result;
}
