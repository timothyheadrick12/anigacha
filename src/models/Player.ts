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
} from "sequelize";
import Character from "./Characters";
export default class Player extends Model<
  InferAttributes<Player>,
  InferCreationAttributes<Player>
> {
  declare id: number;
  declare name: string;
  declare anime: string;
  declare popularity: number;
  declare rarity: string;

  declare getCharacters: HasManyGetAssociationsMixin<Character>;
  declare addCharacter: HasManyAddAssociationMixin<Character, number>;
  declare addCharacters: HasManyAddAssociationsMixin<Character, number>;
  declare setCharacter: HasManySetAssociationsMixin<Character, number>;
  declare removeCharacter: HasManyRemoveAssociationMixin<Character, number>;
  declare removeCharacters: HasManyRemoveAssociationsMixin<Character, number>;
  declare hasCharacter: HasManyHasAssociationMixin<Character, number>;
  declare hasCharacters: HasManyHasAssociationsMixin<Character, number>;
  declare countCharacter: HasManyCountAssociationsMixin;
  declare createCharacter: HasManyCreateAssociationMixin<Character, "owner_id">;

  declare static associations: {
    characters: Association<Player, Character>;
  };
}

export const playersInit = (sequelize: Sequelize) => {
  Character.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      anime: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      popularity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rarity: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "characters",
    }
  );
};
