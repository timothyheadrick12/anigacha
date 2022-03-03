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
  declare id: CreationOptional<number>;
  declare character_id: number;
  declare name: string;
  declare anime: string;
  declare owner_id: number | null;
  declare popularity: number;
  declare rarity: string;
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
        type: DataTypes.INTEGER,
        allowNull: true,
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
