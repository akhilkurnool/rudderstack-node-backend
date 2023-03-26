import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import * as Models from './models';

import { sequelize } from './database';

import * as TemplatesController from './controller/TemplatesController';
import * as FieldsController from './controller/FieldsController';
import * as SourcesController from './controller/SourcesController';

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

app.post(Routes.Templates, async (req: Request, res: Response) => {
  const [isValid, reason] = validateRequest(req.body, { name: 'string' });
  if (!isValid) {
    return res.status(400).json({ message: reason })
  }
  TemplatesController.CreateNewTemplate(req.body.name).then((data) => {
    res.send(data);
  }).catch((err) => {
    return res.status(500).json({ error: err });
  });
});

app.get(Routes.Templates, (req: Request, res: Response) => {
  TemplatesController.GetAllTemplates().then((data) => {
    res.send(data);
  }).catch((error) => {
    return res.status(500).json({ error: error })
  })
});

app.post(Routes.TemplateAssociateFields, async (req: Request, res: Response) => {
  const templateId = Number(req.params.templateId);
  TemplatesController.AssociateFieldsToTemplate(templateId, req.body.fieldIds).then(() => {
    res.send('Success');
  }).catch((error) => {
    return res.status(500).json({ error })
  })
});

app.delete(Routes.Templates, (req: Request, res: Response) => {
  TemplatesController.DeleteAllTemplates().then(() => {
    res.json({ message: 'Dropped table' })
  }).catch((error) => {
    return res.status(500).json({ error })
  })
});

app.get(Routes.Fields, (req: Request, res: Response) => {
  FieldsController.GetAllFields().then((data) => {
    res.send(data);
  }).catch((error) => {
    return res.status(500).json({ error });
  })
});


app.post(Routes.Fields, async (req: Request, res: Response) => {
  const [isValid, reason] = validateRequest(req.body, { name: 'string', label: 'string', input_type: 'string', required: 'boolean' });
  if (!isValid) {
    return res.status(400).json({ message: reason })
  }
  if (req.body.regex && !validateRegex(req.body.regex)) {
    return res.status(400).json({ message: 'Invalid regex experssion' });
  }
  if (req.body.options && !validateSelectOptions(req.body.options)) {
    return res.status(400).json({ message: 'Invalid options parameter, required { label: string, value: string }[]' })
  }
  FieldsController.CreateNewField(req.body).then((data) => {
    res.send(data);
  }).catch((err) => {
    return res.status(500).json({ error: err });
  });
});

app.delete(Routes.Field, async (req: Request, res: Response) => {
  FieldsController.DeleteField(Number(req.params.fieldId)).then(() => {
    res.send(`Deleted field witd id ${req.params.fieldId}`)
  }).catch((error) => {
    return res.status(500).json({ error });
  })
});

app.post(Routes.Sources, async (req: Request, res: Response) => {
  const body = req.body;
  const templateId = Number(body.templateId);
  const name = body.name;
  SourcesController.CreateSource(templateId, name, body.fields).then((data) => {
    res.send(data);
  }).catch((error) => {
    return res.status(400).json({ error: error.message });
  })
});

app.get(Routes.Source, async (req: Request, res: Response) => {
  const sourceId = req.params.sourceId;
  const id = Number(sourceId);
  SourcesController.GetSource(id).then((data) => {
    res.send(data)
  }).catch((error) => {
    return res.status(400).json({ error: error.message });
  })
});

app.listen(port, () => {
  console.log('Im running');
});