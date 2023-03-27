import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config();
}

const db = process.env.DB_NAME!;
const user = process.env.DB_USERNAME!;
const password = process.env.DB_PASS!;
const host = process.env.HOST!;

export const sequelize = new Sequelize(db, user, password, {
  dialect: 'sqlite',
  host
});