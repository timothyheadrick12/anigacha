import Player from "../models/Players";
import { players } from "../globals";

export const adjustPity = async (player_id: string, character: any) => {
  const player: Player = players.get(player_id)!;
  switch (character.rarity) {
    case "★":
    case "★★":
      player.threeStarPity++;
      player.fourStarPity++;
      player.fiveStarPity++;
      break;
    case "★★★":
      player.threeStarPity = 0;
      break;
    case "★★★★":
      player.fourStarPity = 0;
      break;
    case "★★★★★":
      player.fiveStarPity = 0;
      break;
  }
  player.save();
};
