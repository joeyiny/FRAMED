import { gql } from "@apollo/client";
export const newGame = gql`
  query newGame($id: String!) @live(interval: 1000) {
    games(first: 1, where: { creator: $id }) {
      id
      roomId
      creator
    }
  }
`;

export const games = gql`
  query Games @live(interval: 1000) {
    games {
      id
      Players(orderBy: position, orderDirection: asc) {
        action
        alive
        position
        player {
          id
        }
      }
      roomId
      creator
      phase
    }
  }
`;

export const game = gql`
  query Game($id: String!) @live(interval: 1000) {
    game(id: $id) {
      id
      roomId
      creator
      phase
      winner
      Players(orderBy: position, orderDirection: asc) {
        action
        alive
        vote
        position
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
