//This file is used to create characters for the database
//that are associated with a player.
//Important files: summonLogic.ts

import Player from '../models/Players';
import {popularityCut} from '../globals';
import {randomInt} from 'crypto';
import Character from '../models/Characters';
import {ReqCharacterData} from '../typings/CharacterData';

//Max possible stat_coefficient for chaaracters
export const MAX_STAT = 1000000000000000;

//Creates a new character in the database based on
//provided CharacterData
export const createCharacter = async (
  player: Player,
  characterData: ReqCharacterData
): Promise<Character | null> => {
  const stats = calculateStat(characterData.favourites);
  return player.createCharacter({
    character_id: characterData.id,
    name: characterData.name,
    anime: characterData.anime,
    popularity: characterData.favourites,
    image_med: characterData.image_med,
    image_large: characterData.image_large,
    rarity: characterData.rarity,
    stat_coef: stats.stat_coef,
    power: stats.power,
    hpCap: stats.hpCap,
    defenseCap: stats.defenseCap,
    attackCap: stats.attackCap,
    avoCap: stats.avoCap,
    spdCap: stats.spdCap,
    hitCap: stats.hitCap,
    critCap: stats.critCap,
    luckCap: stats.luckCap,
    charismaCap: stats.charismaCap,
    growthRate: stats.growthRate,
    maxHP: stats.maxHP,
    curHP: stats.curHP,
    attack: stats.attack,
    defense: stats.defense,
    hit: stats.hit,
    charisma: stats.charisma,
    avo: stats.avo,
    spd: stats.spd,
    luck: stats.luck,
    crit: stats.crit,
  });
};

//Calculates character stats based on popularity
export const calculateStat = (popularity: number): any => {
  const stats = {
    stat_coef: 0,
    power: 0,
    hpCap: 0,
    defenseCap: 0,
    attackCap: 0,
    avoCap: 0,
    spdCap: 0,
    hitCap: 0,
    critCap: 0,
    luckCap: 0,
    charismaCap: 0,
    growthRate: 0,
    maxHP: 0,
    curHP: 0,
    attack: 0,
    luck: 0,
    avo: 0,
    spd: 0,
    defense: 0,
    hit: 0,
    charisma: 0,
    crit: 0,
  };
  //stat_coefficient is most important in that it is the max possible
  //cap of any other stat
  if (popularity >= popularityCut.top) {
    stats.stat_coef = MAX_STAT;
  } else {
    stats.stat_coef = Math.floor(
      Math.pow(MAX_STAT / 100, popularity / popularityCut.top) * 100
    );
  }
  stats.hpCap = randomInt(1, stats.stat_coef) + 1;
  stats.attackCap = randomInt(1, stats.stat_coef);
  stats.defenseCap = randomInt(1, stats.stat_coef);
  stats.avoCap = randomInt(1, stats.stat_coef);
  stats.spdCap = randomInt(1, stats.stat_coef);
  stats.hitCap = randomInt(1, stats.stat_coef);
  stats.critCap = randomInt(1, stats.stat_coef);
  stats.luckCap = randomInt(1, stats.stat_coef);
  stats.charismaCap = randomInt(1, stats.stat_coef);
  stats.growthRate = randomInt(1, stats.stat_coef);
  stats.maxHP = Math.floor((Math.random() * 0.1 + 0.01) * stats.hpCap) + 1;
  stats.attack = Math.floor((Math.random() * 0.1 + 0.01) * stats.attackCap);
  stats.luck = Math.floor((Math.random() * 0.1 + 0.01) * stats.luckCap);
  stats.avo = Math.floor((Math.random() * 0.1 + 0.01) * stats.avoCap);
  stats.spd = Math.floor((Math.random() * 0.1 + 0.01) * stats.avoCap);
  stats.hit = Math.floor((Math.random() * 0.1 + 0.01) * stats.hitCap);
  stats.defense = Math.floor((Math.random() * 0.1 + 0.01) * stats.defenseCap);
  stats.crit = Math.floor((Math.random() * 0.1 + 0.01) * stats.critCap);
  stats.charisma = Math.floor((Math.random() * 0.1 + 0.01) * stats.charismaCap);
  stats.curHP = stats.maxHP;
  stats.power =
    stats.maxHP +
    stats.attack +
    stats.luck +
    stats.avo +
    stats.spd +
    stats.hit +
    stats.defense +
    stats.crit +
    stats.charisma;

  return stats;
};
