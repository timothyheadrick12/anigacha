import {randomInt} from 'crypto';
import {Collection, SelectMenuInteraction} from 'discord.js';
import {maxHeaderSize} from 'http';
import Character from '../models/Characters';

export const bots: Bot[] = [];

const MAX_BOTS = 10;

interface Bot {
  name: string;
  power: number;
  maxHP: number;
  curHP: number;
  spd: number;
  attack: number;
  defense: number;
  avo: number;
  hit: number;
  isAlive: boolean;
}

export const createBot = (): boolean => {
  if (bots.length < MAX_BOTS) {
    const bot = {
      name: 'enemy',
      power: 0,
      maxHP: randomInt(1, 100),
      curHP: 0,
      spd: randomInt(1, 100),
      attack: randomInt(1, 100),
      defense: randomInt(1, 100),
      avo: randomInt(1, 100),
      hit: randomInt(1, 100),
      isAlive: true,
    };
    bot.curHP = bot.maxHP;
    calcBotPower(bot);
    bots.push(bot);
    return true;
  }
  return false;
};

export const fightBot = async (
  character: Character,
  bot: Bot,
  interaction: SelectMenuInteraction
) => {
  var leadAttacker: Character | Bot;
  var secondAttacker: Character | Bot;
  var message;
  if (character.spd >= bot.spd) {
    leadAttacker = character;
    secondAttacker = bot;
    message =
      character.name + character.rarity + ' got a sneak attack on the enemy!\n';
  } else {
    leadAttacker = bot;
    secondAttacker = character;
    message =
      'The enemy noticed ' +
      character.name +
      character.rarity +
      ' and will strike first!\n';
  }
  var hitChance = leadAttacker.hit / (secondAttacker.avo * 2);
  var hit = Math.random() <= hitChance;
  if (hit) {
    var damage = leadAttacker.attack - secondAttacker.defense;
    damage = damage < 0 ? 0 : damage;
    secondAttacker.curHP -= damage;
    message += leadAttacker.name + ' dealt ' + damage + ' damage. ';
    if (secondAttacker.curHP <= 0) {
      message += secondAttacker.name + ' is dead!\n';
      secondAttacker.isAlive = false;
    } else {
      message +=
        secondAttacker.name +
        ' has ' +
        secondAttacker.curHP +
        ' HP remaining.\n';
    }
  } else {
    message += leadAttacker.name + ' missed!\n';
  }
};

const calcBotPower = (bot: Bot) => {
  bot.power =
    bot.maxHP + bot.attack + bot.defense + bot.spd + bot.avo + bot.hit;
};
