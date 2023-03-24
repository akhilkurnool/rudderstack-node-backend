import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT;

const app: Express = express();

app.use(express.json());

app.listen(port, () => {
  console.log('Im running');
});