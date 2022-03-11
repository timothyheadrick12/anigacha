//Character model used by the database to decide its format

import {
  Model,
  InferAttributes,
  DataTypes,
  Sequelize,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
export default class Character extends Model<
  InferAttributes<Character>,
  InferCreationAttributes<Character>
> {
  declare id: CreationOptional<number>; //anything with default can be optional
  declare character_id: number;
  declare name: string;
  declare anime: string;
  declare owner_id: string | null;
  declare popularity: number;
  declare image: string;
  declare rarity: string;
  declare stat_coef: number;
  declare power: number;
  declare hpCap: number;
  declare defenseCap: number;
  declare attackCap: number;
  declare avoCap: number;
  declare hitCap: number;
  declare spdCap: number;
  declare critCap: number;
  declare luckCap: number;
  declare charismaCap: number;
  declare growthRate: number;
  declare lvl: CreationOptional<number>;
  declare exp: CreationOptional<number>;
  declare isAlive: CreationOptional<boolean>;
  declare isMaxLvl: CreationOptional<boolean>;
  declare maxHP: number;
  declare curHP: number;
  declare defense: number;
  declare attack: number;
  declare avo: number;
  declare spd: number;
  declare hit: number;
  declare crit: number;
  declare luck: number;
  declare charisma: number;
}

export const charactersInit = (sequelize: Sequelize) => {
  Character.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      character_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      anime: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      owner_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      popularity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rarity: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      stat_coef: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      power: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      hpCap: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      attackCap: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      defenseCap: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      avoCap: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      spdCap: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      hitCap: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      critCap: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      luckCap: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      charismaCap: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      curHP: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      maxHP: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      defense: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      attack: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      avo: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      spd: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      hit: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      crit: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      luck: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      charisma: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      lvl: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      exp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      growthRate: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isAlive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      isMaxLvl: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: "characters",
    }
  );
};
