import { gql } from "@apollo/client";

export const game = gql`
  query Game @live(interval: 1000) {
    games {
      id
      address
    }
    players {
      id
    }
  }
`;
