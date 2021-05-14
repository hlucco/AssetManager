import { PortfolioAccount } from "./portfolioAccount";

export interface AssetClass {

    name: string;
    id: string;
    accounts: PortfolioAccount[];
    totalValue: number;

}