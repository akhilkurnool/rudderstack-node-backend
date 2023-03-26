import { Fields } from '../models/Fields';

// @ts-ignore
export const CreateNewField = async (reqBody) => {
  const data = await Fields.create(reqBody);
  const res = data.toJSON();
  console.log(`New Field created with id: ${res.id}`);
  return res;
}

export const GetAllFields = async () => {
  return Fields.findAll({});
}


export const DeleteField = async (id: number) => {
  return Fields.destroy({
    where: {
      id
    }
  })
}