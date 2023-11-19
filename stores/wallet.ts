import { getOnboard } from "@/composables/wallet";
import type {
  ConnectOptions,
  OnboardAPI,
  WalletState,
} from "@web3-onboard/core";
import type { ConnectOptionsString } from "@web3-onboard/core/dist/types";
import { BrowserProvider } from "ethers";
import { defineStore } from "pinia";
import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  type Address,
  type Chain
} from "viem";
import { goerli, sepolia } from "viem/chains";

/**
 * Defines a reactive store for managing wallet-related state and actions.
 *
 * @returns An object containing the reactive state and actions for the wallet store.
 */
export const useWalletStore = defineStore("wallet", () => {
  const onboard = ref<OnboardAPI | null>(null);
  let unsubscribeOnboard = ref<null | (() => void)>(null);
  const wallets = ref<WalletState[]>([]);
  const loaders = ref({ connecting: false });
  const requiredChain = ref<Chain>(sepolia);
  const contracts = ref<{ ActionForge: Address }>({
    ActionForge: "0x64984643bB8df4dC31A936391BB94dD9a789Cc1a",
    // ActionForge: "0x09478e02c65f29fc59ac28a9497015bb6de00333",
  });

  // getters
  const isConnected = computed((): boolean => wallets.value.length !== 0);
  const wallet = computed((): WalletState | null => {
    if (wallets.value.length === 0) return null;
    return wallets.value[0];
  });
  const connectedChainId = computed((): number | null => {
    if (
      !wallet.value ||
      !wallet.value.chains ||
      wallet.value.chains.length === 0
    )
      return sepolia.id;
    return Number(wallet.value.chains[0].id);
  });
  const connectedAddress = computed((): Address | null => {
    if (
      !wallet.value ||
      !wallet.value.accounts ||
      wallet.value.accounts.length === 0
    )
      return null;
    return wallet.value.accounts.map(
      (account) => account.address,
    )[0] as Address | null;
  });
  const connectedAddressShort = computed((): string | null => {
    if (!connectedAddress.value) return null;
    return `${connectedAddress.value.substring(
      0,
      6,
    )}...${connectedAddress.value.substring(
      connectedAddress.value.length - 4,
    )}`;
  });
  const publicClient = computed(() =>
    createPublicClient({ chain: requiredChain.value, transport: http() }),
  );

  // actions
  /**
   * Initializes the wallet.
   * @returns {Promise<void>} A promise that resolves when the wallet is initialized.
   */
  async function init() {
    onboard.value = await getOnboard(
      [sepolia, goerli].map((chain) => getWalletCompatibleChain(chain)),
    );
  }

  /**
   * Connects the wallet.
   *
   * @param options - Optional connect options.
   * @returns A promise that resolves when the wallet is connected.
   */
  async function connect(
    options?: ConnectOptions | ConnectOptionsString | undefined,
  ): Promise<void> {
    loaders.value.connecting = true;
    try {
      if (onboard.value === null) await init();
      if (onboard.value) {
        const _wallets = onboard.value.state.select("wallets");
        const { unsubscribe } = _wallets.subscribe(
          (_wallets: WalletState[]) => {
            wallets.value = _wallets;
            const connectedWallets = _wallets.map(({ label }) => label);
            if (window)
              window.localStorage.setItem(
                "connectedWallets",
                JSON.stringify(connectedWallets),
              );
          },
        );
        unsubscribeOnboard.value = unsubscribe;

        await overrideWalletStyles(); // load the wallet modal styles
        await onboard.value.connectWallet(options);
      }
    } catch (error) {
      console.debug("failed to connect wallet", error);
    } finally {
      loaders.value.connecting = false;
    }
  }

  /**
   * Disconnects the wallet from the application.
   *
   * @returns {Promise<void>} A promise that resolves when the wallet is disconnected.
   */
  async function disconnect() {
    unsubscribeOnboard.value && unsubscribeOnboard.value();
    wallets.value.forEach(
      (wallet) => onboard.value?.disconnectWallet({ label: wallet.label }),
    );
  }

  /**
   * Switches the current blockchain network to the specified chain ID.
   *
   * @param chainId The ID of the blockchain network to switch to.
   * @returns A promise that resolves to a boolean indicating whether the switch was successful.
   */
  async function switchChain(chainId: string): Promise<boolean> {
    if (onboard.value === null) return false; // no wallet connected
    return await onboard.value.setChain({ chainId });
  }

  /**
   * Retrieves the wallet client.
   * @returns A promise that resolves to the wallet client if available, otherwise false.
   */
  async function getWalletClient(
    isEthers = false,
  ): Promise<any> {
    if (!wallet.value) return false;

    try {
      if (requiredChain.value.id !== connectedChainId.value)
        await switchChain(`0x${requiredChain.value.id.toString(16)}`);
    } catch (error) {
      console.debug("failed to switch chain", error);
      return false;
    }

    if (isEthers) return new BrowserProvider(wallet.value.provider).getSigner();
    return createWalletClient({
      chain: requiredChain.value,
      transport: custom(wallet.value.provider),
    });
  }

  return {
    loaders,
    isConnected,
    contracts,
    connectedAddress,
    connectedAddressShort,
    publicClient,
    connectedChainId,
    requiredChain,
    init,
    switchChain,
    getWalletClient,
    connect,
    disconnect,
  };
});

/**
 * Returns a wallet compatible chain object.
 * @param chain - The chain object.
 * @returns The wallet compatible chain object.
 */
export function getWalletCompatibleChain(chain: Chain) {
  return {
    id: `0x${chain.id.toString(16)}`,
    token: chain.nativeCurrency.symbol,
    label: chain.name,
    rpcUrl: chain.rpcUrls.default.http[0],
    blockExplorerUrl: chain.blockExplorers?.default?.url || "",
  };
}
