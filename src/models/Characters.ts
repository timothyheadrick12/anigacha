import {Model, InferAttributes, DataTypes, Sequelize} from 'sequelize';
export default class Character extends Model<InferAttributes<Character>> {
  declare id: number;
  declare name: string;
  declare anime: string;
  declare popularity: number;
  declare rarity: string;
}

export const charactersInit = (sequelize: Sequelize) => {
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
      tableName: 'characters',
    }
  );
};
