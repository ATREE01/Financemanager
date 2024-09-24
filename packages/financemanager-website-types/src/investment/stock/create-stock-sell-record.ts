import { StockSellRecord } from "./stock-sell-record";

export interface CreateStockSellRecord extends Omit<StockSellRecord, "id"> {}
