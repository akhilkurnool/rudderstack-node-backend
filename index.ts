import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import * as Models from './models';

import { sequelize } from './database';

import * as TemplatesController from './controller/TemplatesController';
import * as FieldsController from './controller/FieldsController';
import * as SourcesController from './controller/SourcesController';

import * as RouteHandlers from './routeHandlers';

import { validateRequest, validateRegex, validateSelectOptions } from './validators';
import { Routes } from './routes';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config();
}

const port = process.env.PORT;

// Do not use force in prod. !!!IMP!!!
sequelize.sync(
  // { force: true }
  // { alter: true }
).then(() => {
  console.log('DB is ready ')
});

const app: Express = express();

app.use(express.json());

app.get('/', (req, res) => res.send('Hi'))

app.post(Routes.Templates, RouteHandlers.postTemplate);

app.get(Routes.Templates, RouteHandlers.getTemplates);

app.post(Routes.TemplateAssociateFields, RouteHandlers.postTemplateFieldAssociation);

app.delete(Routes.Templates, RouteHandlers.deleteTemplate);

app.get(Routes.Fields, RouteHandlers.getAllFields);

app.post(Routes.Fields, RouteHandlers.postFields);

app.delete(Routes.Field, RouteHandlers.deleteFields);

app.post(Routes.Sources, RouteHandlers.postSources);

app.get(Routes.Source, RouteHandlers.getSource);

app.listen(port, () => {
  console.log('Im running');
});