import { Button } from "@/components/ui/button";
import { TypographyH3 } from "@/components/ui/typography";

const TutorialFlow = ({
  setGamePhase,
}: {
  setGamePhase: React.Dispatch<React.SetStateAction<"tutorial" | "inRoom">>;
}) => {
  return (
    <div className="mt-8">
      <TypographyH3>How to play:</TypographyH3>
      <Button
        size="lg"
        onClick={() => {
          setGamePhase("inRoom");
        }}>
        Ok, start game
      </Button>
    </div>
  );
};
export default TutorialFlow;
