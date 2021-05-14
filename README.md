## Usage

This is a basic asset allocation managment application allowing you to create asset classes and then assign accounts to those classes. To get started, create an asset class, then create an account and assign it to that asset class. The graph of your assets will update with every account added or refreshed. Naming a class "credit" (case insensitive) will cause the balance of the accounts in that class to detract from your total net worth.

## Get Started

`docker-compose build `

`docker-compose up `

## API Keys

This application uses connectors to call external APIs in order to keep data up to date. To run you will need your own:

- [Coinbase id & secret](https://developers.coinbase.com/api/v2)
- [Plaid id & secret](https://plaid.com/docs/quickstart/)
