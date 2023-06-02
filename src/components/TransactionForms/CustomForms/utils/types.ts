export interface Pack {
  amount: number;
  price: number;
}

export interface PackInfo {
  [key: string]: {
    packs: Pack[];
  };
}

export interface WhitelistInfo {
  [key: string]: {
    limit: number;
  };
}
