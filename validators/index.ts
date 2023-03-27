interface RequiredFields {
  [key: string]: 'string' | 'boolean' | 'number';
}

interface Fields {
  id: number;
  name: string;
  input_type: string;
  required: boolean;
}

const getSetDifference = (setA: Set<string|number>, setB: Set<string|number>) => {
  return [...setA].filter(element => !setB.has(element))
}

export const validateRequest = (req: any, reqiredFields: RequiredFields) => {
  if (typeof req !== 'object') return [false, 'request body expected to be JSON'];
  const requiredFieldKeys = new Set(Object.keys(reqiredFields));
  const foundFieldsSet = new Set<string>();
  for (let key in req) {
    const value = req[key];
    // Extra keys, we simply ignore
    if (!reqiredFields[key]) continue;
    foundFieldsSet.add(key);
    if (typeof value !== reqiredFields[key]) {
      return [false, `The expected value type for key: ${key} is ${reqiredFields[key]}`]
    }
  }
  if (foundFieldsSet.size !== requiredFieldKeys.size) {
    const missingKeysArr = getSetDifference(requiredFieldKeys, foundFieldsSet)
    return [false, `Some required keys are missing -> ${missingKeysArr}`]
  }
  return [true, ''];
}

export const validateRegex = (regex: string) => {
  let isValid = true;
  try {
      new RegExp(regex);
  } catch(e) {
      isValid = false;
  }
  return isValid
}

export const validateSelectOptions = (options: { label: string, value: string }[]) => {
  if (!Array.isArray(options) || options.length === 0) return false;
  const allValueSet = new Set<string>();
  for (let idx in options) {
    if (!options[idx].label || !options[idx].value) return false;
    if (allValueSet.has(options[idx].value)) return false;
    allValueSet.add(options[idx].value);
  }
  return true;
}

export const validateAllRequiredFields = (fields: Fields[], reqFields: { id: number, value: string | boolean }[]) => {
  const requiredFieldSet = new Set<number>(fields.filter(f => f.required).map(f => f.id));
  const foundFieldSet = new Set<number>();
  for (let i in reqFields) {
    const reqField = reqFields[i];
    if (!reqField.value) {
      return [false, 'Field value cannot be null or empty'];
    }
    const fieldArr = fields.filter((f) => f.id === reqField.id);
    if (fieldArr.length === 0) {
      return [false, `Invalid fieldId: ${reqField.id}`];
    }
    const field = fieldArr[0];
    if (field.required) foundFieldSet.add(field.id);
    if (field.input_type === 'checkbox' && typeof reqField.value !== 'boolean') {
      return [false, 'Checkbox value needs to be boolean'];
    }
  }
  if (requiredFieldSet.size !== foundFieldSet.size) {
    const missingKeysArr = getSetDifference(requiredFieldSet, foundFieldSet);
    const missingKeysSet = new Set(missingKeysArr);
    return [false, `Some required fields are missing -> ${fields.filter(f => missingKeysSet.has(f.id)).map(f => f.name)}`]
  }
  return [true, ''];
}