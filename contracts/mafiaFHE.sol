// SPDX-License-Identifier: BSD-3-Clause-Clear

pragma solidity >=0.8.13 <0.9.0;

import "fhevm/abstracts/EIP712WithModifier.sol";
import "fhevm/lib/TFHE.sol";
import "hardhat/console.sol";

contract Mafia is EIP712WithModifier {

    address public owner;
    uint8 playerCount = 0;

    struct Player {
        uint8 playerId;
        euint8 role;
        bool alive;
    }

    euint8 mafiaCount = TFHE.asEuint8(1);
    // euint8 doctorCount = TFHE.asEuint8(1);
    // euint8 detectiveCount = TFHE.asEuint8(1);
    euint8 citizincount = TFHE.asEuint8(1);
    // 10100010
    // 1: mafia 2: doctor 3: detective 4: citizen
    // 0x123 -> 60 -> front end just do 60 % 4 -> role
    // 0x234 -> 50
    mapping (address => Player) players;
    mapping (address => euint8) target;
    //address[] public players;
    euint8 public killed;
    euint8 public saved;
    ebool public caught;
    uint8 public revealKilled;

    constructor() EIP712WithModifier("Authorization token", "1") {
        owner = msg.sender;
    }

    function initilazeGame(bytes[] calldata roles, address[] memory playerArray) public {
        for (uint8 i = 0; i < 5; i++) {

            roles[players[i]] = roles[i];
        }
    }

    // join the game
    // function joinGame() public {
    //     require(playerCount < 5);
    //     roles(msg.sender = TFHE.asEuint8(0));
    //     players.push(msg.sender);
    //     playerCount++;
    // }

    function action(bytes calldata target) public {
        // TODO: make sure each player did this
        ebool isMatchingKilled = TFHE.eq(TFHE.asEuint8(1), players[msg.sender].role);
        killed = TFHE.add(killed, TFHE.cmux(isMatching, TFHE.asEuint8(target), TFHE.asEuint8(0)));
        // need to make sure you are detective + is mafia
        ebool isMatchingCaught = TFHE.eq(TFHE.asEuint8(2), players[msg.sender].role);
        ebool isMafia = TFHE.eq(TFHE.asEuint8(1), players[msg.sender].role);
        ebool verify = TFHE.eq(TFHE.asEuint8(2), TFHE.add(isMatchingCaught, isMafia));
        caught = TFHE.add(TFHE.cmux(verify, TFHE.asEuint8(1), TFHE.asEuint8(0)));
        ebool isMatchingSaved = TFHE.eq(TFHE.asEuint8(3), roles[msg.sender]);
        saved = TFHE.add(saved, TFHE.cmux(isMatching, TFHE.asEuint8(target), TFHE.asEuint(0)));
    }

    function generateResult() public {
        // TODO: if saved == killed - nothing happens, else
        revealKilled = TFHE.decrypt(killed);

    }

    // function viewCaught() public view (bool) {
    //     ebool isCop = TFHE.eq(TFHE.asEuint8(3), roles[msg.sender]);
    //     TFHE.optReq(isCop);
    //     // return TFHE.reencrypt(caught, publicKey, 0);
    //     return TFHE.decrytp(caught);
    // }


// TODO: check game state ended 
// Refactor to struct
// Cast vote to kill - dead people cannot

    function castVote(uint8 _playerId) public {
        require(players[_playerId].alive);

    }



}