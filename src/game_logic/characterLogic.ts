import Player from '../models/Players';
import {popularityCut} from '../globals';
import {randomInt} from 'crypto';
import Character from '../models/Characters';

export const MAX_STAT = 1000000000000000;

export const createCharacter = async (
  player: string | Player,
  characterData: any
): Promise<Character | null> => {
  if (!(player instanceof Player)) {
    await Player.findByPk(player).then((foundPlayer) => {
      if (foundPlayer) {
        player = foundPlayer;
      }
    });
  }
  const stats = calculateStat(characterData.favourites);
  if (player instanceof Player) {
    return player.createCharacter({
      character_id: characterData.id,
      name: characterData.name.full,
      anime: characterData.anime,
      popularity: characterData.favourites,
      rarity: characterData.rarity,
      stat_coef: stats.stat_coef,
      power: stats.power,
      hpCap: stats.hpCap,
      defenseCap: stats.defenseCap,
      attackCap: stats.attackCap,
      avoCap: stats.avoCap,
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
      luck: stats.luck,
      crit: stats.crit,
    });
  } else {
    console.log('Something went wrong when trying to create a character');
    return null;
  }
};

export const calculateStat = (popularity: number): any => {
  const stats = {
    stat_coef: 0,
    power: 0,
    hpCap: 0,
    defenseCap: 0,
    attackCap: 0,
    avoCap: 0,
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
    defense: 0,
    hit: 0,
    charisma: 0,
    crit: 0,
  };
  if (popularity >= popularityCut.top) {
    stats.stat_coef = MAX_STAT;
  } else {
    stats.stat_coef = Math.floor(
      Math.pow(MAX_STAT / 100, popularity / popularityCut.top) * 100
    );
  }
  stats.hpCap = randomInt(1, stats.stat_coef);
  stats.attackCap = randomInt(1, stats.stat_coef);
  stats.defenseCap = randomInt(1, stats.stat_coef);
  stats.avoCap = randomInt(1, stats.stat_coef);
  stats.hitCap = randomInt(1, stats.stat_coef);
  stats.critCap = randomInt(1, stats.stat_coef);
  stats.luckCap = randomInt(1, stats.stat_coef);
  stats.charismaCap = randomInt(1, stats.stat_coef);
  stats.growthRate = randomInt(1, stats.stat_coef);
  stats.maxHP = Math.floor((Math.random() * 0.1 + 0.01) * stats.hpCap);
  stats.attack = Math.floor((Math.random() * 0.1 + 0.01) * stats.attackCap);
  stats.luck = Math.floor((Math.random() * 0.1 + 0.01) * stats.luckCap);
  stats.avo = Math.floor((Math.random() * 0.1 + 0.01) * stats.avoCap);
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
    stats.hit +
    stats.defense +
    stats.crit +
    stats.charisma;

  return stats;
};