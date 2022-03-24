import {Command} from './typings/Command';
import {Heal} from './commands/Heal';
import {Summon} from './commands/Summon';
import {Inventory} from './commands/Inventory';
import {TopUp} from './commands/TopUp';
import {SetPrimary} from './commands/SetPrimary';
import {Duel} from './commands/Duel';
import {Stats} from './commands/Stats';
import {CreatePassword} from './commands/CreatePassword';

//list of all commands to listen for
export const Commands: Command[] = [
  Summon,
  Inventory,
  TopUp,
  SetPrimary,
  Duel,
  Heal,
  Stats,
  CreatePassword,
];
