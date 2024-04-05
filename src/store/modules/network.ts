import store from "@/store";
import { TokenInfo } from "@/models/account";
import puzzle from "@/services/crypto/puzzle";
import Vue from "vue";
import { NetworkContext } from "@/services/coin/coinUtility";
import { getLineageProofPuzzle } from "@/services/transfer/call";

export function networkId(): string {
  return store.state.network.networkId;
}
export function networkName(): string {
  return store.state.network.network.name;
}
export function xchPrefix(): string {
  return store.state.network.prefix;
}
export function xchSymbol(): string {
  return store.state.network.symbol;
}
export function rpcUrl(): string {
  return store.state.network.network.rpcUrl;
}
export function chainId(): string {
  //console.log("chainId:");
  //console.log(store.state.network.network);
  return store.state.network.network.chainId;
}
export function mainnetChainId(): string {
  return store.state.network.networks['mainnet'].chainId;
}
export function convertToChainId(networkName: string): string {
  //console.log("convert to chain id: " + networkName);
  /*if (!networkName) {
    const storedNetworkId = localStorage.getItem(NETWORK_ID_KEY);
    if (storedNetworkId) {
        // Since localStorage can only store strings, we should check if the stored string is a valid key in 'state.networks'
        const networkInfo = store.state.network.networks[storedNetworkId];
        if (networkInfo) {
            networkName = networkInfo.name;
        } else {
            // Handle case where the network ID from localStorage is not found in 'state.networks'
            networkName = "mainnet";
        }
    } else {
        networkName = "mainnet";
    }
    return store.state.network.networks[getNetworkKeyForName(networkName)].chainId || mainnetChainId();
  }*/
  const networkKey = getNetworkKeyForName(networkName);
  const networks = store.state.network.networks;
  if (networkKey in networks && networks[networkKey]) {
    return networks[networkKey].chainId;
  } else {
    return mainnetChainId();
  }

  //return store.state.network.networks[getNetworkKeyForName(networkName)].chainId || mainnetChainId();
  /*if (!networkName || networkName == 'mainnet') return "ccd5bb71183532bff220ba46c268991a3ff07eb358e8255a65c30a2dce0e5fbb";
  if (networkName == 'testnet10') return "ae83525ba8d1dd3f09b277de18ca3e43fc0af20d20c4b3e92ef2a48bd291ccb2";
  return networkName;*/
}
export function networkContext(): NetworkContext {
  return {
    symbol: xchSymbol(),
    prefix: xchPrefix(),
    chainId: chainId(),
    api: (_) => getLineageProofPuzzle(_, rpcUrl()),
  }
}
export function ensureAddress(address: string | undefined): string {
  if (!address) return "";
  return puzzle.getAddressFromPuzzleHash(puzzle.getPuzzleHashFromAddress(address), xchPrefix());
}
export function isDefaultNetwork(name: string): boolean {
  return name == "mainnet" || name == "testnet10";
}

export function getNetworkKeyForName(name: string): string {
  for (const key in store.state.network.networks) {
    if (store.state.network.networks[key].name === name) {
      return key;
    }
  }
  // default reply is mainnet, may not be best design
  return "";
}

export interface NetworkDetail {
  name: string;
  rpcUrl: string;
  prefix: string;
  symbol: string;
  chainId: string;
  explorerUrl: string;
  mintGardenUrl: string;
  spaceScanUrl: string;
  tokenInfo: TokenInfo;
}

export interface NetworkInfo {
  [key: string]: NetworkDetail;
}

export interface INetworkState {
  networkId: string; // we'll use key from networks for this
  network: NetworkDetail;
  networks: NetworkInfo;
  symbol: string;
  prefix: string;
  defaultNetworkId: string; // we'll use key from networks for this also
  peekHeight?: number;
}
const NETWORK_ID_KEY = "NETWORK_ID";
const CUSTOM_NETWORKS = "CUSTOM_NETWORKS";

store.registerModule<INetworkState>("network", {
  state() {
    const networks: NetworkInfo = {
      mainnet: {
        name: "chia",
        rpcUrl: process.env.VUE_APP_API_URL ?? "",
        prefix: "xch",
        symbol: "XCH",
        chainId: "ccd5bb71183532bff220ba46c268991a3ff07eb358e8255a65c30a2dce0e5fbb",
        explorerUrl: "https://www.spacescan.io/xch/address/",
        mintGardenUrl: "https://www.mintgarden.io/nfts/",
        spaceScanUrl: "https://www.spacescan.io/xch/nft/",
        tokenInfo: {
          XCH: {
            symbol: "XCH",
            decimal: 12,
            unit: "XCH",
          },
        },
      },
      testnet10: {
        name: "testnet10-chia",
        rpcUrl: process.env.VUE_APP_API_URL_TESTNET ?? "",
        prefix: "txch",
        symbol: "TXCH",
        chainId: "ae83525ba8d1dd3f09b277de18ca3e43fc0af20d20c4b3e92ef2a48bd291ccb2",
        explorerUrl: "https://www.spacescan.io/txch10/address/",
        mintGardenUrl: "https://testnet.mintgarden.io/nfts/",
        spaceScanUrl: "https://www.spacescan.io/txch10/nft/",
        tokenInfo: {
          TXCH: {
            symbol: "TXCH",
            decimal: 12,
            unit: "TXCH",
          },
        },
      },
      aba: {
        name: "aba",
        rpcUrl: "https://api.abacoin.io/", //process.env.VUE_APP_API_URL_TESTNET ?? "",
        prefix: "aba",
        symbol: "ABA",
        chainId: "9c24167b2b628e8edec251888fd200dde01b14d153d924c48f4e6eb4e09536dd",
        explorerUrl: "https://aba.spacescan.io/aba/address/",
        mintGardenUrl: "https://aba.mintgarden.io/nfts/",
        spaceScanUrl: "https://aba.spacescan.io/aba/nft/",
        tokenInfo: {
          ABA: {
            symbol: "ABA",
            decimal: 12,
            unit: "ABA",
          },
        },
      },
    };
    const CustomNetworks: NetworkDetail[] = JSON.parse(localStorage.getItem(CUSTOM_NETWORKS) ?? "[]");
    CustomNetworks.forEach(network => {
      if (!isDefaultNetwork(network.name)) networks[network.name] = network;
    })
    const defaultNetworkId = "mainnet"; //networks.mainnet.name;
    //console.log(localStorage.getItem(NETWORK_ID_KEY));
    const networkId = localStorage.getItem(NETWORK_ID_KEY) || defaultNetworkId;
    const network = networks[networkId] || networks.mainnet;
    return {
      networkId,
      networks,
      network,
      symbol: network.symbol,
      prefix: network.prefix,
      defaultNetworkId,
    };
  },
  actions: {
    async switchNetwork({ state, rootState }, networkName: string) {
      if (!networkName) {
        const storedNetworkId = localStorage.getItem(NETWORK_ID_KEY);
        if (storedNetworkId) {
            // Since localStorage can only store strings, we should check if the stored string is a valid key in 'state.networks'
            const networkInfo = state.networks[storedNetworkId];
            if (networkInfo) {
                networkName = networkInfo.name;
            } else {
                // Handle case where the network ID from localStorage is not found in 'state.networks'
                networkName = "mainnet";
            }
        } else {
            networkName = "mainnet";
        }
      }
      const networkKey = getNetworkKeyForName(networkName) || localStorage.getItem(NETWORK_ID_KEY) || state.defaultNetworkId; // networkId ||
      const network = state.networks[networkKey] || state.networks.mainnet;
      state.networkId = networkKey;
      state.network = network;
      state.symbol = network.symbol;
      state.prefix = network.prefix;
      if (rootState.account) {
        rootState.account.tokenInfo = network.tokenInfo;
        for (let i = 0; i < rootState.account.accounts.length; i++) {
          const account = rootState.account.accounts[i];
          account.addressGenerated = 0;
        }
      }
      localStorage.setItem(NETWORK_ID_KEY, state.networkId);
      //console.log(localStorage.getItem(NETWORK_ID_KEY));
    },
    addOrUpdateNetwork({ state }, network: NetworkDetail) {
      if (isDefaultNetwork(network.name)) return;
      Vue.set(state.networks, network.name, network);
      const CustomNetworks: NetworkDetail[] = JSON.parse(localStorage.getItem(CUSTOM_NETWORKS) ?? "[]");
      const idx = CustomNetworks.findIndex(cn => cn.name == network.name);
      if (idx == -1) CustomNetworks.push(network);
      else CustomNetworks[idx] = network;
      localStorage.setItem(CUSTOM_NETWORKS, JSON.stringify(CustomNetworks));
    },
    async deleteNetwork({ state, dispatch }, name: string) {
      if (!state.networks[name]) return;
      Vue.delete(state.networks, name);
      const CustomNetworks: NetworkDetail[] = JSON.parse(localStorage.getItem(CUSTOM_NETWORKS) ?? "[]");
      const idx = CustomNetworks.findIndex(cn => cn.name == name);
      if (idx > -1) CustomNetworks.splice(idx, 1);
      if (state.networkId == name) await dispatch("switchNetwork", state.defaultNetworkId);
      localStorage.setItem(CUSTOM_NETWORKS, JSON.stringify(CustomNetworks));
    },
  }
});
