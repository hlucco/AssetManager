import axios, { AxiosResponse } from "axios";
import express from "express";
import keys from "../../keys";

const router = express.Router();

router.post("/request", (req, res) => {
  const clientId = keys.coinbase_client_id;
  const name = req.body.name;
  const assetClass = req.body.class;
  const redirectUri = encodeURIComponent(
    `http://localhost:6020/?name=${name}&asset_class=${assetClass}`
  );
  let url = `https://www.coinbase.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=SECURE_RANDOM&scope=wallet:accounts:read`;
  res.send(url);
});

router.post("/exchange", async (req, res) => {
  const name = req.body.name;
  const assetClass = req.body.class;
  const coinbaseBody = {
    grant_type: "authorization_code",
    code: req.body.code,
    client_id: keys.coinbase_client_id,
    client_secret: keys.coinbase_client_secret,
    redirect_uri: `http://localhost:6020/?name=${name}&asset_class=${assetClass}`,
  };

  const url = "https://api.coinbase.com/oauth/token";

  let response = await axios.post(url, coinbaseBody).catch((error: Error) => {
    console.log("ERROR");
    console.log(error);
  });

  response = response as AxiosResponse;

  res.send(response.data);
});

export async function etherToUSD() {
  const response = await axios.get(
    "https://api.coinbase.com/v2/exchange-rates?currency=ETH"
  );
  return response.data.data.rates.USD;
}

export async function bitcoinToUSD() {
  const response = await axios.get(
    "https://api.coinbase.com/v2/exchange-rates?currency=BTC"
  );
  return response.data.data.rates.USD;
}

export default router;
