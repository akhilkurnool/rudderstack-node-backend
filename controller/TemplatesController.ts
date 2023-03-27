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
  regexErrorMessage: string | null,
  placeholder: string | null,
  regex: string | null,
  options: string | null
}

export const CreateNewTemplate = async (name: string) => {
  const data = await Templates.create({ name })
  const res = data.toJSON();
  console.log(`New template created with id: ${res.id}`);
  return res;
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
    `select t.id as templateId, t.name as templateName, f.id as fieldId, f.name as fieldName, f.input_type, f.label, f.regexErrorMessage, f.placeholder, f.regex, f.options from templates t
      join template_field_assoc tfa on tfa.templateId = t.id
      join fields f on tfa.fieldId = f.id`);
  console.log('a ', res);
  const obj = {} as { [key:string]: any };
  (res as TemplatesResult[]).forEach((template) => {
    if (obj[template.templateName] === undefined) {
      obj[template.templateName] = {
        id: template.templateId,
        name: template.templateName,
        fields: [{
          id: template.fieldId,
          name: template.fieldName,
          label: template.label,
          regexErrorMessage: template.regexErrorMessage || undefined,
          placeholder: template.placeholder || undefined,
          regex: template.regex || undefined,
          options: template.options ? JSON.parse(template.options) : undefined
        }]
      }
    } else {
      obj[template.templateName].fields.push({
        id: template.fieldId,
          name: template.fieldName,
          label: template.label,
          regexErrorMessage: template.regexErrorMessage || undefined,
          placeholder: template.placeholder || undefined,
          regex: template.regex || undefined,
          options: template.options ? JSON.parse(template.options) : undefined
      })
    }
  })
  return Object.values(obj);
}