import axios, { AxiosResponse } from "axios";
import keys from "../keys";
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
    client_id: keys.coinbase_client_id,
    client_secret: keys.coinbase_client_secret,
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
