//Import files: buttons/mod*.ts and commands/Duel.ts

import {Button} from './typings/Button';
import {onePull} from './buttons/onePull';
import {tenPull} from './buttons/tenPull';

//list of all buttons the application listens for.
//This list can also be programmatically added to during runtime
//to temporarily add more buttons to listen for (i.e. duel buttons).
export const Buttons: Button[] = [onePull, tenPull];
