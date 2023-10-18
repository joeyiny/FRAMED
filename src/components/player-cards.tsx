import { usePrivy } from "@privy-io/react-auth";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import * as Typography from "./ui/typography";
import { shortenEthAddress } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Player } from "@/screens/in-game";
import { PLAYER_NAMES } from "@/screens/in-game";

export const ActivePlayerCard = ({ player, index }: { player: Player; index: number }) => {
  const { user } = usePrivy();
  const [isYou, setIsYou] = useState<"loading" | true | false>("loading");

  useEffect(() => {
    const fetchData = async () => {
      // const p = await queryUsers();
      const w = user.wallet.address.toLowerCase();
      const a = player.id.toLowerCase();
      if (w === a) {
        setIsYou(true);
      } else {
        setIsYou(false);
      }
    };
    fetchData();
  }, [player, user.wallet.address]);

  return (
    <Card
    className={` p-4 w-[150px] sm:w-[180px] text-left ${isYou ? "border-zinc-400" : "0"}`}
      style={{
        boxShadow: "0px 8px 10px -3px rgba(0, 0, 0, 0.04), 0px 2px 4px -4px rgba(16, 24, 40, 0.02)",
      }}>
      <CardContent className="p-0">
        {isYou && <Badge className="absolute translate-x-1 translate-y-1 opacity-85 animate-pulse">You</Badge>}
        <img
          src={`assets/avatars/${index}.jpeg`}
          width={200}
          height={200}
          // fill
        />
      </CardContent>
      <CardFooter className="flex w-full flex-col text-left p-0">
        <Typography.TypographyP className="text-left w-full font-bold">{PLAYER_NAMES[index]}</Typography.TypographyP>
        <Typography.TypographySmall className="text-left w-full font-normal text-zinc-500">
          {shortenEthAddress(player.id)}
        </Typography.TypographySmall>
      </CardFooter>
    </Card>
  );
};

export const WaitingPlayerCard = () => {
  return (
    <Card className={`w-[100%] sm:w-[115px] text-left bg-none border-dashed text-slate-500 bg-slate-100 animate-pulse`}>
      <CardContent></CardContent>
      <CardFooter className="flex w-full flex-row items-center justify-center align-middle">
        <Typography.TypographySmall>Waiting for frens to join...</Typography.TypographySmall>
      </CardFooter>
    </Card>
  );
};

export const ClickablePlayerCard = ({
  player,
  index,
  onClick,
}: {
  player: Player;
  index: number;
  onClick: () => void;
}) => {
  const { user } = usePrivy();
  const [isYou, setIsYou] = useState<"loading" | true | false>("loading");

  useEffect(() => {
    const fetchData = async () => {
      // const p = await queryUsers();
      const w = user.wallet.address.toLowerCase();
      const a = player.id?.toLowerCase() || "";
      if (w === a) {
        setIsYou(true);
      } else {
        setIsYou(false);
      }
    };
    fetchData();
  }, [player, user.wallet.address]);

  return (
    <button onClick={onClick}>
      <Card
      className={`p-4 w-[150px] sm:w-[180px] text-left ${!player.alive && "bg-red-50 border-red-700"} ${
        isYou ? "border-zinc-400" : "0"
    }`}
        style={{
          boxShadow: "0px 8px 10px -3px rgba(0, 0, 0, 0.04), 0px 2px 4px -4px rgba(16, 24, 40, 0.02)",
        }}>
        <CardContent className="p-0">
          {isYou && <Badge className="absolute translate-x-1 translate-y-1 opacity-85 animate-pulse">You</Badge>}
          {user?.wallet?.address === player.id && (
            <Badge className="absolute translate-x-1 translate-y-1 opacity-85 animate-pulse">You</Badge>
          )}
          <img
            src={`assets/avatars/${index}.jpeg`}
            width={200}
            height={200}
            // fill
          />

          <Typography.TypographySmall>
            {!player.action && "(awaiting action)"}{" "}
            <span className="text-red-500 font-bold">{!player.alive && "DEAD"}</span>
          </Typography.TypographySmall>
        </CardContent>
        <CardFooter className="flex w-full flex-col text-left p-0">
          <Typography.TypographyP className="text-left w-full font-bold">{PLAYER_NAMES[index]}</Typography.TypographyP>
          <Typography.TypographySmall className="text-left w-full font-normal text-zinc-500">
            {shortenEthAddress(player.id)}
          </Typography.TypographySmall>
        </CardFooter>
      </Card>
    </button>
  );
};
