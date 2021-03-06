import BalanceHistory from "./balanceHistory";

export interface PortfolioAccount {
  name: string;
  type: string;
  asset_class: string;
  accountDetails: any;
  totalBalance: number;
  id: string;
  balanceHistory: BalanceHistory[];
}
