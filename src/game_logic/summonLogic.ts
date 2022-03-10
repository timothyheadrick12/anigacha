//This file handles summonRequests and the summonBuffer.

import {sleep} from '../globals';
import Player from '../models/Players';
import getCharacter from '../requests/getCharacter';
import {ReqCharacterData} from '../typings/CharacterData';

var recentRequests = 0;
var initialReqTime: number;
const MAX_REQUESTS = 80;
const THREE_STAR_KILL_CHANCE = 0.33;
const FOUR_STAR_KILL_CHANCE = 0.5;
const FIVE_STAR_KILL_CHANCE = 0.9;

//A buffer of CharacterData to increase the responsiveness
//on the user side of summoning.
const summonBuffer: Array<ReqCharacterData> = [];

//Gets a set number of CharactData from the buffer
//and turns them into characters assigned to the player that summoned.
//Handles adjusting pity and replacing characters based on luck as well.
export const summon = (
  amount: number,
  player: Player
): Array<ReqCharacterData> | null => {
  if (summonBuffer.length < amount) {
    //I need to find a better solution, this is a temporary fix.
    return null; //leave the function if not enough summons in buffer
  }
  var summonedCharacters = summonBuffer.splice(0, amount);
  fillBuffer(amount);
  summonedCharacters.forEach((character: ReqCharacterData, index: number) => {
    switch (character.rarity) {
      case '★':
      case '★★':
        player.threeStarPity++;
        player.fourStarPity++;
        player.fiveStarPity++;
        break;
      case '★★★':
        player.threeStarPity = 0;
        player.fourStarPity++;
        player.fiveStarPity++;
        break;
      case '★★★★':
        player.fourStarPity = 0;
        player.fiveStarPity++;
        break;
      case '★★★★★':
        if (Math.random() <= FIVE_STAR_KILL_CHANCE) {
          while (character.rarity == '★★★★★' && summonBuffer.length > 0) {
            fillBuffer(1);
            player.fiveStarPity++;
            character = summonBuffer.shift()!;
          }
          console.log('Killed five star');
          summonedCharacters[index] = character;
        } else {
          player.fiveStarPity = 0;
        }
        break;
    }
  }, summonedCharacters);
  player.save();
  return summonedCharacters;
};

//Handles refilling the buffer as characters are used up
export const fillBuffer = async (amount: number) => {
  for (var i = 0; i < amount; i++) {
    try {
      if (recentRequests >= MAX_REQUESTS) {
        //This could probably be done better
        if (Date.now() - initialReqTime >= 60 * 1000) {
          console.log('recentRequests reset!');
          recentRequests = 0;
        } else {
          setTimeout(() => fillBuffer(1), 5 * 1000);
        }
      } else {
        if (recentRequests == 0) {
          initialReqTime = Date.now();
        }
        recentRequests++;
        const characterData = await getCharacter();
        summonBuffer.push(characterData);
      }
    } catch {
      //An error is thrown by the api if too many requests happen in one second.
      //This happens occasionally with high connection and processor speed.
      //Waiting a second allows more requests to be made.
      console.log('Too many anilistapi requests in one second! waiting...');
      sleep(1000);
      i--;
    }
  }
};
