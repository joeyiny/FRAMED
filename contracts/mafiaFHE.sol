// SPDX-License-Identifier: BSD-3-Clause-Clear

pragma solidity >=0.8.13 <0.9.0;

import "fhevm/abstracts/EIP712WithModifier.sol";
import "fhevm/lib/TFHE.sol";
import "hardhat/console.sol";

contract Mafia is EIP712WithModifier {

    event JoinGame(address _playerAddress, uint8 _playerId, uint8 _gameCount);
    event InitGame(uint8 _gameCount);
    event Action(address _playerAddress, uint8 _actionCount, uint8 _gameCount); 
    event NextDay(bool _killed, uint8 _gameCount);
    event CastVote(address _voter, uint8 _playerId, uint8 _gameCount);
    event CheckMafia(bool _mafiaKilled, uint8 _gameCount);
    event Killed(uint8 _playerKilled, uint8 _gameCount);
    event Exiled(uint8 _playerExiled, uint8 _gameCount);
    event NewState(uint8 gameState, uint8 _gameCount);
    event RestartGame(uint8 _gameCount);
    
    // 1 is mafia | 2 is detective | 3 is doctor | 4 is citizen

    address public owner;
    uint8 playerCount = 0;
    uint8 gameCount = 0;
    uint8 public gameState = 0;

    struct Player {
        uint playerId;
        address playerAddress;
        euint8 role;
        bool alive;
    }

    mapping (uint8 => mapping (address => Player)) public players;
    mapping (uint8 => mapping(address => bool)) joinedGame;
    mapping (uint8 => mapping(address => euint8)) public target;
    mapping (uint8 => mapping(uint8 => Player)) public idToPlayer; 
    mapping (uint8 => mapping(address => bool)) public hasVoted;
    mapping (uint8 => mapping(address => bool)) public hasTakenAction;
    mapping (uint8 => mapping(uint8 => uint8)) public playerVoteCount;
    mapping (uint8 => address[]) public playersList;
    

    euint8 public killedPlayerId;
    euint8 public savedPlayerId;
    euint8 public investigatedPlayerId;
    ebool public isCaught;

    //address[] public playersList;
    uint8 public playerKilled;
    uint8 public largestVoteCount;
    uint8 public playerIdWithLargestVoteCount;
    uint8 public actionCount;
    uint8 public voteCount;
    uint8 public isMafiaKilled = 255;
    bool public tieExists = false;
    
    event Voted(address voter, uint8 playerId, uint8 votes);

    constructor() EIP712WithModifier("Authorization token", "1") {
        owner = msg.sender;
    }

    function getPlayersArray(uint8 _gameCount) public view returns(address[] memory) {
        return playersList[_gameCount];
    }

    function initializeGame(bytes[] calldata roles) public {
        require(playersList[gameCount].length == 3);
        for (uint8 i = 0; i < 3; i++) {
            players[gameCount][playersList[gameCount][i]] = Player(i, playersList[gameCount][i], TFHE.asEuint8(roles[i]), true);
            idToPlayer[gameCount][i] = Player(i, playersList[gameCount][i], TFHE.asEuint8(roles[i]), true);
        }
        gameCount++;
        emit InitGame(gameCount);
        gameState = 1;
        emit NewState(gameState, gameCount);
    }


    function newGame(bytes[] calldata roles) public {
        killedPlayerId = TFHE.asEuint8(0);
        savedPlayerId = TFHE.asEuint8(0);
        investigatedPlayerId = TFHE.asEuint8(0);
        isCaught = TFHE.asEbool(false);
        voteCount = 0;
        actionCount = 0;
        gameState = 0;
        for (uint8 i = 0; i < 3; i++) {
            players[gameCount][playersList[gameCount][i]].role = TFHE.asEuint8(roles[i]);
            players[gameCount][playersList[gameCount][i]].alive = true;
        }
        gameCount++;
        playerKilled = 0;
        largestVoteCount = 0;
        playerIdWithLargestVoteCount = 0;
        actionCount = 0;
        voteCount = 0;
        isMafiaKilled = 255;
        tieExists = false;
        emit InitGame(gameCount);
    }

    // join the game
    function joinGame() public {
        require(playersList[gameCount].length < 4);
        require(!joinedGame[gameCount][msg.sender]);
        playersList[gameCount].push(msg.sender);
        joinedGame[gameCount][msg.sender] = true;
        emit JoinGame(msg.sender, playerCount, gameCount);
    }

    function setGameState(uint8 _gameState) public {
        gameState = _gameState;
    } 

    // selectedPlayer is an uint8 ciphertext
    function action(bytes calldata selectedPlayer) public {
        require(!hasTakenAction[gameCount][msg.sender], "Already played turn");

        // check if player is mafia
        ebool isMafia = TFHE.eq(TFHE.asEuint8(1), players[gameCount][msg.sender].role);
        killedPlayerId = TFHE.add(killedPlayerId, TFHE.cmux(isMafia, TFHE.asEuint8(selectedPlayer), TFHE.asEuint8(0)));

        // check if player is a doctor
        ebool isDoctor = TFHE.eq(TFHE.asEuint8(3), players[gameCount][msg.sender].role);
        savedPlayerId = TFHE.add(savedPlayerId, TFHE.cmux(isDoctor, TFHE.asEuint8(selectedPlayer), TFHE.asEuint8(0)));

        // check if player is detective
        ebool isDetective = TFHE.eq(TFHE.asEuint8(2), players[gameCount][msg.sender].role);
        investigatedPlayerId = TFHE.add(investigatedPlayerId, TFHE.cmux(isDetective, TFHE.asEuint8(selectedPlayer), TFHE.asEuint8(0)));

        hasTakenAction[gameCount][msg.sender] = true;
        emit Action(msg.sender, actionCount, gameCount);
        if (actionCount == 2) {
            revealNextDay();
        } else {
            actionCount++;
        }

    }


    function revealNextDay() public {
        gameState = 2;
        emit NewState(gameState, gameCount);
        ebool isVictimSaved = TFHE.eq(killedPlayerId, savedPlayerId);
        bool isVictimSavedDecrypted = TFHE.decrypt(isVictimSaved);

        if (!isVictimSavedDecrypted) {
            playerKilled = TFHE.decrypt(killedPlayerId);
            idToPlayer[gameCount][playerKilled].alive = false;
            players[gameCount][idToPlayer[gameCount][playerKilled].playerAddress].alive = false;
            voteCount++;
            // Emit dead event
            emit NextDay(true, gameCount);
            emit Killed(playerKilled, gameCount);
        } else {
            emit NextDay(false, gameCount);
        }

        euint8 investigatedPlayerIdRole = TFHE.asEuint8(0);

        for (uint8 i = 0; i < playersList[gameCount].length; i++) {
            ebool isMatchingId = TFHE.eq(TFHE.asEuint8(players[gameCount][playersList[gameCount][i]].playerId), investigatedPlayerId);
            investigatedPlayerIdRole = TFHE.add(investigatedPlayerIdRole, TFHE.cmux(isMatchingId, idToPlayer[gameCount][i].role, TFHE.asEuint8(0)));
        }
        isCaught = TFHE.eq(TFHE.asEuint8(1), investigatedPlayerIdRole);
        
    }

    function viewCaught(bytes32 publicKey, bytes calldata signature) public view onlySignedPublicKey(publicKey, signature) returns (bytes memory) {
        ebool isDetective = TFHE.eq(TFHE.asEuint8(2), players[gameCount][msg.sender].role);
        euint8 valid = TFHE.cmux(isDetective, TFHE.asEuint8(isCaught), TFHE.asEuint8(255));
        return TFHE.reencrypt(valid, publicKey, 0);
    }

    function viewOwnRole(bytes32 publicKey, bytes calldata signature) public view onlySignedPublicKey(publicKey, signature) returns (bytes memory) {
        // return TFHE.decrypt(players[msg.sender].role);
        return TFHE.reencrypt(players[gameCount][msg.sender].role, publicKey, 0);
    }

    function castVote(uint8 _playerId) public {
        require(idToPlayer[gameCount][_playerId].alive);
        require(!hasVoted[gameCount][msg.sender], "You have already voted");

        playerVoteCount[gameCount][_playerId]++;
        hasVoted[gameCount][msg.sender] = true;

        if (largestVoteCount == playerVoteCount[gameCount][_playerId]) {
            tieExists = true;
        }
        
        if (largestVoteCount == 0) {
            largestVoteCount = 1;
            playerIdWithLargestVoteCount = _playerId;
            tieExists = false;
        } else if (largestVoteCount < playerVoteCount[gameCount][_playerId]) {
            largestVoteCount = playerVoteCount[gameCount][_playerId];
            playerIdWithLargestVoteCount = _playerId;
            tieExists = false;
        }
        emit Voted(msg.sender, _playerId, playerVoteCount[gameCount][_playerId]);
        if (voteCount == 2) {
            checkIfMafiaKilled();
        } else {
            voteCount++;
        }

    }

    function checkIfMafiaKilled() public {
        gameState = 3;
        emit NewState(gameState, gameCount);
        idToPlayer[gameCount][playerIdWithLargestVoteCount].alive = false;
        players[gameCount][idToPlayer[gameCount][playerIdWithLargestVoteCount].playerAddress].alive = false;
        uint8 role = TFHE.decrypt(idToPlayer[gameCount][playerIdWithLargestVoteCount].role);
        if (role == 1 && !tieExists) {
            isMafiaKilled = 1; //true
            emit CheckMafia(true, gameCount);
        } else {
            isMafiaKilled = 0; //false
            emit CheckMafia(false, gameCount);
        }
    }
}






