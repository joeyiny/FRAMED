// SPDX-License-Identifier: BSD-3-Clause-Clear
// The first version using Factory

pragma solidity >=0.8.13 <0.9.0;

import "fhevm/abstracts/EIP712WithModifier.sol";
import "fhevm/lib/TFHE.sol";
import "hardhat/console.sol";

contract MafiaFactory {
    mapping(uint => address) games;
    uint256 public roomId;
    event InitGame(address creator, address mafiaGame, uint256 roomId);

    function createGame() public returns (address) {
        Mafia newGame = new Mafia(msg.sender);
        games[roomId] = address(newGame);
        emit InitGame(msg.sender, address(newGame), roomId);
        roomId++;
        return address(newGame);
    }

    function getRoomAddress(uint256 r) public view returns (address) {
        return games[r];
    }
}

contract Mafia is EIP712WithModifier {
    event JoinGame(address _playerAddress, address[] playerAddresses);
    event InitGame(uint8 _gameCount);
    event Action(address _playerAddress, address[] playersTakenAction);
    event NextDay(bool _killed);
    event CastVote(address _voter, uint8 _playerId);
    event CheckMafia(bool _mafiaKilled);
    event Killed(address _playerAddress);
    event Exiled(uint8 _playerExiled);
    event NewState(uint8 gameState);
    event NewRound(uint8 roundCount);
    event MafiaWin(bool mafiaWin);
    event Voted(address voter, uint8 playerId, uint8 votes);

    address public owner;
    uint8 public playerCount = 0;
    uint8 public roundCount = 0;
    uint8 public gameState = 0;
    uint8 public constant MAX_PLAYERS = 4;

    // 1 is mafia | 2 is detective | 3 is doctor | 4 is citizen
    struct Player {
        uint playerId;
        address playerAddress;
        euint8 role;
        bool alive;
    }

    mapping(address => Player) public players;
    mapping(address => bool) public joinedGame;
    mapping(uint8 => Player) public idToPlayer;
    mapping(uint8 => mapping(address => bool)) public hasVoted; //updates each round
    mapping(uint8 => mapping(address => bool)) public hasTakenAction; //updates each round
    mapping(uint8 => mapping(uint8 => uint8)) public playerVoteCount; //updates each round

    euint8 public killedPlayerId;
    euint8 public savedPlayerId;
    euint8 public investigatedPlayerId;
    ebool public isCaught;
    euint8[] public roles;

    uint8 public playerKilled = 255;
    uint8 public largestVoteCount;
    uint8 public playerIdWithLargestVoteCount;
    uint8 public actionCount;
    uint8 public voteCount;
    uint8 public isMafiaKilled = 255;
    bool public tieExists = false;
    uint8 public playerKillCount;
    address[] public playersList;
    address[] public playersTakenActions;

    constructor(
        address _creator
    ) EIP712WithModifier("Authorization token", "1") {
        owner = _creator;
        joinGame(_creator);
    }

    function getPlayersArray() public view returns (address[] memory) {
        return playersList;
    }

    function initializeGame() public {
        require(playersList.length == MAX_PLAYERS, "Not enough players");
        require(roles.length == MAX_PLAYERS, "Not enough roles");
        require(
            roles.length == playersList.length,
            "Number of roles don't match number of players"
        );
        require(gameState == 0, "Game already initialized");
        for (uint8 i = 0; i < playersList.length; i++) {
            players[playersList[i]] = Player(
                i,
                playersList[i],
                TFHE.add(roles[i], TFHE.asEuint8(1)),
                true
            );
            idToPlayer[i] = Player(
                i,
                playersList[i],
                TFHE.add(roles[i], TFHE.asEuint8(1)),
                true
            );
        }
        roundCount++;
        gameState = 1;
        emit InitGame(roundCount);
        emit NewState(gameState);
    }

    function joinGame(address _address) public {
        require(gameState == 0, "Game already started, cannot join now");
        require(playersList.length < MAX_PLAYERS, "Room full.");
        require(!joinedGame[msg.sender], "You are alread this room.");
        playersList.push(_address);
        joinedGame[_address] = true;
        playerCount++;
        emit JoinGame(_address, playersList);
    }

    function viewRole(uint8 position) public view returns (uint8) {
        return TFHE.decrypt(roles[position]);
    }

    function generateUniqueRole() public {
        require(roles.length < MAX_PLAYERS, "Roles generated");
        for (uint8 i = 0; i < 10; i++) {
            euint8 matching = TFHE.asEuint8(0);
            euint8 role = TFHE.rem(TFHE.randEuint8(), 4);
            for (uint8 j = 0; j < roles.length; j++) {
                ebool isMatching = TFHE.eq(role, roles[j]);
                matching = TFHE.add(matching, TFHE.asEuint8(isMatching));
            }
            if (TFHE.decrypt(matching) == 0) {
                roles.push(role);
                break;
            }
        }
    }

    // selectedPlayer is an uint8 ciphertext
    function action(bytes calldata selectedPlayer) public {
        require(players[msg.sender].alive);
        require(gameState == 1, "Not the action phase");
        require(!hasTakenAction[roundCount][msg.sender], "Already played turn");

        // check if player is mafia
        ebool isMafia = TFHE.eq(TFHE.asEuint8(1), players[msg.sender].role);
        killedPlayerId = TFHE.add(
            killedPlayerId,
            TFHE.cmux(isMafia, TFHE.asEuint8(selectedPlayer), TFHE.asEuint8(0))
        );

        // check if player is a doctor
        ebool isDoctor = TFHE.eq(TFHE.asEuint8(3), players[msg.sender].role);
        savedPlayerId = TFHE.add(
            savedPlayerId,
            TFHE.cmux(isDoctor, TFHE.asEuint8(selectedPlayer), TFHE.asEuint8(0))
        );

        // check if player is detective
        ebool isDetective = TFHE.eq(TFHE.asEuint8(2), players[msg.sender].role);
        investigatedPlayerId = TFHE.add(
            investigatedPlayerId,
            TFHE.cmux(
                isDetective,
                TFHE.asEuint8(selectedPlayer),
                TFHE.asEuint8(0)
            )
        );

        hasTakenAction[roundCount][msg.sender] = true;
        playersTakenActions.push(msg.sender);
        actionCount++;
        emit Action(msg.sender, playersTakenActions);

        if (actionCount == playersList.length - playerKillCount) {
            revealNextDay();
            playersTakenActions = new address[](0);
        }
    }

    function revealNextDay() internal {
        require(gameState == 1, "Not ready to reveal next day");

        gameState = 2;
        emit NewState(gameState);
        ebool isVictimSaved = TFHE.eq(killedPlayerId, savedPlayerId);
        bool isVictimSavedDecrypted = TFHE.decrypt(isVictimSaved);

        if (!isVictimSavedDecrypted) {
            playerKilled = TFHE.decrypt(killedPlayerId);
            idToPlayer[playerKilled].alive = false;
            players[idToPlayer[playerKilled].playerAddress].alive = false;
            playerCount--;
            playerKillCount++;
            if (playerCount == 2) {
                emit MafiaWin(true);
            } else {
                emit NextDay(true);
                emit Killed(idToPlayer[playerKilled].playerAddress);
            }
        } else {
            emit NextDay(false);
        }

        euint8 investigatedPlayerIdRole = TFHE.asEuint8(0);

        for (uint8 i = 0; i < playersList.length; i++) {
            ebool isMatchingId = TFHE.eq(
                TFHE.asEuint8(players[playersList[i]].playerId),
                investigatedPlayerId
            );
            investigatedPlayerIdRole = TFHE.add(
                investigatedPlayerIdRole,
                TFHE.cmux(isMatchingId, idToPlayer[i].role, TFHE.asEuint8(0))
            );
        }
        isCaught = TFHE.eq(TFHE.asEuint8(1), investigatedPlayerIdRole);
    }

    function viewCaught(
        bytes32 publicKey,
        bytes calldata signature
    )
        public
        view
        onlySignedPublicKey(publicKey, signature)
        returns (bytes memory)
    {
        ebool isDetective = TFHE.eq(TFHE.asEuint8(2), players[msg.sender].role);
        euint8 valid = TFHE.cmux(
            isDetective,
            TFHE.asEuint8(isCaught),
            TFHE.asEuint8(255)
        );
        return TFHE.reencrypt(valid, publicKey, 0);
    }

    function viewOwnRole(
        bytes32 publicKey,
        bytes calldata signature
    )
        public
        view
        onlySignedPublicKey(publicKey, signature)
        returns (bytes memory)
    {
        return TFHE.reencrypt(players[msg.sender].role, publicKey, 0);
    }

    function castVote(uint8 _playerId) public {
        require(players[msg.sender].alive);
        require(idToPlayer[_playerId].alive, "Dead player cannot vote");
        require(!hasVoted[roundCount][msg.sender], "You have already voted");

        playerVoteCount[roundCount][_playerId]++;
        hasVoted[roundCount][msg.sender] = true;

        if (largestVoteCount == playerVoteCount[roundCount][_playerId]) {
            tieExists = true;
        }

        if (largestVoteCount == 0) {
            largestVoteCount = 1;
            playerIdWithLargestVoteCount = _playerId;
            tieExists = false;
        } else if (largestVoteCount < playerVoteCount[roundCount][_playerId]) {
            largestVoteCount = playerVoteCount[roundCount][_playerId];
            playerIdWithLargestVoteCount = _playerId;
            tieExists = false;
        }
        emit Voted(
            msg.sender,
            _playerId,
            playerVoteCount[roundCount][_playerId]
        );
        voteCount++;
        if (voteCount == playersList.length - playerKillCount) {
            checkIfMafiaKilled();
        }
    }

    function checkIfMafiaKilled() internal {
        require(gameState == 2, "Not ready to check Mafia");
        gameState = 3;
        emit NewState(gameState);
        if (tieExists) {
            emit CheckMafia(false);
            _resetDay();
        } else {
            idToPlayer[playerIdWithLargestVoteCount].alive = false;
            players[idToPlayer[playerIdWithLargestVoteCount].playerAddress]
                .alive = false;
            uint8 role = TFHE.decrypt(
                idToPlayer[playerIdWithLargestVoteCount].role
            );
            if (role == 1 && !tieExists) {
                isMafiaKilled = 1; //true
                emit CheckMafia(true);
            } else {
                playerKillCount++;
                playerCount--;
                isMafiaKilled = 0; //false
                if (playerCount > 2) {
                    emit CheckMafia(false);
                    _resetDay();
                } else {
                    emit MafiaWin(true);
                }
            }
        }
    }

    function _resetDay() internal {
        require(
            gameState == 3 || (gameState == 2 && !tieExists),
            "Not ready to reset day"
        );
        killedPlayerId = TFHE.asEuint8(0);
        savedPlayerId = TFHE.asEuint8(0);
        investigatedPlayerId = TFHE.asEuint8(0);
        isCaught = TFHE.asEbool(false);
        voteCount = 0;
        actionCount = 0;
        roundCount++;
        gameState = 1;
        isMafiaKilled = 255;
        playerKilled = 255;
        largestVoteCount = 0;
        emit NewRound(roundCount);
        emit NewState(gameState);
    }
}
