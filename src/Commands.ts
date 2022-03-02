import {Command} from './Command';
import {Hello} from './commands/Hello';
import {Summon} from './commands/Summon';
import {TopCharacter} from './commands/TopCharacter';

export const Commands: Command[] = [Hello, Summon, TopCharacter];
