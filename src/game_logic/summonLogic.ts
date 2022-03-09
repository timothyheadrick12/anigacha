import { randomInt } from "crypto";
import { sleep } from "../globals";
import Player from "../models/Players";
import getCharacter from "../requests/getCharacter";
import { ReqCharacterData } from "../typings/CharacterData";

var recentRequests = 0;
const MAX_REQUESTS = 80;
const THREE_STAR_KILL_CHANCE = 0.33;
const FOUR_STAR_KILL_CHANCE = 0.5;
const FIVE_STAR_KILL_CHANCE = 0.9;
const summonBuffer: Array<ReqCharacterData> = [];

export const summon = (
  amount: number,
  player: Player
): Array<ReqCharacterData> | null => {
  if (summonBuffer.length < amount) {
    return null;
  }
  var summonedCharacters = summonBuffer.splice(0, amount);
  fillBuffer(amount);
  summonedCharacters.forEach((character: ReqCharacterData, index: number) => {
    switch (character.rarity) {
      case "★":
      case "★★":
        player.threeStarPity++;
        player.fourStarPity++;
        player.fiveStarPity++;
        break;
      case "★★★":
        player.threeStarPity = 0;
        player.fourStarPity++;
        player.fiveStarPity++;
        break;
      case "★★★★":
        player.fourStarPity = 0;
        player.fiveStarPity++;
        break;
      case "★★★★★":
        if (Math.random() <= FIVE_STAR_KILL_CHANCE) {
          while (character.rarity == "★★★★★" && summonBuffer.length > 0) {
            fillBuffer(1);
            player.fiveStarPity++;
            character = summonBuffer.shift()!;
          }
          console.log("Killed five star");
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

export const fillBuffer = async (amount: number) => {
  for (var i = 0; i < amount; i++) {
    try {
      while (recentRequests >= MAX_REQUESTS);
      if (recentRequests == 0) {
        setTimeout(() => (recentRequests = 0), 60 * 1000);
      }
      recentRequests++;
      const characterData = await getCharacter();
      summonBuffer.push(characterData);
    } catch (error) {
      console.log(error);
      sleep(1000);
      i--;
    }
  }
};
