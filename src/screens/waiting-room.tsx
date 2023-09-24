// import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import * as Typography from "@/components/ui/typography";
import { shortenEthAddress } from "@/lib/utils";
import { usePrivy } from "@privy-io/react-auth";
// import { fetchEnsName } from "@wagmi/core";
import { useState, useEffect } from "react";
import { getInstance, provider } from "../lib/fhevm";
import { Contract } from "ethers";
import mafiaABI from "../abi/mafia.json";

const CONTRACT_ADDRESS = "0x0e9A9Ac3Aaf264Af4F6716C2FC982CF58F3E591D";

const ActivePlayerCard = ({ address }: { address: string }) => {
  const { user } = usePrivy();
  return (
    <Card
      className="w-[180px] p-4 text-left bg-white  "
      style={{
        boxShadow:
          "0px 8px 10px -3px rgba(0, 0, 0, 0.04), 0px 2px 4px -4px rgba(16, 24, 40, 0.02)",
      }}
    >
      <CardContent className="p-0">
        {user?.wallet?.address === address && (
          <Badge className="absolute translate-x-1 translate-y-1 opacity-85 animate-pulse">
            You
          </Badge>
        )}
        <img
          src="https://s3-alpha-sig.figma.com/img/c3c5/6ff8/3dc3aa718f4d938a03dfe6d5a1fa9001?Expires=1696204800&Signature=XYOcIlYbd2v29OdbO8jk3D~PyHBzTgVmBqKCswyl~-Cttm6XkbmACDIO-l12FqEJ1qg-C~Dlfi-M-qBPYUhjL-i-ALPoBXznJctnekksJeb8wsUyMqGhx5cI64qhkIQm-aYgWAuWt-nQGAHljbNA55pYtxoV3hdjfcmJt001pwMzIDZBF87wn2sksYCjn5MRqAVWQlI0LHPpl2p~vnBzHwGgZYAykGAGosH71vbUI7Qvgc8K-NK~KNn1kr4-4R9ux04oX2tB~TwIVYKK5YDBi2sCBg-dXhjdWZfNFBDsHOn1ypFWjT0YIHqRqcCkzdcaGoM6dIUt1THbOpPDJuIvLA__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4"
          width={200}
          height={200}
          // fill
        />
      </CardContent>
      <CardFooter className="flex w-full flex-col text-left p-0">
        <Typography.TypographyP className="text-left w-full font-bold">
          Ice Spice
        </Typography.TypographyP>
        <Typography.TypographySmall className="text-left w-full font-normal text-zinc-500">
          {shortenEthAddress(address)}
        </Typography.TypographySmall>
      </CardFooter>
    </Card>
  );
};

const WaitingPlayerCard = () => {
  return (
    <Card className="w-[115px]  text-left bg-none border-dashed text-slate-500 bg-slate-100 animate-pulse">
      <CardContent></CardContent>
      <CardFooter className="flex w-full flex-row items-center justify-center align-middle">
        <Typography.TypographySmall>
          Waiting for frens to join...
        </Typography.TypographySmall>
      </CardFooter>
    </Card>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const WaitingRoom = () => {
  const { user } = usePrivy();
  const [loading, setLoading] = useState("");
  const [dialog, setDialog] = useState("");

  const joinGame = async () => {
    try {
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, mafiaABI, signer);
      setLoading("Joining Game...");
      const result = await contract.joinGame();
      console.log(result);
      setLoading("Success!");
    } catch (e) {
      console.log(e);
      setLoading("");
      setDialog("Error during joining!");
    }
  };

  return (
    <>
      {/* <p>{ensName}</p> */}
      <div className="my-16">
        <Typography.TypographyLarge className="animate-pulse">
          Waiting for other players to join...
        </Typography.TypographyLarge>
        <Typography.TypographyMuted>
          {/* <Typography.TypographySmall>1/6 players joined</Typography.TypographySmall> */}
        </Typography.TypographyMuted>
      </div>
      <div
        id="waiting-cards"
        className="flex flex-row gap-2 items-center justify-center"
      >
        <ActivePlayerCard address={user?.wallet?.address || ""} />
        <WaitingPlayerCard />
        <WaitingPlayerCard />
        <WaitingPlayerCard />
        <WaitingPlayerCard />
        <WaitingPlayerCard />
      </div>
      {dialog && <div>{dialog}</div>}
      {loading && <div>{loading}</div>}
      <Button onClick={joinGame} size="lg" className="mt-8">
        Join Game
      </Button>
    </>
  );
};
export default WaitingRoom;
