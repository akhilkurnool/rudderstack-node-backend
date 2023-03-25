import { Sources } from '../models/Sources';

export const CreateSource = async (reqBody) => {
  const data = await Sources.create(reqBody);
  const res = data.toJSON();
  console.log(`New Data Source created with id: ${res.id}`);
  return res;
}
