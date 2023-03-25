import { Templates } from '../models/Templates';
import { TemplatesFieldsAssoc } from '../models';

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

export const GetAllTemplates = async () => {
  return Templates.findAll({
    raw: true
  });
}