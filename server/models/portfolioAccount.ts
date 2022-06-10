import BalanceHistory from "./balanceHistory";
export interface PortfolioAccount {
  name: string;
  type: string;
  asset_class: string;
  accountDetails: any;
  totalBalance: number;
  balanceHistory: BalanceHistory[];
  id: string;
}
