// import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import * as Typography from "@/components/ui/typography";
import { ParticleAuthModule } from "@biconomy/particle-auth";

const ActivePlayerCard = () => {
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
        <Typography.TypographyP className="text-left w-full">Ice Spice</Typography.TypographyP>
        <Typography.TypographySmall className="text-left w-full">0x43f0...6560</Typography.TypographySmall>
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
const WaitingRoom = ({ particle }: { particle: ParticleAuthModule.ParticleNetwork }) => {
  return (
    <div>
      <header>
        <Typography.TypographyLarge>Waiting for other players to join...</Typography.TypographyLarge>
        <Typography.TypographyMuted>
          <Typography.TypographySmall>1/6 players joined</Typography.TypographySmall>
        </Typography.TypographyMuted>
      </header>
      <div id="waiting-cards" className="flex flex-row gap-2">
        <ActivePlayerCard />
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
