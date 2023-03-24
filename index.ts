import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT;

const sequelize = require('./database');
const Templates = require('./models/Templates');

sequelize.sync().then(() => {
  console.log('DB is ready')
});

const app: Express = express();

app.use(express.json());

app.post('/templates', (req: Request, res: Response) => {
  Templates.create(req.body).then((data) => {
    console.log('New template created!');
    res.send(data.toJSON());
  })
});

app.get('/templates', (req: Request, res: Response) => {
  Templates.findAll().then((data) => {
    console.log('data? ', data)
    res.send(data.toJSON());
  });
});

app.delete('/templates', (req: Request, res: Response) => {

});

app.listen(port, () => {
  console.log('Im running');
});