import { Request, Response } from 'express';

interface RequiredFields {
  [key: string]: 'string' | 'boolean' | 'number';
}

// interface Json {
//   [key: string]: any;
// }

const getSetDifference = (setA: Set<string>, setB: Set<string>) => {
  return [...setA].filter(element => !setB.has(element))
}

export const validateRequest = (req: any, reqiredFields: RequiredFields) => {
  if (typeof req !== 'object') return [false, 'request body expected to be JSON'];
  const requiredFieldKeys = new Set(Object.keys(reqiredFields));
  const foundFieldsSet = new Set<string>();
  console.log('validateRequest? ')
  for (let arr in Object.entries(req)) {
    const key = arr[0];
    const value = arr[1];
    // Extra keys, we simply ignore
    if (!reqiredFields[key]) continue;
    if (foundFieldsSet.has(key)) {
      // ideally this should never trigger
      return [false, 'Duplicate key exists!']
    }
    foundFieldsSet.add(key);
    if (typeof value !== reqiredFields[key]) {
      return [false, `The expected value type for key: ${key} is ${reqiredFields[key]}`]
    }
    if (foundFieldsSet.size !== requiredFieldKeys.size) {
      const missingKeysArr = getSetDifference(requiredFieldKeys, foundFieldsSet)
      return [false, `Some required keys are missing -> ${missingKeysArr}`]
    }
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