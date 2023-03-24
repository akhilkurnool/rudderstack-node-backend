import { Sequelize } from 'sequelize';

const db = process.env.DB_NAME!;
const user = process.env.DB_USERNAME!;
const password = process.env.DB_PASS!;

export const sequelize = new Sequelize(db, user, password, {
  dialect: 'sqlite',
  host: './db.sqlite'
});
