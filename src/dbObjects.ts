import {Sequelize} from 'sequelize';
import {charactersInit} from './models/Characters';

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'database.sqlite',
});

charactersInit(sequelize);
