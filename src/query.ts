import { gql } from "@apollo/client";

export const games = gql`
  query Games @live(interval: 1000) {
    games {
      id
      Players {
        player {
          id
        }
      }
      roomId
      creator
      state
    }
  }
`;

export const game = gql`
  query Game($id: String!) {
    game(id: $id) {
      id
      roomId
      creator
      state
      Players {
        player {
          id
        }
      }
    }
  }
`;

export const players = gql`
  query Players @live(interval: 1000) {
    players {
      id
      game {
        game {
          id
          roomId
        }
      }
    }
  }
`;
