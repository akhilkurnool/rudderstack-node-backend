import express, { Express, Request, Response } from 'express';

import * as TemplatesController from './controller/TemplatesController';
import * as FieldsController from './controller/FieldsController';
import * as SourcesController from './controller/SourcesController';

import { validateRequest, validateRegex, validateSelectOptions } from './validators';

export const postTemplate = async (req: Request, res: Response) => {
  const [isValid, reason] = validateRequest(req.body, { name: 'string' });
  if (!isValid) {
    return res.status(400).json({ message: reason })
  }
  TemplatesController.CreateNewTemplate(req.body.name).then((data) => {
    res.send(data);
  }).catch((err) => {
    return res.status(500).json({ error: err });
  });
};

export const getTemplates = async (req: Request, res: Response) => {
  TemplatesController.GetAllTemplates()
    .then((data) => {
      res.send(data);
    }).catch((error) => {
      return res.status(500).json({ error: error })
    })
}

export const postTemplateFieldAssociation = async (req: Request, res: Response) => {
  const templateId = Number(req.params.templateId);
  TemplatesController.AssociateFieldsToTemplate(templateId, req.body.fieldIds).then(() => {
    res.send('Success');
  }).catch((error) => {
    return res.status(500).json({ error })
  })
}

export const deleteTemplate = async (req: Request, res: Response) => {
  TemplatesController.DeleteAllTemplates().then(() => {
    res.json({ message: 'Dropped table' })
  }).catch((error) => {
    return res.status(500).json({ error })
  })
}

export const getAllFields = async (req: Request, res: Response) => {
  FieldsController.GetAllFields().then((data) => {
    res.send(data);
  }).catch((error) => {
    return res.status(500).json({ error });
  })
}

export const postFields = async (req: Request, res: Response) => {
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
}

export const deleteFields = async (req: Request, res: Response) => {
  FieldsController.DeleteField(Number(req.params.fieldId)).then(() => {
    res.send(`Deleted field witd id ${req.params.fieldId}`)
  }).catch((error) => {
    return res.status(500).json({ error });
  })
}

export const postSources = async (req: Request, res: Response) => {
  const body = req.body;
  const templateId = Number(body.templateId);
  const name = body.name;
  SourcesController.CreateSource(templateId, name, body.fields).then((data) => {
    res.send(data);
  }).catch((error) => {
    return res.status(400).json({ error: error.message });
  })
}

export const getAllSources = async (req: Request, res: Response) => {
  SourcesController.GetAllSources().then((data) => {
    res.send(data)
  }).catch((error) => {
    return res.status(500).json({ error });
  })
}

export const getSource = async (req: Request, res: Response) => {
  const sourceId = req.params.sourceId;
  const id = Number(sourceId);
  SourcesController.GetSource(id).then((data) => {
    res.send(data)
  }).catch((error) => {
    return res.status(400).json({ error: error.message });
  })
}