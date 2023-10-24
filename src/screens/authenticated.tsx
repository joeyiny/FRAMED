import Navbar from "@/components/navbar";

// import TutorialFlow from "./tutorial-flow";
import { useEffect, useState } from "react";
import InGameScreen from "./in-game";
import { useQuery } from "@apollo/client";
import { games } from "@/query";
import RoomPicker from "@/components/room-picker";
import { useWallets } from "@privy-io/react-auth";
import { parseEther } from "ethers";
import { fetchFundsForNewUser } from "@/lib/faucet-functions";
import BottomBar from "@/components/bottom-bar";
import { Spinner } from "@/components/spinner";
import { ErrorBoundary } from "react-error-boundary";

// import { fetchFundsForNewUser } from "@/lib/faucet-functions";

export const FACTORY_ADDRESS = "0x85F136F800130aDf5f58E15D76f671F588c623B2";

const Authenticated = () => {
  // const [clientState, setClientState] = useState<ClientState>(ClientState.Tutorial);

  // const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === "privy");
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === "privy");

  // const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.WaitingForPlayers);
  const [gameContract, setGameContract] = useState<string | null>(null);

  const { data, loading } = useQuery(games);

  useEffect(() => {
    if (!embeddedWallet) return;
    const provideInitialFunds = async () => {
      const balance = await (await embeddedWallet.getEthersProvider()).getBalance(embeddedWallet.address);
      const halfETHinWei = parseEther("0.5");
      // console.log(balance);
      if (balance.lte(halfETHinWei)) {
        // console.log("ur balance is less than 0.5. ur balance: ", balance);
        const result = await fetchFundsForNewUser(embeddedWallet.getEthersProvider(), embeddedWallet.address);
        if (result.status === "success") {
          // setHasFunds(true);
        } else if (result.status === "error") {
          console.error("Error fetching funds:", result.message);
        } else {
          console.log(
            result.status === "already_funded" ? "User is already funded" : "Unexpected status:",
            result.status
          );
        }
      }
    };
    provideInitialFunds().catch((error) => console.error("Unexpected error:", error));
  }, [embeddedWallet]);

  // if (loading || !data) return <p>loading</p>;
  return (
    <div>
      <Navbar />
      {loading || !data ? (
        <div className="w-full flex-col flex h-40 items-center justify-center">
          <Spinner />
        </div>
      ) : gameContract === null ? (
        <RoomPicker games={data.games} setGameContract={setGameContract} />
      ) : (
        <ErrorBoundary fallback={<p>there was an error. please try again.</p>}>
          <InGameScreen gameContract={gameContract} setGameContract={setGameContract} />
        </ErrorBoundary>
      )}
      <BottomBar />
    </div>
  );
};
export default Authenticated;
