import { Templates } from '../models/Templates';
import { Fields, TemplatesFieldsAssoc } from '../models';
import { sequelize } from '../database';

interface TemplatesResult {
  templateId: number,
  templateName: string,
  fieldId: number,
  fieldName: string,
  input_type: string,
  label: string,
  required: number;
  regexErrorMessage: string | null,
  placeholder: string | null,
  regex: string | null,
  options: string | null
}

export const CreateNewTemplate = async (name: string, fieldIds?: Fields[]) => {
  const data = await Templates.create({ name })
  const res = data.toJSON();
  console.log(`New template created with id: ${res.id}`);
  if (!fieldIds || fieldIds.length === 0) return res;
  await TemplatesFieldsAssoc.bulkCreate(fieldIds.map((fieldId) => ({ templateId: res.id, fieldId })));
  return {
    id: res.id,
    name,
    fields: fieldIds
  }
}

export const AssociateFieldsToTemplate = async (templateId: number, fieldIds: number[]) => {
  return TemplatesFieldsAssoc.bulkCreate(fieldIds.map((fieldId) => ({ templateId, fieldId })));
}

export const DeleteAllTemplates = async () => {
  return Templates.drop();
}

export const GetTemplateById = async (id: number) => {
  const data = await Templates.findByPk(id);
  if (data === null) {
    console.error(`No template found with Id: ${id}`)
    throw new Error(`No template found with Id: ${id}`);
  }
  return data;
}

// improve this!!, sequlize joins are not workding as expected, using raw query for now
export const GetAllTemplates = async () => {
  const [res, _] = await sequelize.query(
    `select t.id as templateId, t.name as templateName, f.id as fieldId, f.name as fieldName, 
      f.input_type, f.label, f.regexErrorMessage, f.placeholder, f.required, f.regex, f.options from templates t
      join template_field_assoc tfa on tfa.templateId = t.id
      join fields f on tfa.fieldId = f.id`);
  const obj = {} as { [key:string]: any };
  (res as TemplatesResult[]).forEach((template) => {
    if (obj[template.templateName] === undefined) {
      obj[template.templateName] = {
        id: template.templateId,
        name: template.templateName,
        fields: []
      }
    }
    console.log('template? ', template);
    obj[template.templateName].fields.push({
      id: template.fieldId,
      name: template.fieldName,
      label: template.label,
      input_type: template.input_type,
      regexErrorMessage: template.regexErrorMessage || undefined,
      placeholder: template.placeholder || undefined,
      regex: template.regex || undefined,
      required: template.required === 1 ? true : false,
      options: template.options ? JSON.parse(template.options) : undefined
    })
  })
  return Object.values(obj);
}