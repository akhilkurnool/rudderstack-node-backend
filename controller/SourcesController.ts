import { Op } from 'sequelize';

import { SourceFieldValues } from '../models/SourceFieldValues';
import { Fields, TemplatesFieldsAssoc, Sources } from '../models';
import { validateAllRequiredFields } from '../validators';

interface ReqBodyField {
  id: number,
  value: string
}

export const CreateSource = async (templateId: number, name: string, reqfields: ReqBodyField[]) => {
  if (!reqfields || reqfields.length === 0) {
    throw new Error('fields key cannot be empty');
  }
  if (!name.trim()) {
    throw new Error('name cannot be empty');
  }
  const templateRow = await Fields.findByPk(templateId);
  if (templateRow ===  null) {
    throw new Error(`Invalid templateId: ${templateId}`);
  }
  const TempateFieldsAssoc = await TemplatesFieldsAssoc.findAll({
    where: {
      templateId
    },
  });
  if (TempateFieldsAssoc.length === 0) {
    throw new Error(`No fields associated with templateId: ${templateId}`)
  }
  const fieldIds = TempateFieldsAssoc.map((tfa) => tfa.toJSON().fieldId);
  const fieldsObj = await Fields.findAll({
    where: {
      id: {
        [Op.in]: fieldIds
      }
    }
  });
  const fields = fieldsObj.map(f => f.toJSON());
  const [isValid, reason] = validateAllRequiredFields(fields, reqfields);
  if (!isValid) {
    throw new Error(reason as string)
  }
  const data = await Sources.create({ name: name.trim() });
  const id = data.toJSON().id;
  return SourceFieldValues.bulkCreate(reqfields.map(f => ({ 
    sourceId: id,
    templateId, 
    fieldId: f.id, 
    value: f.value 
  })))
}

export const GetSource = async (sourceId: number) => {
  const source = await Sources.findByPk(sourceId);
  if (source === null) {
    throw new Error(`No source with sourceId: ${sourceId}`);
  }
  const sourceFieldValues = await SourceFieldValues.findAll({
    where: {
      sourceId
    }
  })
  const values = sourceFieldValues.map((f) => f.toJSON());
  return {
    id: sourceId,
    name: source.toJSON().name,
    field: values.map((f) => ({ id: f.fieldId, value: f.value }))
  }
}
