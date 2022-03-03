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
} from 'sequelize';
import Character from './Characters';
export default class Player extends Model<
  InferAttributes<Player>,
  InferCreationAttributes<Player>
> {
  declare id: string;
  declare name: string;

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
    },
    {
      sequelize,
      tableName: 'players',
    }
  );
};
