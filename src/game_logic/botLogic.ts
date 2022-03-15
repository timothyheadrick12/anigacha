import {randomInt} from 'crypto';
import {Collection} from 'discord.js';
import {maxHeaderSize} from 'http';

export const bots: Bot[] = [];

const MAX_BOTS = 10;

interface Bot {
  power: number;
  maxHP: number;
  curHP: number;
  spd: number;
  attack: number;
  defense: number;
  avo: number;
  hit: number;
}

export const createBot = (): boolean => {
  if (bots.length < MAX_BOTS) {
    const bot = {
      power: 0,
      maxHP: randomInt(1, 100),
      curHP: 0,
      spd: randomInt(1, 100),
      attack: randomInt(1, 100),
      defense: randomInt(1, 100),
      avo: randomInt(1, 100),
      hit: randomInt(1, 100),
    };
    bot.curHP = bot.maxHP;
    calcBotPower(bot);
    bots.push(bot);
    return true;
  }
  return false;
};

const calcBotPower = (bot: Bot) => {
  bot.power =
    bot.maxHP + bot.attack + bot.defense + bot.spd + bot.avo + bot.hit;
};
