// SPDX-License-Identifier: BSD-3-Clause-Clear

pragma solidity >=0.8.13 <0.9.0;

import "fhevm/abstracts/EIP712WithModifier.sol";
import "fhevm/lib/TFHE.sol";
import "hardhat/console.sol";

contract Mafia is EIP712WithModifier {

    event JoinGame(address _playerAddress);
    event InitGame(uint8 _gameCount);
    event Action(address _playerAddress); 
    event NextDay(bool _killed, address _killedAddress);
    event CastVote(address _voter, uint8 _playerId);
    event CheckMafia(bool _mafiaKilled);
    
    // 1 is mafia | 2 is detective | 3 is doctor | 4 is citizen

    address public owner;
    uint8 playerCount = 0;
    uint8 gameCount = 0;

    struct Player {
        uint playerId;
        address playerAddress;
        euint8 role;
        bool alive;
    }

    mapping (address => Player) public players;
    mapping (address => euint8) public target;
    mapping (uint8 => Player) public idToPlayer; 
    mapping (address => bool) public hasVoted;
    mapping (address => bool) public hasTakenAction;
    mapping (uint8 => uint8) public playerVoteCount;

    euint8 public killedPlayerId;
    euint8 public savedPlayerId;
    euint8 public investigatedPlayerId;
    ebool public isCaught;

    address[] playersList;
    uint8 public playerKilled;
    uint8 public largestVoteCount;
    uint8 public playerIdWithLargestVoteCount;
    uint8 public actionCount;
    uint8 public voteCount;

    bool public isMafiaKilled;
    
    event Voted(address voter, uint8 playerId, uint8 votes);

    constructor() EIP712WithModifier("Authorization token", "1") {
        owner = msg.sender;
    }

    function initializeGame(bytes[] calldata roles) public {
        for (uint8 i = 0; i < 3; i++) {
            players[playersList[i]] = Player(i, playersList[i], TFHE.asEuint8(roles[i]), true);
            idToPlayer[i] = Player(i, playersList[i], TFHE.asEuint8(roles[i]), true);
        }
        gameCount++;
        emit InitGame(gameCount);
    }

    function newGame(bytes[] calldata roles) public {
        killedPlayerId = TFHE.asEuint8(0);
        savedPlayerId = TFHE.asEuint8(0);
        investigatedPlayerId = TFHE.asEuint8(0);
        isCaught = TFHE.asEbool(false);
        voteCount = 0;
        actionCount = 0;
        for (uint8 i = 0; i < 3; i++) {
            players[playersList[i]].role = TFHE.asEuint8(roles[i]);
            players[playersList[i]].alive = true;
        }
        gameCount++;
        emit InitGame(gameCount);
    }

    // join the game
    function joinGame() public {
        require(playersList.length < 3);
        playersList.push(msg.sender);
        emit JoinGame(msg.sender);
    }

    // //testing 
    // function batchJoin() public {
    //     joinGame(0x17e968F5C0472941767F06b660Ab2E7149Bdf7ED); // 1 (mafia)
    //     joinGame(0x08d8E680A2d295Af8CbCD8B8e07f900275bc6B8D); // 2 (detective)
    //     joinGame(0xaf9c5FD073933C6f7eb654542e6c6b205572Fdb4); // 3 (doctor)
    //     // joinGame(0xbb15Fa688139452f542d15778F6b4A187f6857F5); // 4 (citizen)
    //     // joinGame(0xcE716032dFe9d5BB840568171F541A6A046bBf90); // 4 (citizen) 
    // }

    // selectedPlayer is an uint8 ciphertext
    function action(bytes calldata selectedPlayer) public {
        require(!hasTakenAction[msg.sender], "Already played turn");

        // check if player is mafia
        ebool isMafia = TFHE.eq(TFHE.asEuint8(1), players[msg.sender].role);
        killedPlayerId = TFHE.add(killedPlayerId, TFHE.cmux(isMafia, TFHE.asEuint8(selectedPlayer), TFHE.asEuint8(0)));

        // check if player is a doctor
        ebool isDoctor = TFHE.eq(TFHE.asEuint8(3), players[msg.sender].role);
        savedPlayerId = TFHE.add(savedPlayerId, TFHE.cmux(isDoctor, TFHE.asEuint8(selectedPlayer), TFHE.asEuint8(0)));

        // check if player is detective
        ebool isDetective = TFHE.eq(TFHE.asEuint8(2), players[msg.sender].role);
        investigatedPlayerId = TFHE.add(investigatedPlayerId, TFHE.cmux(isDetective, TFHE.asEuint8(selectedPlayer), TFHE.asEuint8(0)));

        hasTakenAction[msg.sender] = true;
        if (actionCount == 2) {
            revealNextDay();
        } else {
            actionCount++;
        }

    }


    function revealNextDay() public {
        ebool isVictimSaved = TFHE.eq(killedPlayerId, savedPlayerId);
        bool isVictimSavedDecrypted = TFHE.decrypt(isVictimSaved);

        if (!isVictimSavedDecrypted) {
            playerKilled = TFHE.decrypt(killedPlayerId);
            idToPlayer[playerKilled].alive = false;
            players[idToPlayer[playerKilled].playerAddress].alive = false;
            voteCount++;
            // Emit dead event
        }

        euint8 investigatedPlayerIdRole = TFHE.asEuint8(0);

        for (uint8 i = 0; i < playersList.length; i++) {
            ebool isMatchingId = TFHE.eq(TFHE.asEuint8(players[playersList[i]].playerId), investigatedPlayerId);
            investigatedPlayerIdRole = TFHE.add(investigatedPlayerIdRole, TFHE.cmux(isMatchingId, idToPlayer[i].role, TFHE.asEuint8(0)));
        }
        isCaught = TFHE.eq(TFHE.asEuint8(1), investigatedPlayerIdRole);
    }

    function viewCaught(bytes32 publicKey, bytes calldata signature) public view onlySignedPublicKey(publicKey, signature) returns (bytes memory) {
        ebool isDetective = TFHE.eq(TFHE.asEuint8(2), players[msg.sender].role);
        euint8 valid = TFHE.cmux(isDetective, TFHE.asEuint8(isCaught), TFHE.asEuint8(255));
        return TFHE.reencrypt(valid, publicKey, 0);
    }

    function viewOwnRole(bytes32 publicKey, bytes calldata signature) public view onlySignedPublicKey(publicKey, signature) returns (bytes memory) {
        // return TFHE.decrypt(players[msg.sender].role);
        return TFHE.reencrypt(players[msg.sender].role, publicKey, 0);
    }

    function castVote(uint8 _playerId) public {
        require(idToPlayer[_playerId].alive);
        require(!hasVoted[msg.sender], "You have already voted");

        playerVoteCount[_playerId]++;
        hasVoted[msg.sender] = true;
        
        if (largestVoteCount == 0) {
            largestVoteCount = 1;
            playerIdWithLargestVoteCount = _playerId;
        } else if (largestVoteCount < playerVoteCount[_playerId]) {
            largestVoteCount = playerVoteCount[_playerId];
            playerIdWithLargestVoteCount = _playerId;
        }
        emit Voted(msg.sender, _playerId, playerVoteCount[_playerId]);
        if (voteCount == 2) {
            checkIfMafiaKilled();
        } else {
            voteCount++;
        }
    }

    function checkIfMafiaKilled() public returns (bool) {
        idToPlayer[playerIdWithLargestVoteCount].alive = false;
        players[idToPlayer[playerIdWithLargestVoteCount].playerAddress].alive = false;
        uint8 role = TFHE.decrypt(idToPlayer[playerIdWithLargestVoteCount].role);
        isMafiaKilled = role == 1;
        return isMafiaKilled;
    }



}







