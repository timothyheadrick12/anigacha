import {Sequelize} from 'sequelize';
import {charactersInit} from './models/Characters';

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'database.sqlite',
});

charactersInit(sequelize);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({force});
