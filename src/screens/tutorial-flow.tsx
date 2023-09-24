import { Button } from "@/components/ui/button";
import { TypographyH3 } from "@/components/ui/typography";
import { ClientState } from "@/types";

import { Dispatch, SetStateAction } from "react";

const TutorialFlow = ({ setClientState }: { setClientState: Dispatch<SetStateAction<ClientState>> }) => {
  return (
    <div className="mt-8">
      <TypographyH3>How to play:</TypographyH3>
      <Button
        size="lg"
        onClick={() => {
          setClientState(ClientState.InGame);
        }}>
        Ok, start game
      </Button>
    </div>
  );
};
export default TutorialFlow;
