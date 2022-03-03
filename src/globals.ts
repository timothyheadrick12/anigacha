import {Collection} from 'discord.js';
import getPopularityOfRank from './requests/getPopularityOfRank';
import Character from './models/Characters';
import Player from './models/Players';

export const players = new Collection<string, Character | null>();

export const getPlayers = async () => {
  Player.findAll({
    attributes: ['id'],
  }).then((fPlayers) =>
    fPlayers.forEach(async (player) => {
      const primaryCharacter = await player.getPrimaryCharacter();
      players.set(player.id, primaryCharacter);
    })
  );
};

export var popularityCut = {
  top: 0,
  top100: 0,
  top1000: 0,
  top2500: 0,
  top10000: 0,
};

export const updatePopularity = async () => {
  popularityCut.top = await getPopularityOfRank(1);
  popularityCut.top100 = await getPopularityOfRank(100);
  popularityCut.top1000 = await getPopularityOfRank(1000);
  popularityCut.top2500 = await getPopularityOfRank(2500);
  popularityCut.top10000 = await getPopularityOfRank(10000);
};

export const calculateRarity = (favourites: number) => {
  if (favourites >= popularityCut.top100) return '★★★★★';
  else if (favourites >= popularityCut.top1000) return '★★★★';
  else if (favourites >= popularityCut.top2500) return '★★★';
  else if (favourites >= popularityCut.top10000) return '★★';
  else return '★';
};
