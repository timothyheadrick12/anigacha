//This file contains miscallaneous functions and variables used
// throughout the program but not worth having their own file.

import {Collection} from 'discord.js';
import getPopularityOfRank from './requests/getPopularityOfRank';
import Player from './models/Players';

//List of all players keyed by user.id. Used to access players throughout
//program.
export const players = new Collection<string, Player>();

//load players in database into players on startup
export const getPlayers = async () => {
  Player.findAll().then((fPlayers) =>
    fPlayers.forEach((player) => {
      player
        .getPrimaryCharacter()
        .then((character) => (player.primaryCharacter = character));
      players.set(player.id, player);
    })
  );
};

//Used in characterLogic for stat calculations
export var popularityCut = {
  top: 0,
  top100: 0,
  top1000: 0,
  top2500: 0,
  top10000: 0,
};

//sets value of all variables in popularityCut
export const updatePopularity = async () => {
  popularityCut.top = await getPopularityOfRank(1);
  popularityCut.top100 = await getPopularityOfRank(100);
  popularityCut.top1000 = await getPopularityOfRank(1000);
  popularityCut.top2500 = await getPopularityOfRank(2500);
  popularityCut.top10000 = await getPopularityOfRank(10000);
};

//calculates rarity star string based on favourites compared to others
export const calculateRarity = (favourites: number) => {
  if (favourites >= popularityCut.top100) return '★★★★★';
  else if (favourites >= popularityCut.top1000) return '★★★★';
  else if (favourites >= popularityCut.top2500) return '★★★';
  else if (favourites >= popularityCut.top10000) return '★★';
  else return '★';
};

//A general sleep function
export function sleep(milliseconds: number) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
