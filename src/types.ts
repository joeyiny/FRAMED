export enum ClientState {
  Tutorial = "tutorial",
  InGame = "inGame",
}

export enum GamePhase {
  WaitingForPlayers = "waitingForPlayers",
  AwaitPlayerActions = "awaitPlayerActions",
  Voting = "voting",
  Results = "results",
  Loading = "loading",
}

export enum PlayerRole {
  Unknown = "unknown",
  Thief = "thief",
  Detective = "detective",
  Cop = "cop",
  Citizen = "citizen",
}

// const [playerRole, setPlayerRole] = useState<"unknown" | "thief" | "detective" | "cop" | "citizen">("unknown");
