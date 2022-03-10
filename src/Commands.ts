import {Command} from './typings/Command';
import {Hello} from './commands/Hello';
import {Summon} from './commands/Summon';
import {Inventory} from './commands/Inventory';
import {TopUp} from './commands/TopUp';
import {SetPrimary} from './commands/SetPrimary';
import {Duel} from './commands/Duel';

//list of all commands to listen for
export const Commands: Command[] = [
  Hello,
  Summon,
  Inventory,
  TopUp,
  SetPrimary,
  Duel,
];
