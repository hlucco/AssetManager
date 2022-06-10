import { PortfolioAccount } from "./portfolioAccount";
import BalanceHistory from "./balanceHistory";
export interface AssetClass {
  name: string;
  id: string;
  accounts: PortfolioAccount[];
  totalValue: number;
  color: string;
  balanceHistory: BalanceHistory[];
}
