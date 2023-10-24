import { useWallets } from "@privy-io/react-auth";

const BottomBar = () => {
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === "privy");
  if (!embeddedWallet) return null;

  return (
    <div className="text-sm text-zinc-700 absolute left-0 bottom-0 w-full border-t border-zinc-200 h-10 flex flex-row items-center justify-center">
      <span>Your wallet address: {embeddedWallet.address}</span>
    </div>
  );
};
export default BottomBar;
