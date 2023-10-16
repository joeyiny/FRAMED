export enum ClientState {
  Tutorial = "tutorial",
  InGame = "inGame",
}

export enum GamePhase {
  WaitingForPlayers = 0,
  AwaitPlayerActions = 1,
  Voting = 2,
  RoundComplete = 3,
  GameComplete = 4,
}

export enum PlayerRole {
  Unknown = 0,
  Thief = 1,
  Detective = 2,
  Cop = 3,
  Citizen = 4,
}

// const [playerRole, setPlayerRole] = useState<"unknown" | "thief" | "detective" | "cop" | "citizen">("unknown");
