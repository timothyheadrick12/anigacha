//Player model used by database

import {
  Model,
  InferAttributes,
  DataTypes,
  Sequelize,
  Association,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyAddAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  InferCreationAttributes,
  HasOneCreateAssociationMixin,
  HasOneSetAssociationMixin,
  HasOneGetAssociationMixin,
  CreationOptional,
  NonAttribute,
} from 'sequelize';
import Character from './Characters';
import bcrypt from 'bcrypt';
export default class Player extends Model<
  InferAttributes<Player>,
  InferCreationAttributes<Player>
> {
  declare id: string;
  declare name: string;
  declare password: CreationOptional<string>;
  declare currency: CreationOptional<number>;
  declare fiveStarPity: CreationOptional<number>;
  declare fourStarPity: CreationOptional<number>;
  declare threeStarPity: CreationOptional<number>;
  //not part of database. These need to be set manually somewhere in code.
  //They are only for program logic during runtime
  declare primaryCharacter?: NonAttribute<Character>;
  declare inDuel?: NonAttribute<boolean>;

  declare getCharacters: HasManyGetAssociationsMixin<Character>;
  declare addCharacter: HasManyAddAssociationMixin<Character, number>;
  declare addCharacters: HasManyAddAssociationsMixin<Character, number>;
  declare setCharacter: HasManySetAssociationsMixin<Character, number>;
  declare removeCharacter: HasManyRemoveAssociationMixin<Character, number>;
  declare removeCharacters: HasManyRemoveAssociationsMixin<Character, number>;
  declare hasCharacter: HasManyHasAssociationMixin<Character, number>;
  declare hasCharacters: HasManyHasAssociationsMixin<Character, number>;
  declare countCharacter: HasManyCountAssociationsMixin;
  declare createCharacter: HasManyCreateAssociationMixin<Character, 'owner_id'>;

  declare getPrimaryCharacter: HasOneGetAssociationMixin<Character>;
  declare setPrimaryCharacter: HasOneSetAssociationMixin<Character, 'id'>;
  declare createPrimaryCharacter: HasOneCreateAssociationMixin<Character>;

  validPassword(password: string): NonAttribute<boolean> {
    return bcrypt.compareSync(password, this.password);
  }

  declare static associations: {
    characters: Association<Player, Character>;
  };
}

export const playersInit = (sequelize: Sequelize) => {
  Player.init(
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      currency: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1000,
      },
      fiveStarPity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      fourStarPity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      threeStarPity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSaltSync(10, 'a');
            user.password = bcrypt.hashSync(user.password, salt);
          }
        },
        beforeUpdate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSaltSync(10, 'a');
            user.password = bcrypt.hashSync(user.password, salt);
          }
        },
      },
      sequelize,
      tableName: 'players',
    }
  );
};
