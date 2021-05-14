import express from 'express';
import bodyParser from 'body-parser';
import plaidRouter from "./connectors/plaid";
import assetRouter from "./asset";
import accountRouter from "./account";
import coinbaseRouter from "./connectors/coinbase";

const port = 6023;
const app = express();

app.use(bodyParser.json());

//Controllers
app.use('/plaid', plaidRouter);
app.use('/assets', assetRouter);
app.use('/account', accountRouter);
app.use('/coinbase', coinbaseRouter);

app.listen(port, () => {
    console.log(`Server listening at port ${port}`)
})

//next:
// - plaid configuration and setup