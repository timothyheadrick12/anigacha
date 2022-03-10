//Creates the database, called using "yarn initdb"
//add "-f" to force reset the databse even if data exists.

import {Sequelize} from 'sequelize';
import {charactersInit} from './models/Characters';
import {playersInit} from './models/Players';
import Character from './models/Characters';
import Player from './models/Players';

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'database.sqlite',
});

charactersInit(sequelize);
playersInit(sequelize);

// Here we associate which actually populates out pre-declared `association` static
// and other methods for Player.
Player.hasMany(Character, {
  sourceKey: 'id',
  foreignKey: 'owner_id',
  as: 'characters', // this determines the name in `associations`!
});

Character.belongsTo(Player);

Player.hasOne(Character, {
  as: 'primaryCharacter',
});

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({force});
