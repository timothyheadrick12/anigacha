//***************************DEPRECATED********************/

import Player from '../models/Players';
import {players} from '../globals';

export const adjustPity = async (player_id: string, character: any) => {
  const player: Player = players.get(player_id)!;
  switch (character.rarity) {
    case '★':
    case '★★':
      player.threeStarPity++;
      player.fourStarPity++;
      player.fiveStarPity++;
      break;
    case '★★★':
      player.threeStarPity = 0;
      break;
    case '★★★★':
      player.fourStarPity = 0;
      break;
    case '★★★★★':
      player.fiveStarPity = 0;
      break;
  }
  player.save();
};

// summonedCharacters.forEach((character: ReqCharacterData, index: number) => {
//   switch (character.rarity) {
//     case "★":
//     case "★★":
//       player.threeStarPity++;
//       player.fourStarPity++;
//       player.fiveStarPity++;
//       break;
//     case "★★★":
//       if (Math.random() <= THREE_STAR_KILL_CHANCE) {
//         while (!(character.rarity == "★★" || character.rarity == "★")) {
//           while (summonBuffer.length < 1);
//           fillBuffer(1);
//           player.threeStarPity++;
//           character = summonBuffer.shift()!;
//           console.log("three star killed");
//         }
//         summonedCharacters[index] = character;
//       }
//       player.threeStarPity = 0;
//       break;
//     case "★★★★":
//       if (Math.random() <= FOUR_STAR_KILL_CHANCE) {
//         while (character.rarity == "★★★★★" || character.rarity == "★★★★") {
//           while (summonBuffer.length < 1);
//           fillBuffer(1);
//           player.fourStarPity++;
//           character = summonBuffer.shift()!;
//           console.log("four star killed");
//         }
//         summonedCharacters[index] = character;
//       }
//       player.fourStarPity = 0;
//       break;
//     case "★★★★★":
//       if (Math.random() <= FIVE_STAR_KILL_CHANCE) {
//         while (character.rarity == "★★★★★") {
//           while (summonBuffer.length < 1);
//           fillBuffer(1);
//           player.fiveStarPity++;
//           character = summonBuffer.shift()!;
//           console.log(character.rarity);
//         }
//         summonedCharacters[index] = character;
//       }
//       player.fiveStarPity = 0;
//       break;
//   }
// }, summonedCharacters);
