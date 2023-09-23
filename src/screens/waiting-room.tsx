import { TypographyLarge } from "@/components/ui/typography";
import { ParticleAuthModule } from "@biconomy/particle-auth";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const WaitingRoom = ({ particle }: { particle: ParticleAuthModule.ParticleNetwork }) => {
  return (
    <div>
      <TypographyLarge>Waiting for others...</TypographyLarge>
    </div>
  );
};
export default WaitingRoom;
