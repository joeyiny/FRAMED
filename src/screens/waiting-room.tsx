// import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import * as Typography from "@/components/ui/typography";
import { shortenEthAddress } from "@/lib/utils";
import { usePrivy } from "@privy-io/react-auth";
// import { fetchEnsName } from "@wagmi/core";
// import { useState, useEffect } from "react";

const ActivePlayerCard = ({ address }: { address: string }) => {
  return (
    <Card className="w-[232px] p-4 text-left ">
      <CardContent>
        <img
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800"
          alt="Photo by Drew Beamer"
          // fill
          className="rounded-md w-[200px] h-[200px]"
        />
      </CardContent>
      <CardFooter className="flex w-full flex-col text-left">
        <Typography.TypographyP className="text-left w-full">You!</Typography.TypographyP>
        <Typography.TypographySmall className="text-left w-full">
          {shortenEthAddress(address)}
        </Typography.TypographySmall>
      </CardFooter>
    </Card>
  );
};

const WaitingPlayerCard = () => {
  return (
    <Card className="w-[115px]  text-left bg-none">
      <CardContent></CardContent>
      <CardFooter className="flex w-full flex-row">
        <Typography.TypographySmall>Waiting for frens to join...</Typography.TypographySmall>
      </CardFooter>
    </Card>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const WaitingRoom = () => {
  const { logout, createWallet, user } = usePrivy();

  return (
    <div className="w-full">
      <nav className="justify-between w-full flex border-b border-slate-200 items-center py-1">
        <span className="text-red-500 font-bold ">Framed!</span>

        {/* {user?.wallet ? (
          <p>{user.wallet.address}</p>
        ) : (
          <Button size="sm" onClick={async () => await createWallet()}>
            Create Wallet
          </Button>
        )} */}

        <Button size="sm" variant="secondary" onClick={logout}>
          Log out
        </Button>
      </nav>
      {/* <p>{ensName}</p> */}
      <header>
        <Typography.TypographyLarge>Waiting for other players to join...</Typography.TypographyLarge>
        <Typography.TypographyMuted>
          {/* <Typography.TypographySmall>1/6 players joined</Typography.TypographySmall> */}
        </Typography.TypographyMuted>
      </header>
      <div id="waiting-cards" className="flex flex-row gap-2">
        <ActivePlayerCard address={user?.wallet?.address || ""} />
        <WaitingPlayerCard />
        <WaitingPlayerCard />
        <WaitingPlayerCard />
        <WaitingPlayerCard />
        <WaitingPlayerCard />
      </div>
    </div>
  );
};
export default WaitingRoom;
