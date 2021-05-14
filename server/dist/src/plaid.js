"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const express_1 = __importDefault(require("express"));
const plaid_1 = __importDefault(require("plaid"));
const router = express_1.default.Router();
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';
// PLAID_PRODUCTS is a comma-separated list of products to use when initializing
// Link. Note that this list must contain 'assets' in order for the app to be
// able to create and retrieve asset reports.
const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || 'transactions').split(',');
// PLAID_COUNTRY_CODES is a comma-separated list of countries for which users
// will be able to select institutions from.
const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || 'US').split(',');
exports.client = new plaid_1.default.Client({
    clientID: "602b5ca1f8afb000116b8113",
    secret: "e2dd1050bd687d812c95d94c637f8e",
    env: plaid_1.default.environments[PLAID_ENV],
    options: {}
});
// Set PLAID_REDIRECT_URI to 'http://localhost:3000'
// The OAuth redirect flow requires an endpoint on the developer's website
// that the bank website should redirect to. You will need to configure
// this redirect URI for your client ID through the Plaid developer dashboard
// at https://dashboard.plaid.com/team/api.
const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || 'http://localhost:6020';
// Create a link token with configs which we can then use to initialize Plaid Link client-side.
// See https://plaid.com/docs/#create-link-token
router.post('/create_link_token', function (request, response, next) {
    const configs = {
        user: {
            // This should correspond to a unique id for the current user.
            client_user_id: 'user-id',
        },
        client_name: 'Henry\'s Portfolio',
        products: PLAID_PRODUCTS,
        country_codes: PLAID_COUNTRY_CODES,
        language: 'en',
        redirect_uri: "",
    };
    if (PLAID_REDIRECT_URI !== '') {
        configs.redirect_uri = PLAID_REDIRECT_URI;
    }
    exports.client.createLinkToken(configs, function (error, createTokenResponse) {
        if (error != null) {
            console.log(error);
            return response.json({
                error: error,
            });
        }
        response.json(createTokenResponse);
    });
});
// Exchange token flow - exchange a Link public_token for
// an API access_token
// https://plaid.com/docs/#exchange-token-flow
router.post('/set_access_token', function (request, response, next) {
    let PUBLIC_TOKEN = request.body.public_token;
    exports.client.exchangePublicToken(PUBLIC_TOKEN, function (error, tokenResponse) {
        if (error != null) {
            console.log(error);
            return response.json({
                error,
            });
        }
        let ACCESS_TOKEN = tokenResponse.access_token;
        let ITEM_ID = tokenResponse.item_id;
        console.log(tokenResponse);
        response.json({
            access_token: ACCESS_TOKEN,
            item_id: ITEM_ID,
            error: null,
        });
    });
});
// Retrieve an Item's accounts
// https://plaid.com/docs/#accounts
router.post('/process', function (request, response) {
    request.body.access_tokens.forEach((token) => {
        exports.client.getAccounts(token, function (error, accountsResponse) {
            if (error != null) {
                console.log(error);
                return response.json({
                    error,
                });
            }
            console.log(accountsResponse);
        });
    });
    response.json();
});
exports.default = router;
//# sourceMappingURL=plaid.js.map