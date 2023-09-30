import { usePrivy } from "@privy-io/react-auth";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import * as Typography from "./ui/typography";
import { shortenEthAddress } from "@/lib/utils";
import { useEffect, useState } from "react";

export const ActivePlayerCard = ({ address, index }: { address: string; index: number }) => {
  const { user } = usePrivy();
  const [isYou, setIsYou] = useState<"loading" | true | false>("loading");

  useEffect(() => {
    const fetchData = async () => {
      // const p = await queryUsers();
      const w = user.wallet.address;
      console.log(w, address);
      if (w === address) {
        setIsYou(true);
      } else {
        setIsYou(false);
      }
      // setLoading(false);
      // setPlayers(p);
      // const inGame = Object.values(p).includes(w);
      // setPlayerIsJoined(inGame);
      // if(p.includes)
      // console.log(inGame);
    };
    fetchData();
  }, [address]);

  return (
    <Card
      className="w-[180px] p-4 text-left bg-white  "
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
        <Typography.TypographyP className="text-left w-full font-bold">Ice Spice</Typography.TypographyP>
        <Typography.TypographySmall className="text-left w-full font-normal text-zinc-500">
          {shortenEthAddress(address)}
        </Typography.TypographySmall>
      </CardFooter>
    </Card>
  );
};

export const WaitingPlayerCard = () => {
  return (
    <Card className="w-[115px]  text-left bg-none border-dashed text-slate-500 bg-slate-100 animate-pulse">
      <CardContent></CardContent>
      <CardFooter className="flex w-full flex-row items-center justify-center align-middle">
        <Typography.TypographySmall>Waiting for frens to join...</Typography.TypographySmall>
      </CardFooter>
    </Card>
  );
};

export const ClickablePlayerCard = ({
  address,
  index,
  onClick,
}: {
  address: string;
  index: number;
  onClick: () => void;
}) => {
  const { user } = usePrivy();
  return (
    <button onClick={onClick}>
      <Card
        className="w-[180px] p-4 text-left bg-white  "
        style={{
          boxShadow: "0px 8px 10px -3px rgba(0, 0, 0, 0.04), 0px 2px 4px -4px rgba(16, 24, 40, 0.02)",
        }}>
        <CardContent className="p-0">
          {user?.wallet?.address === address && (
            <Badge className="absolute translate-x-1 translate-y-1 opacity-85 animate-pulse">You</Badge>
          )}
          <img
            src={`assets/avatars/${index}.jpeg`}
            width={200}
            height={200}
            // fill
          />
        </CardContent>
        <CardFooter className="flex w-full flex-col text-left p-0">
          <Typography.TypographyP className="text-left w-full font-bold">Ice Spice</Typography.TypographyP>
          <Typography.TypographySmall className="text-left w-full font-normal text-zinc-500">
            {shortenEthAddress(address)}
          </Typography.TypographySmall>
        </CardFooter>
      </Card>
    </button>
  );
};
