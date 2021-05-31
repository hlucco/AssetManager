import { AssetClass } from "./assetClass";
export interface PortfolioUser {
  username: string;
  password: string;
  id: string;
  assets: AssetClass[];
  sync: boolean;
}
