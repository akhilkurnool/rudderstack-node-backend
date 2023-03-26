import { Sequelize } from 'sequelize';

const db = process.env.DB_NAME!;
const user = process.env.DB_USERNAME!;
const password = process.env.DB_PASS!;
const host = process.env.HOST!;

export const sequelize = new Sequelize(db, user, password, {
  dialect: 'sqlite',
  host
});
