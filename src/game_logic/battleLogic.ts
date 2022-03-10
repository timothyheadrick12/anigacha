//This file contains all logic related to battles or, more specifically,
//duels. Creating buttons, editing the duel message and calculating the
//result of player actions all happens within this file. Once a player
//accepts a duel, the Battle class takes over until the end of that duel.
//Important related files: modDuelButton, modAcceptDuel

import {
  ButtonInteraction,
  MessageActionRow,
  MessageButton,
  MessageEmbedOptions,
} from 'discord.js';
import {modDuelAction} from '../buttons/modDuelButtons';
import Character from '../models/Characters';
import Player from '../models/Players';
import {Buttons} from '../Buttons';

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
  buttons: MessageActionRow[];
  buttonsStartIndex: number;

  //set players to being in duel, create embed,
  //create buttons, and add buttons to Buttons list
  constructor(lPlayer: Player, oPlayer: Player) {
    lPlayer.inDuel = true;
    oPlayer.inDuel = false;
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
    this.buttons = [
      new MessageActionRow().addComponents(
        new MessageButton()
          .setLabel('ATTACK')
          .setCustomId(
            'modDuelAction' +
              FOCI_CHOICE.ATTACK +
              '_f_' +
              this.leadPlayer.player.id +
              '_t_' +
              this.oppPlayer.player.id
          )
          .setStyle('PRIMARY'),
        new MessageButton()
          .setLabel('DEFENSE')
          .setCustomId(
            'modDuelAction' +
              FOCI_CHOICE.DEFENSE +
              '_f_' +
              this.leadPlayer.player.id +
              '_t_' +
              this.oppPlayer.player.id
          )
          .setStyle('PRIMARY'),
        new MessageButton()
          .setLabel('SPEED')
          .setCustomId(
            'modDuelAction' +
              FOCI_CHOICE.SPD +
              '_f_' +
              this.leadPlayer.player.id +
              '_t_' +
              this.oppPlayer.player.id
          )
          .setStyle('PRIMARY'),
        new MessageButton()
          .setLabel('CRIT')
          .setCustomId(
            'modDuelAction' +
              FOCI_CHOICE.CRIT +
              '_f_' +
              this.leadPlayer.player.id +
              '_t_' +
              this.oppPlayer.player.id
          )
          .setStyle('PRIMARY')
      ),
      new MessageActionRow().addComponents(
        new MessageButton()
          .setLabel('AVO')
          .setCustomId(
            'modDuelAction' +
              FOCI_CHOICE.AVO +
              '_f_' +
              this.leadPlayer.player.id +
              '_t_' +
              this.oppPlayer.player.id
          )
          .setStyle('PRIMARY'),
        new MessageButton()
          .setLabel('HIT')
          .setCustomId(
            'modDuelAction' +
              FOCI_CHOICE.HIT +
              '_f_' +
              this.leadPlayer.player.id +
              '_t_' +
              this.oppPlayer.player.id
          )
          .setStyle('PRIMARY'),
        new MessageButton()
          .setLabel('REVEAL')
          .setCustomId(
            'modDuelAction' +
              FOCI_CHOICE.REVEAL +
              '_f_' +
              this.leadPlayer.player.id +
              '_t_' +
              this.oppPlayer.player.id
          )
          .setStyle('PRIMARY'),
        new MessageButton()
          .setLabel('PASS')
          .setCustomId(
            'modDuelAction' +
              FOCI_CHOICE.PASS +
              '_f_' +
              this.leadPlayer.player.id +
              '_t_' +
              this.oppPlayer.player.id
          )
          .setStyle('PRIMARY')
      ),
    ];
    this.buttonsStartIndex = Buttons.length;
    Buttons.push(modDuelAction(FOCI_CHOICE.ATTACK, this));
    Buttons.push(modDuelAction(FOCI_CHOICE.DEFENSE, this));
    Buttons.push(modDuelAction(FOCI_CHOICE.SPD, this));
    Buttons.push(modDuelAction(FOCI_CHOICE.CRIT, this));
    Buttons.push(modDuelAction(FOCI_CHOICE.AVO, this));
    Buttons.push(modDuelAction(FOCI_CHOICE.HIT, this));
    Buttons.push(modDuelAction(FOCI_CHOICE.REVEAL, this));
    Buttons.push(modDuelAction(FOCI_CHOICE.PASS, this));
  }

  //Called after battle creation to reflect that the battle
  //has started in the duel message.
  async start(interaction: ButtonInteraction) {
    await interaction.editReply({
      content: '',
      embeds: [this.embed],
      components: this.buttons,
    });
  }

  //called by modDuelButton to allow players to choose an action
  // and progress the duel to the combat phase if need be
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
        await interaction.followUp({
          ephemeral: true,
          content: 'This button does nothing right now',
        });
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
        await this.computeTurn(interaction);
      }
    }
  }

  //Uses actions and character stats to calculate the outcome of a turn
  //During each step of calculation, the message embed is editted
  async computeTurn(interaction: ButtonInteraction): Promise<boolean> {
    var turnOrder: BattlePlayer[] = [];
    await this.updateEmbed(interaction, '...Combat Phase...');
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
    await this.updateEmbed(
      interaction,
      turnOrder[0].character.name +
        turnOrder[0].character.rarity +
        ' moved faster and will act first'
    );

    var didCrit: boolean;
    for (var i = 0; i < 2; i++) {
      await this.updateEmbed(
        interaction,
        turnOrder[i].character.name +
          turnOrder[i].character.rarity +
          ' makes there move...'
      );
      var j = i + 1;
      var critChance =
        ((turnOrder[i].character.crit * turnOrder[i].multipliers.crit) /
          turnOrder[j].character.luck -
          1) /
        100;
      critChance = critChance > MAX_CRIT ? MAX_CRIT : critChance;
      if (Math.random() <= critChance) {
        turnOrder[j].character.isAlive = false;
        turnOrder[j].character.save();
        await this.updateEmbed(
          interaction,
          turnOrder[j].player.name +
            "'s character " +
            turnOrder[j].character.name +
            turnOrder[j].character.rarity +
            ' was hit by a critical attack. They are now dead!'
        );
        await this.end();
        return false;
      }
      var hitChance =
        (turnOrder[i].character.hit * turnOrder[i].multipliers.hit) /
        (turnOrder[j].character.avo * turnOrder[j].multipliers.avo * 2);
      var hit = Math.random() <= hitChance;
      if (!hit) {
        await this.updateEmbed(
          interaction,
          turnOrder[j].player.name +
            "'s character " +
            turnOrder[j].character.name +
            turnOrder[j].character.rarity +
            ' dodged an incoming attack!'
        );
      } else {
        var damage =
          turnOrder[i].character.attack * turnOrder[i].multipliers.atk -
          turnOrder[j].character.defense * turnOrder[j].multipliers.def;
        damage = damage < 0 ? 0 : damage;
        turnOrder[j].character.curHP -= damage;
        if (turnOrder[j].character.curHP < 0) {
          turnOrder[j].character.isAlive = false;
          turnOrder[j].character.save();
          await this.updateEmbed(
            interaction,
            turnOrder[j].player.name +
              "'s character " +
              turnOrder[j].character.name +
              turnOrder[j].character.rarity +
              ' was hit by a fatal blow. They are now dead!'
          );
          await this.end();
          return false;
        } else {
          await this.updateEmbed(
            interaction,
            turnOrder[i].player.name +
              "'s character " +
              turnOrder[i].character.name +
              turnOrder[i].character.rarity +
              ' dealt ' +
              damage +
              ' damage!'
          );
          turnOrder[j].character.save();
        }
      }
    }
    await this.nextTurn(interaction);
    return true;
  }

  //progresses to the next turn by resetting multipliers and adding buttons
  //to message again
  async nextTurn(interaction: ButtonInteraction) {
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
      value: '...Action phase...\n',
    });
    await interaction.editReply({
      embeds: [this.embed],
      components: this.buttons,
    });
  }

  //Adds a string to the current working field of the embed
  //Which field the string is added to depends on the turn.
  async updateEmbed(interaction: ButtonInteraction, updateStr: string) {
    this.embed.fields![this.turn - 1].value += updateStr + '\n';
    await interaction.editReply({
      embeds: [this.embed],
    });
  }

  //clear the buttons from the embed
  async clearButtons(interaction: ButtonInteraction) {
    await interaction.editReply({
      components: [],
    });
  }

  //remove the buttons from the button list
  end() {
    Buttons.splice(this.buttonsStartIndex, 8);
    this.leadPlayer.player.inDuel = false;
    this.oppPlayer.player.inDuel = false;
  }
}
