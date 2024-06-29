import store from "@/store";
import { networkName, getNetworkKeyForName } from "@/store/modules/network";
import UniStorage from "../storage";

/*interface Tail {
  hash: string;
  name: string;
  code: string;
  description: string;
  chialisp: string;
  clvm: string;
  logo_url: string;
  supply: string;
  hashgreen: HashGreen;
  website_url: string;
  twitter_url: string;
  discord_url: string;
  category: string;
}*/

interface Tail {
  asset_id: string;
  pair_id: string;
  name: string;
  short_name: string;
  image_url: string;
  verified: boolean;
}

/*
interface HashGreen {
  price: string | null;
  marketcap: string | null;
}
*/

/*
interface TailDbResponse {
  nextCursor: number | null;
  tails: Tail[];
}*/


export interface TailInfo {
  hash: string;
  code: string;
  logo_url: string;
}

class TailDb {
  private tailDbUrl = "https://api.v2.tibetswap.io/tokens";
  private storageKey = "TAILDB_CAT_LIST";
  private lastUpdateKey = "TAILDB_LAST_UPDATE";
  private ustore = UniStorage.create();
  private validityPeriod: number = 24 * 60 * 60; // unit: second

  private async getCatFromTailDb(): Promise<void> {
    //console.log(getNetworkKeyForName(networkName()));
    //console.log(store.state.network.networks[getNetworkKeyForName(networkName())].tailDbUrl);
    this.tailDbUrl = store.state.network.networks[getNetworkKeyForName(networkName())].tailDbUrl;
    const resp = await fetch(this.tailDbUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "x-api-version": "2",
      },
    });
    if (resp.status !== 200) {
      throw new Error(await resp.text());
    }
    //const p = (await resp.json()) as TailDbResponse;

    const p = (await resp.json()) as Tail[];
    //console.log(p);

    const tails: TailInfo[] = p
      .filter((t) => t.asset_id && t.short_name && t.image_url)
      .map((tail) => ({
        hash: tail.asset_id,
        code: tail.short_name,
        logo_url: tail.image_url,
      }));

    /*  const tails: TailInfo[] = p.tails
      .filter((t) => t.hash && t.code && t.logo_url)
      .map((tail) => ({
        hash: tail.hash,
        code: tail.code,
        logo_url: tail.logo_url,
      }));*/
    tails.sort((a, b) => a.code.localeCompare(b.code));
    this.ustore.setItem(this.storageKey, JSON.stringify(tails));
    this.ustore.setItem(this.lastUpdateKey, Date.now().toString());
  }

  private async checkAndUpdate(): Promise<void> {
    const lastUpdate = await this.ustore.getItem(this.lastUpdateKey);
    const t = await this.ustore.getItem(this.storageKey);
    if (!lastUpdate || !t) {
      await this.getCatFromTailDb();
      return;
    }
    const elapsed = Date.now() - Number(lastUpdate);
    if (elapsed / 1000 > this.validityPeriod) {
      await this.getCatFromTailDb();
      return;
    }
  }

  public async getTails(): Promise<TailInfo[]> {
    //if (chainId() != mainnetChainId()) return [];
    let tails: TailInfo[] = [];
    await this.checkAndUpdate();
    const t = await this.ustore.getItem(this.storageKey);
    if (t == null || t.length === 0) return tails;
    tails = JSON.parse(t) as TailInfo[];
    return tails;
  }
}

export default new TailDb();
