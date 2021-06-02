import express from "express";
import bodyParser from "body-parser";
import plaidRouter from "./connectors/plaid";
import assetRouter from "./asset";
import accountRouter from "./account";
import coinbaseRouter from "./connectors/coinbase";
import userRouter from "./user";
import { initTracker } from "./tracker";
import totalRouter from "./total";

const port = 6023;
const app = express();

app.use(bodyParser.json());

initTracker();

//Controllers
app.use("/plaid", plaidRouter);
app.use("/assets", assetRouter);
app.use("/account", accountRouter);
app.use("/coinbase", coinbaseRouter);
app.use("/user", userRouter);
app.use("/total", totalRouter);

app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
