import { Op } from 'sequelize';

import { SourceFieldValues } from '../models/SourceFieldValues';
import { Fields, TemplatesFieldsAssoc, Sources } from '../models';
import { validateAllRequiredFields } from '../validators';
import { sequelize } from '../database';

interface ReqBodyField {
  id: number,
  value: string
}

interface SourceResult {
  sourceId: number;
  sourceName: string;
  templateId: number;
  fieldId: number;
  value: string;
}

const strToBool = (str: string) => {
  return str === 'true' ? true : false;
}

export const CreateSource = async (templateId: number, id: number | undefined, name: string, reqfields: ReqBodyField[]) => {
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

  const [source, _] = await Sources.upsert({ id, name: name.trim() });
  const sourceId = source ? source.toJSON().id: id;
  const sfvData = await SourceFieldValues.bulkCreate(reqfields.map(f => ({ 
    sourceId,
    templateId, 
    fieldId: f.id, 
    value: f.value 
  })), {
    updateOnDuplicate: ['value', 'updatedAt'],
  })
  return {
    id: sourceId,
    name: source.name,
    templateId,
    fields: sfvData.map((field) => field.toJSON()).map((field) => ({ id: field.fieldId, value: field.value }))
  }
}

export const GetSource = async (sourceId: number) => {
  const source = await Sources.findByPk(sourceId);
  if (source === null) {
    throw new Error(`No source with sourceId: ${sourceId}`);
  }
  const sourceFieldValues = await SourceFieldValues.findAll({
    where: {
      sourceId
    },
  })
  const values = sourceFieldValues.map((f) => f.toJSON());
  return {
    id: sourceId,
    name: source.toJSON().name,
    field: values.map((f) => ({ id: f.fieldId, value: f.value }))
  }
}

export const GetAllSources = async () => {
  const fields = await Fields.findAll({
    raw: true
  });
  const fieldMap = {};
  fields.forEach((field) => {
    // @ts-ignore
    fieldMap[field.id] = field;
  })
  const [res, _] = await sequelize.query(
    `select s.id as sourceId, s.name as sourceName, sfv.templateId as templateId, sfv.fieldId as fieldId, 
      sfv.value 
      from sources s
      join source_field_values sfv on sfv.sourceId = s.id`);
    const obj = {} as { [key:string]: any };
    (res as SourceResult[]).forEach((source) => {
      // @ts-ignore
      const value = fieldMap[source.fieldId].input_type === 'checkbox' ? strToBool(source.value) : source.value;
      if (obj[source.sourceName] === undefined) {
        obj[source.sourceName] = {
          id: source.sourceId,
          name: source.sourceName,
          templateId: source.templateId,
          fields: [{
            id: source.fieldId,
            value
          }]
        }
      } else {
        obj[source.sourceName].fields.push({
          id: source.fieldId,
          value
        })
      }
    })
    return Object.values(obj);
}

export const deleteSource = async (sourceId: number) => {
  await SourceFieldValues.destroy({
    where: {
      sourceId
    }
  })
  return Sources.destroy({
    where: {
      id: sourceId
    }
  })
}