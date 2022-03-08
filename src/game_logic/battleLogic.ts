import Character from '../models/Characters';
import Player from '../models/Players';

export enum FOCI_CHOICE {
  DEFENSE,
  ATTACK,
  CRIT,
  AVO,
  HIT,
  REVEAL_DEFENSE,
  REVEAL_ATTACK,
  REVEAL_CRIT,
  REVEAL_AVO,
  REVEAL_HIT,
}

export class Battle {
  leadPlayer: Player;
  oppPlayer: Player;
  leadPlayerFoci: number;
  oppPlayerFoci: number;
  leadCharacter: Character;
  oppCharacter: Character;
  turn: number;

  constructor(lPlayer: Player, oPlayer: Player) {
    this.leadPlayer = lPlayer;
    this.oppPlayer = oPlayer;
    this.leadPlayerFoci = 5;
    this.oppPlayerFoci = 5;
    this.leadCharacter = lPlayer.primaryCharacter!;
    this.oppCharacter = oPlayer.primaryCharacter!;
    this.turn = 1;
  }
}
