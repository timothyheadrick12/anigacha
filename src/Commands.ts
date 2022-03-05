import { Command } from "./typings/Command";
import { Hello } from "./commands/Hello";
import { Summon } from "./commands/Summon";
import { Inventory } from "./commands/Inventory";
import { TopUp } from "./commands/TopUp";

export const Commands: Command[] = [Hello, Summon, Inventory, TopUp];
