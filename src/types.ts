export enum ClientState {
  Tutorial = "tutorial",
  InGame = "inGame",
}

export enum GamePhase {
  WaitingForPlayers = 0,
  AwaitPlayerActions = 1,
  Voting = 2,
  Results = 3,
}

export enum PlayerRole {
  Unknown = "unknown",
  Thief = "thief",
  Detective = "detective",
  Cop = "cop",
  Citizen = "citizen",
}

// const [playerRole, setPlayerRole] = useState<"unknown" | "thief" | "detective" | "cop" | "citizen">("unknown");
