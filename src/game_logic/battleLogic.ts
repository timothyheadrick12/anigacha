import {ButtonInteraction, MessageEmbedOptions} from 'discord.js';
import Character, {charactersInit} from '../models/Characters';
import Player from '../models/Players';

export enum FOCI_CHOICE {
  DEFENSE,
  ATTACK,
  CRIT,
  AVO,
  HIT,
  SPD,
  REVEAL,
  PASS,
}

interface BattlePlayer {
  player: Player;
  foci: number;
  character: Character;
  remainingActions: number;
  multipliers: {
    atk: number;
    def: number;
    avo: number;
    spd: number;
    hit: number;
    crit: number;
  };
}

const MAX_CRIT = 0.25;
const POST_START_ACTIONS = 1;
const START_FOCI = 5;
const START_ACTIONS = 5;

export class Battle {
  leadPlayer: BattlePlayer;
  oppPlayer: BattlePlayer;
  turn: number;
  embed: MessageEmbedOptions;

  constructor(lPlayer: Player, oPlayer: Player) {
    this.leadPlayer = {
      player: lPlayer,
      foci: START_FOCI,
      character: lPlayer.primaryCharacter!,
      remainingActions: START_ACTIONS,
      multipliers: {
        atk: 1,
        def: 1,
        avo: 1,
        spd: 1,
        hit: 1,
        crit: 1,
      },
    };
    this.oppPlayer = {
      player: oPlayer,
      foci: START_FOCI,
      character: oPlayer.primaryCharacter!,
      remainingActions: START_ACTIONS,
      multipliers: {
        atk: 1,
        def: 1,
        avo: 1,
        spd: 1,
        hit: 1,
        crit: 1,
      },
    };
    this.turn = 1;
    this.embed = {
      color: 0xcc8899,
      title:
        lPlayer.name +
        "'s " +
        lPlayer.primaryCharacter!.name +
        lPlayer.primaryCharacter!.rarity +
        ' vs. ' +
        oPlayer.name +
        "'s " +
        oPlayer.primaryCharacter!.name +
        oPlayer.primaryCharacter!.rarity,
      fields: [
        {
          name: 'Turn ' + this.turn,
          value: '...Action Phase...\n',
        },
      ],
    };
  }

  async start(interaction: ButtonInteraction) {
    await interaction.editReply({
      content: '',
      embeds: [this.embed],
      components: [],
    });
  }

  async takeAction(
    interaction: ButtonInteraction,
    player: Player,
    action: FOCI_CHOICE
  ) {
    var curPlayer: BattlePlayer;
    if (this.leadPlayer.player == player) {
      curPlayer = this.leadPlayer;
    } else {
      curPlayer = this.oppPlayer;
    }
    if (curPlayer.remainingActions <= 0 || curPlayer.foci <= 0) {
      await interaction.followUp({
        ephemeral: true,
        content: 'You have no actions remaining.',
      });
      return;
    }
    switch (action) {
      case FOCI_CHOICE.PASS:
        curPlayer.remainingActions = 0;
        return;
      case FOCI_CHOICE.ATTACK:
        curPlayer.multipliers.atk++;
        curPlayer.foci--;
        curPlayer.remainingActions--;
        break;
      case FOCI_CHOICE.DEFENSE:
        curPlayer.multipliers.def++;
        curPlayer.foci--;
        curPlayer.remainingActions--;
        break;
      case FOCI_CHOICE.AVO:
        curPlayer.multipliers.avo++;
        curPlayer.foci--;
        curPlayer.remainingActions--;
        break;
      case FOCI_CHOICE.HIT:
        curPlayer.multipliers.hit++;
        curPlayer.foci--;
        curPlayer.remainingActions--;
        break;
      case FOCI_CHOICE.CRIT:
        curPlayer.multipliers.crit++;
        curPlayer.foci--;
        curPlayer.remainingActions--;
        break;
      case FOCI_CHOICE.SPD:
        curPlayer.multipliers.spd++;
        curPlayer.foci--;
        curPlayer.remainingActions--;
        break;
      case FOCI_CHOICE.REVEAL:
        break;
    }
    await interaction.followUp({
      ephemeral: true,
      content:
        'Foci: ' +
        '✪'.repeat(curPlayer.foci) +
        '\nRemaining actions: ' +
        curPlayer.remainingActions,
    });
    if (curPlayer.remainingActions <= 0) {
      await this.updateEmbed(
        interaction,
        curPlayer.player.name + ' finished choosing actions'
      );
      if (
        this.oppPlayer.remainingActions <= 0 &&
        this.leadPlayer.remainingActions <= 0
      ) {
        await this.clearButtons(interaction);
        await this.updateEmbed(interaction, '...Combat Phase...');
        await this.computeTurn(interaction);
      }
    }
  }

  async computeTurn(interaction: ButtonInteraction): Promise<boolean> {
    var turnOrder: BattlePlayer[] = [];
    if (
      this.leadPlayer.character.spd * this.leadPlayer.multipliers.spd >
      this.oppPlayer.character.spd * this.oppPlayer.multipliers.spd
    ) {
      turnOrder.push(this.leadPlayer);
      turnOrder.push(this.oppPlayer);
      turnOrder.push(this.leadPlayer);
    } else {
      turnOrder.push(this.oppPlayer);
      turnOrder.push(this.leadPlayer);
      turnOrder.push(this.oppPlayer);
    }
    await interaction.editReply({
      content:
        turnOrder[0].character.name +
        turnOrder[0].character.rarity +
        ' moved faster and will act first',
      components: [],
    });

    var didCrit: boolean;
    for (var i = 0; i < 2; i++) {
      await interaction.editReply({
        content:
          turnOrder[i].character.name +
          turnOrder[i].character.rarity +
          ' makes there move...',
        components: [],
      });
      var j = i + 1;
      var critChance =
        ((turnOrder[i].character.crit * turnOrder[i].multipliers.crit) /
          turnOrder[j].character.luck -
          1) /
        100;
      critChance = critChance > MAX_CRIT ? MAX_CRIT : critChance;
      if (Math.random() <= critChance) {
        turnOrder[j].character.isAlive = false;
        await interaction.editReply({
          content:
            turnOrder[j].player.name +
            "'s character " +
            turnOrder[j].character.name +
            turnOrder[j].character.rarity +
            ' was hit by a critical attack. They are now dead!',
          components: [],
        });
        return false;
      }
      var hitChance =
        (turnOrder[i].character.hit * turnOrder[i].multipliers.hit) /
        (turnOrder[j].character.avo * turnOrder[j].multipliers.avo * 2);
      var hit = Math.random() <= hitChance;
      if (!hit) {
        await interaction.editReply({
          content:
            turnOrder[j].player.name +
            "'s character " +
            turnOrder[j].character.name +
            turnOrder[j].character.rarity +
            ' dodged an incoming attack!',
          components: [],
        });
      } else {
        var damage =
          turnOrder[i].character.attack * turnOrder[i].multipliers.atk -
          turnOrder[j].character.defense * turnOrder[j].multipliers.def;
        damage = damage < 0 ? 0 : damage;
        turnOrder[j].character.curHP -= damage;
        if (turnOrder[j].character.curHP < 0) {
          turnOrder[j].character.isAlive = false;
          await interaction.editReply({
            content:
              turnOrder[j].player.name +
              "'s character " +
              turnOrder[j].character.name +
              turnOrder[j].character.rarity +
              ' was hit by a fatal blow. They are now dead!',
            components: [],
          });
          return false;
        } else {
          await interaction.editReply({
            content:
              turnOrder[i].player.name +
              "'s character " +
              turnOrder[i].character.name +
              turnOrder[i].character.rarity +
              ' dealt ' +
              damage +
              ' damage!',
            components: [],
          });
        }
      }
    }
    this.nextTurn();
    return true;
  }

  nextTurn() {
    this.leadPlayer.multipliers = {
      atk: 1,
      def: 1,
      avo: 1,
      spd: 1,
      hit: 1,
      crit: 1,
    };
    this.leadPlayer.remainingActions = POST_START_ACTIONS;
    this.oppPlayer.multipliers = {
      atk: 1,
      def: 1,
      avo: 1,
      spd: 1,
      hit: 1,
      crit: 1,
    };
    this.leadPlayer.remainingActions = POST_START_ACTIONS;
    this.turn++;
    this.embed.fields!.push({
      name: 'Turn ' + this.turn,
      value: 'Action phase...\n',
    });
  }

  async updateEmbed(interaction: ButtonInteraction, updateStr: string) {
    this.embed.fields![this.turn - 1].value += updateStr + '\n';
    await interaction.editReply({
      embeds: [this.embed],
    });
  }

  async clearButtons(interaction: ButtonInteraction) {
    await interaction.editReply({
      components: [],
    });
  }
}
