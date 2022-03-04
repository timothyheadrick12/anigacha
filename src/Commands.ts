import { Command } from "./typings/Command";
import { Hello } from "./commands/Hello";
import { Summon } from "./commands/Summon";
import { Inventory } from "./commands/Inventory";

export const Commands: Command[] = [Hello, Summon, Inventory];
